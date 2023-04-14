import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { weekDayNames } from '../../Utils';
import { WeekDaysNamesProps } from './type'
import constants from '../../Utils/constants';
import { DayNamesShort } from '../../Constants';

const { width: windowWith } = Dimensions.get('window')


const WeekDaysNames = React.memo<WeekDaysNamesProps>(({
	firstDay = 0,
	styles = undefined,
	layout = {},
	locale = 'en'
}): React.ReactElement[] | any => {

	const dayNames = useMemo(() => DayNamesShort[locale], [locale])

	return dayNames.map((day, index) => {
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


