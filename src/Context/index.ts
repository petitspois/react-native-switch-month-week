import React from 'react';
import { CalendarContextProps } from './type'
import moment from 'moment';
import { DATE_FORMAT } from '../Constants';
import { UpdateSources } from '../Constants/type';
const CalendarContext: React.Context<CalendarContextProps> = React.createContext({
    initDate: moment().format(DATE_FORMAT),
    date: moment().format(DATE_FORMAT),
    prevDate: moment().format(DATE_FORMAT),
    setDate: (date: string, source: UpdateSources) => {},
    updateSource: UpdateSources.CALENDAR_INIT as UpdateSources
});
export default CalendarContext;


