import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameMonth, getRowAboveTheWeek } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
import { ITheme } from '../../Constants/type';
import Month from '../Month';
import XDate from 'xdate';
import moment from 'moment';
import { debounce } from 'lodash';

var num = 0;
interface MonthCalendarProps {
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
	onMonthDayPress: (value: any, cols: number) => void;
	onMonthPageChange?: (prevDate: string, curDate: string, cb?: () =>void) => void;
    monthChanged?:(date: string) => void;
	themes: ITheme
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {

	const { initDate, mode, layout, current, onMonthDayPress, onMonthPageChange, setCurrent, dataSource, ...otherProps } = props;

	const list = useRef<any>();
	const prevCurrent = useRef(current);
	const curCurrent = useRef(current);
    const monthTriggerType = useRef<string|undefined>();
    const minMax = useMemo(() => [dataSource[0], dataSource[dataSource.length-1]], [dataSource])
	// state
	const extraData = {
		current,
	}
	const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
		console.log('monthTriggerType.current :>> ', monthTriggerType.current);
		// if (scrolledByUser) {
			if(!monthTriggerType.current){
				console.log('1232132321 :>> ', 1232132321);
				onMonthPageChange?.(dataSource[_prevPage], dataSource[pageIndex])
				setCurrent(dataSource[pageIndex]);
			}
		// }
	}, [dataSource]);


	const renderItem = useCallback((_type: any, item: string) => {
		return (
			<Month layout={layout} mode={mode} current={current} date={item} onDayPress={_onMonthDayPress} containerWidth={layout.containerWidth} {...otherProps} />
		)
	}, [current]);

    const _onMonthDayPress = useCallback((date: string) => {
        if(
            moment(date).isAfter(minMax[1], 'month') || 
            moment(date).isBefore(minMax[0], 'month')
        ){
            return;
        }
        if(
            sameMonth(prevCurrent.current, date)
        ){
            onMonthDayPress(date, getRowAboveTheWeek(date))
        }else{
			const pageIndex = dataSource.findIndex(item => sameMonth(item, date));
            monthTriggerType.current = 'onMonthDayPress';
            curCurrent.current = date;
            list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, true);
        }
    }, [current])

    const _onMomentumScrollEnd = useCallback((event: any) => {
        if(monthTriggerType.current === 'onMonthDayPress'){
            onMonthPageChange && onMonthPageChange?.(prevCurrent.current, curCurrent.current)
            setTimeout(() => {
                onMonthDayPress(curCurrent.current, getRowAboveTheWeek(curCurrent.current))
            }, 16)
        }
        monthTriggerType.current =  undefined;
    }, [])

	useEffect(() => {
        if(mode === 'month') {
            // console.log('prevCurrent.current, current :>> ', prevCurrent.current, current);
        }
		if (
			mode === 'week' &&
			!sameMonth(prevCurrent.current, current)
		) {
			monthTriggerType.current = 'onWeekDayPress';
			const pageIndex = dataSource.findIndex(item => sameMonth(item, current));
			list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, false);
		}
        if(!sameMonth(prevCurrent.current, current)){
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
