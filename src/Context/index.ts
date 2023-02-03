import React from 'react';
import { CalendarContextProps } from './type'
const CalendarContext: React.Context<CalendarContextProps | {}> = React.createContext({});
export default CalendarContext;
