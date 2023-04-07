import { StyleProp, TextStyle } from 'react-native';

export interface WeekDaysNamesProps {
    firstDay?: number;
    dayNames?: string[];
    layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
    style?: StyleProp<TextStyle>;
}