import React from 'react';
import { UpdateSources } from '../Commons';

export interface CalendarContextProps {
    date: string;
    prevDate: string;
    setDate: (date: string, source: UpdateSources) => void;
    updateSource: UpdateSources;
    setDisabled: (disable: boolean) => void;
    numberOfDays?: number;
    timelineLeftInset?: number;
}
