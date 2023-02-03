import { StyleProp, TextStyle } from 'react-native';

export interface WeekDaysNamesProps {
    firstDay?: number;
    dayNames?: string[];
    style?: StyleProp<TextStyle>;
}