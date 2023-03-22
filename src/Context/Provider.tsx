import XDate from 'xdate';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import CalendarContext from './index';
import { View } from 'react-native';

const CalendarProvider = (props: any) => {
    const { theme, date, children } = props;
    const prevDate = useRef(date);
    const currDate = useRef(date); // for setDate only to keep prevDate up to date
    const [currentDate, setCurrentDate] = useState(date);

    const _setDate = (date: string) => {
        prevDate.current = currDate.current;
        currDate.current = date;
        setCurrentDate(date);
    };

    const contextValue = useMemo(() => {
        return {
            date: currentDate,
            prevDate: prevDate.current,
            setDate: _setDate,
        };
    }, [currentDate]);

    return (
        <CalendarContext.Provider value={contextValue}>
            {children}
        </CalendarContext.Provider>
    );
};
export default CalendarProvider;
CalendarProvider.displayName = 'CalendarProvider';
