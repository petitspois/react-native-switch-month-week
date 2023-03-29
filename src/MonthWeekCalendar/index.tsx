import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import XDate from 'xdate';
import CalendarContext from '../Context';
import WeekDaysNames from './WeekDaysNames';
import constants from '../Utils/constants';
import { getMonthRows, getRowAboveTheWeek, generateDates, sameMonth } from '../Utils';
import { MonthWeekCalendarProps, Mode } from './type'
import { CalendarContextProps } from '../Context/type';
import WeekCalendar from './WeekCalendar';
import MonthCalendar from './MonthCalendar';
import moment from 'moment';
import { theme as themes, DATE_FORMAT } from '../Constants';

const { width: windowWidth } = Dimensions.get('window');

const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = (props) => {

	const { calendarWidth, current } = props;
	const context = useContext(CalendarContext)
	const initDate = context.initDate;
	//var
	const defaultMode = 'week';
	const containerWidth = calendarWidth || windowWidth;
	const itemWidth = containerWidth / 7;
	const itemHeight = containerWidth / 8;
	//ref
	const rowsRef = useRef(6 ?? getMonthRows(initDate));
	const animatedContainerHeight = useRef(new Animated.Value(itemHeight));
	const pressedHeightRef = useRef(itemHeight);
	const monthPositionRef = useRef<number>((getRowAboveTheWeek(initDate)) * itemHeight)
	//state
	const [mode, setMode] = useState<Mode>(defaultMode);
	const [currentDate, setCurrentDate] = useState(initDate)
	const [monthDates, weekDates] = useMemo(() => generateDates(initDate), [initDate]);
	const weekDatesMinMax = useMemo(() => [weekDates[0], weekDates[weekDates.length-1]], [weekDates])
	const monthDatesMinMax = useMemo(() => [monthDates[0], monthDates[monthDates.length-1]], [monthDates])


	const isWeekEdge = (date: string) => {
    	return {isEndEdge: moment(date).isAfter(monthDatesMinMax[1], 'month'), isStartEdge: moment(date).isBefore(monthDatesMinMax[0], 'month')}
	}

	const isMonthEdge = (date: string) => {
    	return {isEndEdge: moment(date).isAfter(monthDatesMinMax[1], 'month'), isStartEdge: moment(date).isBefore(monthDatesMinMax[0], 'month')}
	}

	const setCurrentHandler = (date: string) => {
		setCurrentDate(date);
	}


	const onMonthDayPress = (value: any, rows: number) => {
		if (value !== currentDate) {
			updateMonthTranslateRef(rows);
			setCurrentDate(value)
		}
	}


	// week
	const onWeekPageChange = (prevDate: string, curDate: string, rows: number) => {
		updateMonthTranslateRef(rows);
	}



	const updateMonthTranslateRef = (rows: number) => {
		monthPositionRef.current = rows * itemHeight;
	}

	const updateMonthPosition = (rows: number) => {
		monthPositionRef.current = rows * itemHeight;
	}

	// render
	const renderKnob = () => {
		return (
			<View style={[styles.knobContainer]} {...panResponder.panHandlers}>
				<View style={[styles.knob]}></View>
			</View>
		)
	}


	const isAValidMovement = (distanceX, distanceY) => {
		const moveTravelledFarEnough =
			Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 2;
		return moveTravelledFarEnough;
	};

	const panResponder = useRef(
		PanResponder.create({
			// 要求成为响应者：
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				return isAValidMovement(gestureState.dx, gestureState.dy)
			},

			onPanResponderGrant: (evt, gestureState) => {
				// 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

				// gestureState.{x,y} 现在会被设置为0
				pressedHeightRef.current = animatedContainerHeight.current._value;
			},
			onPanResponderMove: (evt, gestureState) => {

				if (gestureState.dy + pressedHeightRef.current < itemHeight) {
					animatedContainerHeight.current.setValue(itemHeight)
					return;
				}

				if (gestureState.dy + pressedHeightRef.current > itemHeight * rowsRef.current) {
					animatedContainerHeight.current.setValue(itemHeight * rowsRef.current)
					return;
				}
				animatedContainerHeight.current.setValue(gestureState.dy + pressedHeightRef.current)
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				if (gestureState.dy + pressedHeightRef.current < (itemHeight * rowsRef.current) / 2) {
					Animated.timing(animatedContainerHeight.current, {
						toValue: itemHeight,
						duration: 100,
						useNativeDriver: false,
					}).start((finish) => {
						if (finish) {
							setMode('week')
						}
					})
					return;
				} else {
					Animated.timing(animatedContainerHeight.current, {
						toValue: itemHeight * rowsRef.current,
						duration: 100,
						useNativeDriver: false,
					}).start((finish) => {
						if (finish) {
							setMode('month')
						}
					})
					return;
				}
				// 用户放开了所有的触摸点，且此时视图已经成为了响应者。
				// 一般来说这意味着一个手势操作已经成功完成。
			},
			onPanResponderTerminate: (evt, gestureState) => {
				// 另一个组件已经成为了新的响应者，所以当前手势将被取消。
			},
			onShouldBlockNativeResponder: (evt, gestureState) => {
				// 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
				// 默认返回true。目前暂时只支持android。
				return true;
			},
		})
	).current;


	// 月定位
	const monthPositionY = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, itemHeight * rowsRef.current],
		outputRange: [-monthPositionRef.current, 0]
	})

	const weekPositionY = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, itemHeight * rowsRef.current],
		outputRange: [0, monthPositionRef.current]
	})

	return (

		<View style={[styles.containerWrapper]}>
			<View style={[styles.weekNamesContainer]}>
				<WeekDaysNames dayNames={constants.dayNamesShort} firstDay={0} />
			</View>
			<View>
				<Animated.View style={[{ overflow: 'hidden', height: animatedContainerHeight.current, backgroundColor: 'white' }]}>
					<Animated.View style={{ transform: [{ translateY: monthPositionY }], overflow: 'hidden' }}>
						<MonthCalendar
							initDate={initDate}
							updateMonthPosition={updateMonthPosition}
							onMonthDayPress={onMonthDayPress}
							mode={mode}
							layout={{ containerWidth, itemWidth, itemHeight }}
							dataSource={monthDates}
							themes={themes}
							isEdge={isMonthEdge}
						/>
					</Animated.View>
				</Animated.View>
				<Animated.View style={{ position: 'absolute', top: weekPositionY, left: 0, zIndex: mode === 'week' ? 99 : -99, width: containerWidth, height: itemWidth }}>
					<WeekCalendar
						initDate={initDate}
						updateMonthPosition={updateMonthPosition}
						mode={mode}
						layout={{ containerWidth, itemWidth, itemHeight }}
						dataSource={weekDates}
						themes={themes}
						isEdge={isWeekEdge}
					/>
				</Animated.View>
			</View>
			{renderKnob()}
		</View>
	);
};


export default MonthWeekCalendar;


const styles = StyleSheet.create({
	containerWrapper: {
		flex: 1,
	},
	weekNamesContainer: {
		width: '100%',
		height: 30,
		flexDirection: 'row',
	},

	itemContainer: {
		width: windowWidth / 7,
		height: windowWidth / 7,
		justifyContent: 'center',
		alignItems: 'center',
	},
	itemText: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	knobContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 24,
		backgroundColor: '#f1f1f1',
	},
	knob: {
		width: windowWidth / 14,
		height: 6,
		borderRadius: 3,
		backgroundColor: 'silver',
	}
})
