import { ViewStyle, ViewProps, StyleProp } from 'react-native';
import { ITheme, UpdateSources } from '../Constants/type';

export interface CalendarContextProviderProps extends ViewProps {
    /** Initial date in 'yyyy-MM-dd' format. Default = now */
    defaultDate?: string;
    /** Specify theme properties to override specific styles for calendar parts */
    theme?: Partial<ITheme>;
    /** Specify style for calendar container element */
    style?: StyleProp<ViewStyle>;
    /** Callback for date change event */
    onDateChanged?: (date: string, updateSource: UpdateSources) => void;
    /** Callback for month change event */
    onMonthChange?: (date: string, updateSource: UpdateSources) => void;
}

export interface CalendarContextProps {
    defaultDate: string;
    date: string;
    prevDate: string;
    updateSource: UpdateSources;
    setDate: (date: string, source: UpdateSources) => void;
}