import XDate from 'xdate';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { sameMonth } from '../Utils';
import { useDidUpdate } from '../Hooks';
import { DATE_FORMAT } from '../Constants'
import { UpdateSources } from '../Constants/type';
import CalendarContext from './index';
import { CalendarContextProviderProps } from './type';
import moment from 'moment';

const CalendarProvider = (props: CalendarContextProviderProps) => {
    const { defaultDate = moment().format(DATE_FORMAT), onDateChanged, onMonthChange, children } = props;
    const prevDate = useRef(defaultDate);
    const currDate = useRef(defaultDate); // for setDate only to keep prevDate up to date
    const [currentDate, setCurrentDate] = useState(defaultDate);
    const [updateSource, setUpdateSource] = useState<UpdateSources>(UpdateSources.CALENDAR_INIT);
  
    useDidUpdate(() => {
        if (defaultDate) {
            _setDate(defaultDate, UpdateSources.PROP_UPDATE);
        }
    }, [defaultDate]);

    const _setDate = useCallback((date: string, updateSource: UpdateSources) => {
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
            defaultDate,
            date: currentDate,
            prevDate: prevDate.current,
            updateSource: updateSource,
            setUpdateSource,
            setDate: _setDate,
        };
    }, [currentDate, updateSource]);

    return (<CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>);
};
export default CalendarProvider;
CalendarProvider.displayName = 'CalendarProvider';
