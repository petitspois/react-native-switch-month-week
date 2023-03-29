import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect, useMemo, useContext } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameMonth, getRowAboveTheWeek } from '../../Utils';
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
	const prevCurrent = useRef(current);
	const curCurrent = useRef(current);
	const monthTriggerType = useRef<string | undefined>();
	// state
	const extraData = {
		date: context.date,
	}

	const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
		updateMonthPosition(0)
		context?.setDate(dataSource[pageIndex], UpdateSources.MONTH_SCROLL)
	}, [dataSource]);


	const renderItem = useCallback((_type: any, item: string) => {
		return (
			<Month layout={layout} mode={mode} current={date} date={item} onDayPress={onDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [date]);

	const onDayPress = useCallback((newDate: string) => {
		if (
			sameMonth(newDate, date)
		) {
			updateMonthPosition(getRowAboveTheWeek(newDate))
			context?.setDate(newDate, UpdateSources.DAY_PRESS);
		} else {
			const pageIndex = dataSource.findIndex(item => sameMonth(item, newDate));
			list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, true);
		}
	}, [date])

	const _onMomentumScrollEnd = useCallback((event: any) => {
		if (monthTriggerType.current === 'onMonthDayPress') {
			onMonthPageChange && onMonthPageChange?.(prevCurrent.current, curCurrent.current)
			setTimeout(() => {
				onMonthDayPress(curCurrent.current, getRowAboveTheWeek(curCurrent.current))
			}, 16)
		}
		monthTriggerType.current = undefined;
	}, [])

	useEffect(() => {
		if (mode === 'month') {
			// console.log('prevCurrent.current, current :>> ', prevCurrent.current, current);
		}
		if (
			mode === 'week' &&
			!sameMonth(prevCurrent.current, current) &&
			!(isEdge(current).isStartEdge || isEdge(current).isStartEdge)
		) {
			monthTriggerType.current = 'onWeekDayPress';
			const pageIndex = dataSource.findIndex(item => sameMonth(item, current));
			list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, false);
		}
		if (!sameMonth(prevCurrent.current, current)) {
			props?.monthChanged && props?.monthChanged(current)
		}
		prevCurrent.current = current;
	}, [current])

	return (
		<InfiniteList
			key="list"
			isHorizontal
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
				onMomentumScrollEnd: _onMomentumScrollEnd,
			}} />
	)
}

export default MonthCalendar

const styles = StyleSheet.create({})
