import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import InfiniteList from '../../InfiniteList'
import { toMarkingFormat, sameMonth } from '../../Utils';
import { NUMBER_OF_PAGES, DATE_FORMAT } from '../../Constants';
import Month from '../Month';
import XDate from 'xdate';
import moment from 'moment';

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
    onMonthPageChange?: (prevDate: string, curDate: string) => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {

    const { initDate, mode, layout, current, onMonthDayPress, onMonthPageChange, setCurrent, dataSource } = props;

    const list = useRef<any>();
    const prevCurrent = useRef(current); 

    // state
    const extraData = {
        current,
    }
    const onPageChange = useCallback((pageIndex: number, _prevPage: number, { scrolledByUser }: any) => {
        if(scrolledByUser){
            setCurrent(dataSource[pageIndex]);
            onMonthPageChange && onMonthPageChange?.(dataSource[_prevPage], dataSource[pageIndex])
        }
    }, [dataSource, current]);


    const renderItem = useCallback((_type: any, item: string) => {
        return (
            <Month key={item} current={current} date={item} onDayPress={onMonthDayPress} containerWidth={layout.containerWidth} />
        )
    }, [current]);

    useEffect(()=>{
        if(
            mode === 'week' &&
            !sameMonth(prevCurrent.current, current)
        ){
            const pageIndex = dataSource.findIndex(item=> sameMonth(item, current));
            list.current?.scrollToOffset?.(pageIndex * layout.containerWidth, 0, false);
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
            onPageChange={onPageChange}
            scrollViewProps={{
                showsHorizontalScrollIndicator: false
            }} />
    )
}

export default MonthCalendar

const styles = StyleSheet.create({})

function getDatesArray(date: string | undefined, numberOfPages: number = NUMBER_OF_PAGES) {
	const d = date || new XDate().toString();
	const array = [];
    const weekArray: string[] = []
	for (let index = -numberOfPages; index <= numberOfPages; index++) {
		const newDate = getDate(d, index);
		array.push(newDate);
	}
    
    const week = moment(array[0]).day();
    const startWeek: any = moment(array[0]).subtract(week, 'day')
    const endWeek: any = moment(array[array.length - 1]).endOf('month')
    const weekLength = endWeek.diff(startWeek, 'week')+1;
    for(let index = 0; index < weekLength; index++){
        if(!index){
            weekArray.push(startWeek.format('YYYY-MM-DD'))
            continue;
        }
        weekArray.push(startWeek.add(1, 'week').format('YYYY-MM-DD'))
    }
	return array;
}

function getDate(date: string, index: number) {
	const d = new XDate(date);
	d.addMonths(index, true);
	d.setDate(1);
	return toMarkingFormat(d);
}