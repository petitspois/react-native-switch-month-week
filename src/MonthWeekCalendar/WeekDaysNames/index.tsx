import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { weekDayNames } from '../../Utils';
import { WeekDaysNamesProps } from './type'
import constants from '../../Utils/constants';

const { width: windowWith } = Dimensions.get('window')


const WeekDaysNames = React.memo<WeekDaysNamesProps>(({
	firstDay = 0,
	dayNames = constants.dayNamesShort,
	style = undefined,
	layout = {}
}): React.ReactElement[] | any => {
	return dayNames.map((day, index) => {
		return (
			<View style={[styles.dayNamesItemContainer, { width: layout.itemWidth }]} key={day}>
				<Text allowFontScaling={false} style={styles.dayNamesItem} numberOfLines={1} accessibilityLabel={''}>{day}</Text>
			</View>
		)
	})
})

export default WeekDaysNames;

const styles = StyleSheet.create({
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


