import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameWeek, sameMonth, getRowAboveTheWeek, getRowInPage } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
import { UpdateSources } from '../../Constants/type';
import Week from '../Week';
import moment from 'moment';
import { ITheme } from '../../Constants/type';
import CalendarContext from '../../Context';
import { ListRenderItemInfo, ViewToken } from '@shopify/flash-list';
import type { MarkedDates } from '../type';
import { ReturnStyles } from '../../Assets/style/types';


interface WeekCalendarProps {
	initDate: string;
	layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
	dataSource: string[];
	markedDates: MarkedDates | undefined;
	updateMonthPosition: (rows: number) => void;
	monthChanged?: (date: string) => void;
	isEdge: (date: string) => { isStartEdge: boolean, isEndEdge: boolean }
	disablePanChange: (disabled: boolean) => void;
	styles: ReturnStyles;

}

const WeekCalendar: React.FC<WeekCalendarProps> = (props) => {

	const { initDate, layout, updateMonthPosition, dataSource, isEdge, markedDates, disablePanChange, ...otherProps } = props;
	const context = useContext(CalendarContext)
	const { date, prevDate, updateSource } = context;
	const initialIndex = useMemo(() => dataSource.findIndex(item => sameWeek(item, initDate)), [])
	const list = useRef<any>();
	const prevWeek = useRef<number>(moment(date).day());

	// state
	const extraWeekData = {
		date: context.date,
	}



	const onPageChange = useCallback((pageIndex: number, _prevPageIndex: number | undefined, { scrolledByUser }: any) => {
		if (
			list.current.props.mode === 'week' &&
			scrolledByUser
		) {
			// 上一页选中的是星期几
			const prevDay = prevWeek.current;
			// 当前周第一天周日
			const weekFirstDay = dataSource[pageIndex];
			const weekCurrent = moment(weekFirstDay).add(prevDay, 'days').format(DATE_FORMAT);
			const rows = getRowAboveTheWeek(weekCurrent)
			if (isEdge(weekCurrent).isEndEdge) {
				updateMonthPosition(getRowInPage(weekCurrent));
			} else if (isEdge(weekCurrent).isStartEdge) {
				updateMonthPosition(0);
			}
			else {
				updateMonthPosition(rows)
			}
			context?.setDate(weekCurrent, UpdateSources.WEEK_SCROLL)
		}
	}, [date]);


	const renderWeekItem = useCallback((_type: any, item: string) => {
		return (
			<Week key={item} markedDates={markedDates} layout={layout} current={date} date={item} onDayPress={onDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [date, markedDates, otherProps?.styles]);


	const onDayPress = (value: string) => {

		updateMonthPositionHandler(value);
		prevWeek.current = moment(value).day();
		context?.setDate(value, UpdateSources.WEEK_DAY_PRESS)
	}

	const onScrollBeginDrag = () => {
		disablePanChange(true);
	}

	const onMomentumScrollEnd = () => {
		disablePanChange(false);
	}

	const updateMonthPositionHandler = (date: string) => {
		if (isEdge(date).isEndEdge) {
			updateMonthPosition(getRowInPage(date));
		} else if (isEdge(date).isStartEdge) {
			updateMonthPosition(0);
		} else {
			updateMonthPosition(getRowAboveTheWeek(date))
		}
	}


	useEffect(() => {
		// TODO: 根据月点击的日期，更新周的位置
		if (
			!sameWeek(prevDate, date) &&
			(
				updateSource === UpdateSources.MONTH_SCROLL ||
				updateSource === UpdateSources.MONTH_DAY_PRESS
			)
		) {
			disablePanChange(true);
			const index = dataSource.findIndex(item => sameWeek(item, date));
			list.current?.scrollToIndex?.(index, false);
		}
		
	}, [date, updateSource])


	return (
		<InfiniteList
			key="week-list"
			mode="week"
			isHorizontal
			ref={list}
			data={dataSource}
			renderItem={renderWeekItem}
			extendedState={extraWeekData}
			initialPageIndex={initialIndex}
			pageHeight={layout.itemHeight}
			pageWidth={layout.containerWidth}
			onPageChange={onPageChange}
			scrollViewProps={{
				onScrollBeginDrag,
				onMomentumScrollEnd,
			}}
		/>
	)
}


export default WeekCalendar

const styles = StyleSheet.create({})

