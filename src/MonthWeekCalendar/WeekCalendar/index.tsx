import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameWeek, getRowAboveTheWeek } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
import Week from '../Week';
import moment from 'moment';
import { ITheme } from '../../Constants/type';


interface WeekCalendarProps {
	initDate: string;
	mode: 'week' | 'month';
	current: string;
	layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
	dataSource: string[];
	setCurrent: (date: string) => void;
	onWeekDayPress: (value: any) => void;
	onWeekPageChange: (prevDate: string, curDate: string, rows: number) => void;
    monthChanged?:(date: string) => void;
	themes: ITheme;
}

const areEqual = (prevProps: WeekCalendarProps, nextProps: WeekCalendarProps) => {
	if (prevProps.current !== nextProps.current || prevProps.mode !== nextProps.mode) {
		return false;
	}
	return true;
}

const WeekCalendar: React.FC<WeekCalendarProps> = (props) => {

	const { initDate, mode, layout, current, onWeekDayPress, onWeekPageChange, setCurrent, dataSource, ...otherProps } = props;
    const initialIndex = useMemo(() => dataSource.findIndex(item => sameWeek(item, initDate)), [initDate])
	const list = useRef<any>();
	const prevCurrent = useRef(current);
    const monthTriggerType = useRef<string|undefined>();

	// state
	const extraWeekData = {
		current,
	}
	const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
        console.log('monthTriggerType.current :>> ', mode);
		if (mode === 'week') {
			// 上一页选中的是星期几
			const prevDay = moment(current).day();
			// 当前周第一天周日
			const weekFirstDay = dataSource[pageIndex];
			const weekCurrent = moment(weekFirstDay).add(prevDay, 'days').format(DATE_FORMAT);
            const rows  = getRowAboveTheWeek(weekCurrent)
			onWeekPageChange && onWeekPageChange?.(dataSource[_prevPage], dataSource[pageIndex], rows)
			setCurrent(weekCurrent);
		}
	}, [dataSource, current, mode]);

    console.log('mode :>> ', mode);

	const renderWeekItem = useCallback((_type: any, item: string) => {
		return (
			<Week layout={layout} key={item} mode={mode} current={current} date={item} onDayPress={onWeekDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [current]);

    const _onMomentumScrollEnd = useCallback((event: any) => {
        monthTriggerType.current =  undefined;
    }, [])


	useEffect(() => {
		if (
			mode === 'month' &&
			!sameWeek(prevCurrent.current, current)
		) {
            monthTriggerType.current = 'onMonthDayPress'
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
			initialPageIndex={initialIndex}
			pageHeight={layout.itemHeight}
			pageWidth={layout.containerWidth}
			onPageChange={onPageChange}
			scrollViewProps={{
				showsHorizontalScrollIndicator: false,
                onMomentumScrollEnd: _onMomentumScrollEnd,
			}} />

	)
}

export default React.memo(WeekCalendar, areEqual)

const styles = StyleSheet.create({})

