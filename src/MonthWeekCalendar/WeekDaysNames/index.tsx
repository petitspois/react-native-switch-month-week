import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { weekDayNames } from '../../Utils';
import { WeekDaysNamesProps } from './type'

const { width: windowWith } = Dimensions.get('window')

// const areEqual = (prevProps: WeekDaysNamesProps, nextProps: WeekDaysNamesProps) => {
// 	return prevProps.firstDay ===;
// }

const WeekDaysNames = React.memo<WeekDaysNamesProps>(({
	firstDay = 0,
	styles = undefined,
	layout = {},
	locale = 'en',
}): React.ReactElement[] | any => {

	const dayNames = useMemo(() => weekDayNames(firstDay, locale), [locale, firstDay])
	return dayNames.map((day) => {
		return (
			<View style={[style.dayNamesItemContainer, { width: layout.itemWidth }]} key={day}>
				<Text allowFontScaling={false} style={[style.dayNamesItem, styles?.weekNamesText]} numberOfLines={1} accessibilityLabel={''}>{day}</Text>
			</View>
		)
	})
})

export default WeekDaysNames;

const style = StyleSheet.create({
	dayNamesItemContainer: {
		width: windowWith / 7,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dayNamesItem: {
		fontSize: 13,
		color: '#333',
	}
})


