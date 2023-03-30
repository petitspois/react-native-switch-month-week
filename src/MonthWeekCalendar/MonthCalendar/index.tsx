import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameMonth, getRowAboveTheWeek, getRowInPage } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
import { ITheme } from '../../Constants/type';
import Month from '../Month';
import moment from 'moment';
import { UpdateSources } from '../../Constants/type';
import CalendarContext from '../../Context';

interface MonthCalendarProps {
	initDate: string;
	mode: 'week' | 'month';
	layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
	dataSource: string[];
	updateMonthPosition: (rows: number) => void;
	onMonthDayPress: (value: any, cols: number) => void;
	monthChanged?: (date: string) => void;
	isEdge: (date: string) => { isStartEdge: boolean, isEndEdge: boolean }
	themes: ITheme
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {

	const { isEdge, initDate, mode, layout, onMonthDayPress, updateMonthPosition, dataSource, ...otherProps } = props;
	const context = useContext(CalendarContext)
	const { date, prevDate, updateSource } = context;
	const list = useRef<any>();
	const scrolledByDifferent = useRef<boolean>(false);
	// state
	const extraData = {
		date: context.date
	}

	const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
		// TODO: 点击不同月份的日期，不需要执行对应-2的逻辑
		if (
			!scrolledByDifferent.current &&
			list.current.props.mode === 'month'
		) {
			updateMonthPosition(0)
			context?.setDate(dataSource[pageIndex], UpdateSources.MONTH_SCROLL)
		}
	}, [dataSource, updateSource]);

	const onDayPress = useCallback((newDate: string) => {
		const rows = isEdge(newDate).isEndEdge ? getRowInPage(newDate) : isEdge(newDate).isStartEdge ? 0 : getRowAboveTheWeek(newDate);
		updateMonthPosition(rows)
		context?.setDate(newDate, UpdateSources.MONTH_DAY_PRESS);
	}, [])

	const renderItem = useCallback((_type: any, item: string) => {
		return (
			<Month isEdge={isEdge} layout={layout} mode={mode} current={date} date={item} onDayPress={onDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [date]);


	const onMomentumScrollEnd = () => {
		if(scrolledByDifferent.current){
			scrolledByDifferent.current = false;
		}
	}

	useEffect(() => {
		/**
		 *  TODO: 
		 *  1.根据周点击的日期，更新月的位置
		 *  2.时间边缘不处理
		 */
		if (
			!sameMonth(prevDate, date) &&
			(updateSource === UpdateSources.WEEK_SCROLL || updateSource === UpdateSources.WEEK_DAY_PRESS)
		) {
			const pageIndex = dataSource.findIndex(item => sameMonth(item, date))
			// TODO: 超过边界不需要处理
			if (pageIndex !== -1) {
				scrolledByDifferent.current = true;
				list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, false);
			}
		}

		if (updateSource === UpdateSources.MONTH_DAY_PRESS) {
			if (
				!sameMonth(prevDate, date) &&
				!(isEdge(date).isEndEdge || isEdge(date).isStartEdge)
			) {
				/**
				 *  TODO:-2
				 *  点击不是本月的日期，需要滚动到下一个月
				 */
				console.log('33333 :>> ', 33333);
				scrolledByDifferent.current = true;
				const pageIndex = dataSource.findIndex(item => sameMonth(item, date))
				list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, true);
			}
		}

	}, [date])


	return (
		<InfiniteList
			key="list"
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
				showsHorizontalScrollIndicator: false,
				onMomentumScrollEnd
			}} />
	)
}

export default MonthCalendar

const styles = StyleSheet.create({})
