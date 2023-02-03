import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import XDate from 'xdate';
import InfiniteList from '../InfiniteList';
import Week from './Week';
import WeekDaysNames from './WeekDaysNames';
import CalendarContext from '../Context';
import styleConstructor from '../Utils/style';
import { extractCalendarProps } from '../Utils/componentUpdater';
import constants from '../Utils/constants';
import { UpdateSources } from '../Commons';
import { sameWeek, toMarkingFormat, page } from '../Utils';
import { MonthWeekCalendarProps } from './type'

const { width: windowWith } = Dimensions.get('window');

const NUMBER_OF_PAGES = 50;
const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = ({
    date,
    ...props
}) => {

    const { current, firstDay = 0, markedDates, allowShadow = true, hideDayNames, theme, calendarWidth, testID, initialDate } = props;

    const [items, setItems] = useState(getDatesArray(initialDate, NUMBER_OF_PAGES));

    const context = useContext(CalendarContext);
    const style = useRef(styleConstructor(theme));
    const list = useRef();
    const extraData = {
        current,
        date,
        firstDay
    };
    const containerWidth = calendarWidth || constants.screenWidth;

    const weekStyle = useMemo(() => {
        return [{ width: containerWidth }];
    }, [containerWidth]);


    useEffect(() => {
            const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
            // @ts-expect-error
            list.current?.scrollToOffset?.(pageIndex * containerWidth, 0, false);
    }, [date]);


    const onDayPress = useCallback((dateData) => {
        // context.setDate?.(dateData.dateString, UpdateSources.DAY_PRESS);
        props.onDayPress?.(dateData);
    }, [props.onDayPress]);


    const onPageChange = useCallback((a) => {
        console.log('items[]', items[a])
        // if (scrolledByUser) {
        //     context?.setDate(items[pageIndex], UpdateSources.WEEK_SCROLL);
        // }
    }, [items]);


    const reloadPages = useCallback(pageIndex => {
        const date = items[pageIndex];
        setItems(getDatesArray(date, firstDay, NUMBER_OF_PAGES));
    }, [items]);


    const renderItem = useCallback((_type, item) => {
        const pageData = page(new XDate(item)) ?? [];
        const col = Math.ceil(pageData.length/7)
        return (
            <View style={{width: windowWith, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'red'}}>
                {
                    pageData.map(value=>{
                        console.log('value', value.getDate())
                        return (
                            <View style={{width: windowWith/7, height: windowWith/7, justifyContent: 'center', alignItems: 'center'}}>
                                <Text>{value.getDate()}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    }, [date]);


    return (
        <View testID={testID} style={[style.current.containerWrapper]}>
            <View style={[styles.weekNamesContainer]}>
                <WeekDaysNames dayNames={constants.dayNamesShort} firstDay={firstDay} style={style.current.dayHeader} />
            </View>
            <View>
                <InfiniteList   
                    key="week-list"
                    isHorizontal
                    ref={list}
                    data={items}
                    renderItem={renderItem}
                    reloadPages={reloadPages}
                    onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)}
                    extendedState={extraData}
                    style={style.current.container}
                    initialPageIndex={NUMBER_OF_PAGES}
                    pageHeight={(windowWith/7)*6}
                    pageWidth={containerWidth}
                    onPageChange={onPageChange}
                    scrollViewProps={{
                        showsHorizontalScrollIndicator: false
                    }} />
            </View>
        </View>
    );
};


export default MonthWeekCalendar;

const styles = StyleSheet.create({
    weekNamesContainer: {
        width: '100%',
        flexDirection: 'row',
    }
})


function getDate(date, index) {
    const d = new XDate(date);
    d.addMonths(index, true);
    // if (index !== 0) {
    d.setDate(1);
    // }
    return toMarkingFormat(d);
}

function getDatesArray(date, numberOfPages = NUMBER_OF_PAGES) {
    const d = date || new XDate().toString();
    const array = [];
    for (let index = -numberOfPages; index <= numberOfPages; index++) {
        const newDate = getDate(d, index);
        array.push(newDate);
    }
    return array;
}