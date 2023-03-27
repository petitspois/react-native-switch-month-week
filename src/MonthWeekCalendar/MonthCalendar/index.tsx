import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameMonth } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
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
	},
	dataSource: string[];
	setCurrent: (date: string) => void;
	onMonthDayPress: (value: any) => void;
	onMonthPageChange?: (prevDate: string, curDate: string, cb?: () =>void) => void;
    monthChanged?:(date: string) => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {

	const { initDate, mode, layout, current, onMonthDayPress, onMonthPageChange, setCurrent, dataSource } = props;

	const list = useRef<any>();
	const prevCurrent = useRef(current);
	const curCurrent = useRef(current);
    const monthAnimatedEnd = useRef<string|undefined>();
    const minMax = useMemo(() => [dataSource[0], dataSource[dataSource.length-1]], [dataSource])
	// state
	const extraData = {
		current,
	}
	const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
		if (scrolledByUser) {
			setCurrent(dataSource[pageIndex]);
			onMonthPageChange?.(dataSource[_prevPage], dataSource[pageIndex])
		}
	}, [dataSource]);


	const renderItem = useCallback((_type: any, item: string) => {
		return (
			<Month mode={mode} current={current} date={item} onDayPress={_onMonthDayPress} containerWidth={layout.containerWidth} />
		)
	}, [current]);

    const _onMonthDayPress = useCallback((date: string) => {
        if(
            moment(date).isAfter(minMax[1], 'month') || 
            moment(date).isBefore(minMax[0], 'month')
        ){
            console.log('12312 :>> ', 12312);
            return;
        }
        if(
            sameMonth(prevCurrent.current, date)
        ){
            onMonthDayPress(date)
        }else{
			const pageIndex = dataSource.findIndex(item => sameMonth(item, date));
            monthAnimatedEnd.current = 'onMonthDayPress';
            curCurrent.current = date;
            list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, true);
        }
    }, [current])

    const _onMomentumScrollEnd = useCallback((event: any) => {
        if(monthAnimatedEnd.current === 'onMonthDayPress'){
            onMonthPageChange && onMonthPageChange?.(prevCurrent.current, curCurrent.current)
            setTimeout(() => {
                onMonthDayPress(curCurrent.current)
            }, 416)
        }
        monthAnimatedEnd.current =  undefined;
    }, [])

	useEffect(() => {
        if(mode === 'month') {
            // console.log('prevCurrent.current, current :>> ', prevCurrent.current, current);
        }
		if (
			mode === 'week' &&
			!sameMonth(prevCurrent.current, current)
		) {
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
			pageHeight={(layout.containerWidth / 7) * 6}
			pageWidth={layout.containerWidth}
			onPageChange={debounce(onPageChange, 100)}
			scrollViewProps={{
				showsHorizontalScrollIndicator: false,
                onMomentumScrollEnd: _onMomentumScrollEnd,
			}} />
	)
}

export default MonthCalendar

const styles = StyleSheet.create({})
