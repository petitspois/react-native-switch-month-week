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


interface WeekCalendarProps {
	initDate: string;
	mode: 'week' | 'month';
	layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
	dataSource: string[];
	updateMonthPosition: (rows: number) => void;
	monthChanged?: (date: string) => void;
	isEdge: (date: string) => { isStartEdge: boolean, isEndEdge: boolean }
	themes: ITheme;
}

const WeekCalendar: React.FC<WeekCalendarProps> = (props) => {

	const { initDate, mode, layout, updateMonthPosition, dataSource, isEdge, ...otherProps } = props;
	const context = useContext(CalendarContext)
	const { date, prevDate, updateSource } = context;
	const initialIndex = useMemo(() => dataSource.findIndex(item => sameWeek(item, initDate)), [])
	const list = useRef<any>();
	const prevWeek = useRef<number>(moment(date).day());

	// state
	const extraWeekData = {
		date: context.date,
	}


	const onPageChange = useCallback((page: ViewToken, prevPage: ViewToken, { scrolledByUser }: any) => {
		if (
			// !scrolledByDifferent.current &&
			// list.current.props.mode === 'week'
			scrolledByUser
		) {
			// 上一页选中的是星期几
			const prevDay = prevWeek.current;
			// 当前周第一天周日
			const weekFirstDay = page.item;
			const weekCurrent = moment(weekFirstDay).add(prevDay, 'days').format(DATE_FORMAT);
			const rows = getRowAboveTheWeek(weekCurrent)
			if (isEdge(weekCurrent).isEndEdge) {
				updateMonthPosition(getRowInPage(weekCurrent));
			} else {
				updateMonthPosition(rows)
			}
			context?.setDate(weekCurrent, UpdateSources.WEEK_SCROLL)
		}
	}, [date]);


	const renderWeekItem = useCallback(({ item, index, target }: ListRenderItemInfo<string>) => {
		return (
			<Week layout={layout} mode={mode} current={date} date={item} onDayPress={onDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [date]);


	const onDayPress = (value: string) => {

		console.log('valuem :>> ', value, date);
		// 	// 点击周新旧数据不是本月，需要重新定位
		// if(!sameMonth(value, currentDate)){
		// 	if(
		// 		isWeekEdge(value).isEndEdge
		// 	){
		// 		console.log('getRowAboveTheWeek(value) :>> ', getRowAboveTheWeek(moment(value).subtract(1, 'month').endOf('month').format('YYYY-MM-DD')), getRowAboveTheWeek(value), value);
		// 	}
		// 	return;
		// 	updateMonthTranslateRef(getRowAboveTheWeek(value))
		// }
		if (isEdge(value).isEndEdge) {
			updateMonthPosition(getRowInPage(value));
		}
		prevWeek.current = moment(value).day();
		context?.setDate(value, UpdateSources.WEEK_DAY_PRESS)
	}


	useEffect(() => {
		// TODO: 根据月点击的日期，更新周的位置
		// if (
		// 	!sameWeek(prevDate, date) &&
		// 	(updateSource === UpdateSources.MONTH_SCROLL || updateSource === UpdateSources.MONTH_DAY_PRESS)
		// ) {
		// 	const index = dataSource.findIndex(item => sameWeek(item, date));
		// 	list.current?.scrollToIndex?.({animated:true, index});
		// }
	}, [date])


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
			/>
	)
}


export default WeekCalendar

const styles = StyleSheet.create({})

