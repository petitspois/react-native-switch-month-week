import { StyleSheet } from 'react-native'
import React, { useRef, useCallback, useEffect, useContext } from 'react'
import InfiniteList from '../../InfiniteList'
import { sameMonth, getRowAboveTheWeek, getRowInPage } from '../../Utils';
import { NUMBER_OF_PAGES } from '../../Constants';
import Month from '../Month';
import { UpdateSources } from '../../Constants/type';
import CalendarContext from '../../Context';
import type { MarkedDates } from '../type';
import { ReturnStyles } from '../../Assets/style/types';

interface MonthCalendarProps {
	initDate: string;
	layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
	firstDay?: number;
	dataSource: string[];
	markedDates: MarkedDates | undefined;
	updateMonthPosition: (rows: number) => void;
	monthChanged?: (date: string) => void;
	isEdge: (date: string) => { isStartEdge: boolean, isEndEdge: boolean }
	disablePanChange: (disabled: boolean) => void;
	styles: ReturnStyles;
	isLunar?: boolean;
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {

	const { isEdge, initDate, layout, updateMonthPosition, dataSource, markedDates, disablePanChange, firstDay, ...otherProps } = props;
	const context = useContext(CalendarContext)
	const { date, prevDate, updateSource } = context;
	const list = useRef<any>();
	// state
	const extraData = {
		date: context.date,
		firstDay
	}

	const onPageChange = useCallback((pageIndex: number, _prevPageIndex: number | undefined, { scrolledByUser }: any) => {
		// TODO: 点击不同月份的日期，不需要执行对应-2的逻辑
		if (
			list.current.props.mode === 'month' &&
			scrolledByUser
		) {
			updateMonthPosition(0)
			context?.setDate(dataSource[pageIndex], UpdateSources.MONTH_SCROLL)
		}
	}, []);

	const onDayPress = useCallback((newDate: string) => {
		const row = isEdge(newDate).isEndEdge ? getRowInPage(newDate, firstDay) : isEdge(newDate).isStartEdge ? 0 : getRowAboveTheWeek(newDate, firstDay);
		updateMonthPosition(row)
		context?.setDate(newDate, UpdateSources.MONTH_DAY_PRESS);
	}, [dataSource])

	const renderItem = useCallback((_type: any, item: string) => {
		return (
			<Month key={item} firstDay={firstDay} markedDates={markedDates} isEdge={isEdge} layout={layout} current={date} date={item} onDayPress={onDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [date, markedDates, otherProps?.styles, firstDay]);

	const onScrollBeginDrag = () => {
		disablePanChange(true);
	}

	const onMomentumScrollEnd = () => {
		disablePanChange(false);
	}

	useEffect(() => {
		/**
		 *  TODO: 
		 *  1.根据周点击的日期，更新月的位置
		 *  2.时间边缘不处理
		 */
		if (
			!sameMonth(prevDate, date) &&
			(
				updateSource === UpdateSources.WEEK_SCROLL || 
				updateSource === UpdateSources.WEEK_DAY_PRESS 
			)
		) {
			const pageIndex = dataSource.findIndex(item => sameMonth(item, date))
			// TODO: 超过边界不需要处理
			if (pageIndex !== -1) {
				disablePanChange(true);
				list.current?.scrollToIndex?.(pageIndex, false);
			}
		}


		/**
		 *  TODO:-2
		 *  点击不是本月的日期，需要滚动到下一个月
		 */
		if (updateSource === UpdateSources.MONTH_DAY_PRESS) {
			if (
				!sameMonth(prevDate, date) &&
				!(isEdge(date).isEndEdge || isEdge(date).isStartEdge)
			) {
				disablePanChange(true);
				const index = dataSource.findIndex(item => sameMonth(item, date))
				list.current?.scrollToIndex?.(index, true);
			}
		}


	}, [date, updateSource])


	return (
		<InfiniteList
			key={`list_${firstDay}`}
			isHorizontal
			mode="month"
			ref={list}
			data={dataSource}
			renderItem={renderItem}
			extendedState={extraData}
			// style={style.current.container}
			initialPageIndex={NUMBER_OF_PAGES}
			pageHeight={layout.itemHeight * 6}
			pageWidth={layout.containerWidth}
			onPageChange={onPageChange}
			scrollViewProps={{
				onScrollBeginDrag,
				onMomentumScrollEnd,
			}}
		/>
	)
}

export default MonthCalendar

const styles = StyleSheet.create({})
