import XDate from 'xdate';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { sameMonth } from '../Utils';
import { useDidUpdate } from '../Hooks';
import { DATE_FORMAT } from '../Constants'
import { UpdateSources } from '../Constants/type';
import styleConstructor from '../Assets/style';
import CalendarContext from './index';
import { CalendarContextProviderProps } from './type';
import moment from 'moment';

const CalendarProvider = (props: CalendarContextProviderProps) => {
    const { theme, date = moment().format(DATE_FORMAT), onDateChanged, onMonthChange, style: propsStyle, children } = props;
    const style = useRef(styleConstructor(theme));
    const todayButton = useRef();
    const prevDate = useRef(date);
    const currDate = useRef(date); // for setDate only to keep prevDate up to date
    const [currentDate, setCurrentDate] = useState(date);
    const [updateSource, setUpdateSource] = useState<UpdateSources>(UpdateSources.CALENDAR_INIT);
    const wrapperStyle =  useMemo(()=> [{flex:1}], [style, propsStyle])
    // const wrapperStyle = useMemo(() => {
    //     return [style.current.contextWrapper, propsStyle];
    // }, [style, propsStyle]);
    useDidUpdate(() => {
        if (date) {
            _setDate(date, UpdateSources.PROP_UPDATE);
        }
    }, [date]);
    const _setDate = useCallback((date: string, updateSource: UpdateSources) => {
        console.log('currDate.current :>> ', currDate.current);
        prevDate.current = currDate.current;
        currDate.current = date;
        setCurrentDate(date);
        setUpdateSource(updateSource);
        onDateChanged?.(date, updateSource);
        if (!sameMonth(date, prevDate.current)) {
            onMonthChange?.(date, updateSource);
        }
    }, [onDateChanged, onMonthChange]);

    const contextValue = useMemo(() => {
        return {
            initDate: date,
            date: currentDate,
            prevDate: prevDate.current,
            updateSource: updateSource,
            setDate: _setDate,
        };
    }, [currentDate, updateSource]);

    return (<CalendarContext.Provider value={contextValue}>
      <View style={wrapperStyle}>{children}</View>
    </CalendarContext.Provider>);
};
export default CalendarProvider;
CalendarProvider.displayName = 'CalendarProvider';
