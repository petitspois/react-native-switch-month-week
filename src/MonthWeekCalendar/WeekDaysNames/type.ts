import { StyleProp, TextStyle } from 'react-native';
import { ReturnStyles } from '../../Assets/style/types';
import type { Locale } from '../../Constants/type';

export interface WeekDaysNamesProps {
    firstDay?: number;
    dayNames?: string[];
    layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
    locale: Locale;
    styles?: ReturnStyles;
}