import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameWeek } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
import Week from '../Week';
import XDate from 'xdate';
import moment from 'moment';

interface WeekCalendarProps {
	initDate: string;
	mode: 'week' | 'month';
	current: string;
	layout: {
		containerWidth: number;
		itemWidth: number;
	},
	dataSource: string[];
	setCurrent: (date: string) => void;
	onWeekDayPress: (value: any) => void;
	onWeekPageChange: (prevDate: string, curDate: string, current: string) => void;
}

const areEqual = (prevProps: WeekCalendarProps, nextProps: WeekCalendarProps) => {
	if (prevProps.current !== nextProps.current) {
		return false;
	}
	return true;
}

const WeekCalendar: React.FC<WeekCalendarProps> = (props) => {

	const { initDate, mode, layout, current, onWeekDayPress, onWeekPageChange, setCurrent, dataSource } = props;

	const list = useRef<any>();
	const prevCurrent = useRef(current);
	// state
	const extraWeekData = {
		current,
	}
	const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
		if (scrolledByUser) {
			// 上一页选中的是星期几
			const prevDay = moment(current).day();
			// 当前周第一天周日
			const weekFirstDay = dataSource[pageIndex];
			const weekCurrent = moment(weekFirstDay).add(prevDay, 'days').format(DATE_FORMAT);
			onWeekPageChange && onWeekPageChange?.(dataSource[_prevPage], dataSource[pageIndex], weekCurrent)
			setCurrent(weekCurrent);

		}
	}, [dataSource, current]);


	const renderWeekItem = useCallback((_type: any, item: string) => {
		console.log(item)
		return (
			<Week key={item} current={current} date={item} onDayPress={onWeekDayPress} containerWidth={layout.containerWidth} />
		)
	}, [current]);


	useEffect(() => {
		if (
			mode === 'month' &&
			!sameWeek(prevCurrent.current, current)
		) {
			const pageIndex = dataSource.findIndex(item => sameWeek(item, current));
			list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, false);
		}
		prevCurrent.current = current;
	}, [current])


	return (
		<InfiniteList
			key="week-list"
			isHorizontal
			ref={list}
			data={dataSource}
			renderItem={renderWeekItem}
			extendedState={extraWeekData}
			initialPageIndex={dataSource.length / 2}
			pageHeight={layout.itemWidth}
			pageWidth={layout.containerWidth}
			onPageChange={onPageChange}
			scrollViewProps={{
				showsHorizontalScrollIndicator: false
			}} />

	)
}

export default React.memo(WeekCalendar, areEqual)

const styles = StyleSheet.create({})


function getDatesArray(date: string | undefined, numberOfPages: number = NUMBER_OF_PAGES) {
	const d = date || new XDate().toString();
	const array = [];
	for (let index = -numberOfPages; index <= numberOfPages; index++) {
		const newDate = getWeekDate(d, 0, index);
		array.push(newDate);
	}
	return array;
}


function getWeekDate(date: string, firstDay: number, weekIndex: number) {
	// const d = new XDate(current || context.date);
	const d = new XDate(date);
	// get the first day of the week as date (for the on scroll mark)
	let dayOfTheWeek = d.getDay();
	if (dayOfTheWeek < firstDay && firstDay > 0) {
		dayOfTheWeek = 7 + dayOfTheWeek;
	}
	// leave the current date in the visible week as is
	const dd = d.addDays(firstDay - dayOfTheWeek);
	const newDate = dd.addWeeks(weekIndex);
	return toMarkingFormat(newDate);
}