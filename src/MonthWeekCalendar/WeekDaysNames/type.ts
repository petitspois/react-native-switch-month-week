import { StyleProp, TextStyle } from 'react-native';
import { ReturnStyles } from '../../Assets/style/types';

export interface WeekDaysNamesProps {
    firstDay?: number;
    dayNames?: string[];
    layout: {
		containerWidth: number;
		itemWidth: number;
		itemHeight: number;
	},
    locale: 'en' | 'cn' | 'hk';
    styles?: ReturnStyles;
}