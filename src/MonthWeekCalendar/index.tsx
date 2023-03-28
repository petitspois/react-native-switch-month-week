import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import XDate from 'xdate';
import WeekDaysNames from './WeekDaysNames';
import constants from '../Utils/constants';
import { getMonthRows, getRowAboveTheWeek, generateDates, sameMonth } from '../Utils';
import { MonthWeekCalendarProps, Mode } from './type'
import WeekCalendar from './WeekCalendar';
import MonthCalendar from './MonthCalendar';
import moment from 'moment';
import { debounce } from 'lodash';
import { theme } from '../Constants';

const { width: windowWidth } = Dimensions.get('window');

const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = (props) => {

	const themes = { ...theme, ...props.theme };
	const { initialDate, boxWidth } = props;
	const initDate = !!initialDate ? initialDate : new XDate().toString('yyyy-MM-dd')
	//var
	const defaultMode = 'week';
	const containerWidth = boxWidth || windowWidth;
	const itemWidth = containerWidth / 7;
	const itemHeight = containerWidth / 8;
	//ref
	const rowsRef = useRef(6 ?? getMonthRows(initDate));
	const animatedContainerHeight = useRef(new Animated.Value(itemHeight));
	const pressedHeightRef = useRef(itemHeight);
	const monthTranslateRef = useRef<number>((getRowAboveTheWeek(initDate)) * itemHeight)
	//state
	const [mode, setMode] = useState<Mode>(defaultMode);
	const [currentDate, setCurrentDate] = useState(initDate)
	const [monthDates, weekDates] = useMemo(() => generateDates(initDate), [initDate]);


	const setCurrentHandler = (date: string) => {
		setCurrentDate(date);
	}

	const monthChanged = (date: string) => {
		props?.onMonthChange && props?.onMonthChange(moment(date).startOf('month').format('YYYY-MM-DD'));
	}

	const onWeekDayPress = (value: any) => {
		if (value !== currentDate) {
			setCurrentDate(value)
		}
	}

	const onMonthDayPress = (value: any, rows: number) => {
		if (value !== currentDate) {
			console.log('rows :>> ', rows);
			updateMonthTranslateRef(rows);
			setCurrentDate(value)
		}
	}

	const onMonthPageChange = (prevDate: string, curDate: string) => {
		/**
		 *  页面行数不一致需要更新
		*/
		monthTranslateRef.current = 0;

	}

	const onWeekPageChange = (prevDate: string, curDate: string, rows: number) => {
		updateMonthTranslateRef(rows);
	}

	const updateMonthTranslateRef = (rows: number) => {
		monthTranslateRef.current = rows * itemHeight;
	}

	// render
	const renderKnob = () => {
		return (
			<View style={[styles.knobContainer, { backgroundColor: 'gold' }]} {...panResponder.panHandlers}>
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
					monthTranslateRef.current = 0;
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
		outputRange: [-monthTranslateRef.current, 0]
	})

	const weekPositionY = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, itemHeight * rowsRef.current],
		outputRange: [0, monthTranslateRef.current]
	})



	console.log('mode :>> ', mode);

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
							onMonthDayPress={onMonthDayPress}
							mode={mode}
							current={currentDate}
							setCurrent={setCurrentHandler}
							layout={{ containerWidth, itemWidth, itemHeight }}
							onMonthPageChange={onMonthPageChange}
							dataSource={monthDates}
							monthChanged={monthChanged}
							themes={themes}
						/>
					</Animated.View>
				</Animated.View>
				<Animated.View style={{ position: 'absolute', top: weekPositionY, left: 0, zIndex: mode === 'week' ? 99 : -99, width: containerWidth, height: itemWidth }}>
					<WeekCalendar
						onWeekDayPress={onWeekDayPress}
						initDate={initDate}
						mode={mode}
						current={currentDate}
						setCurrent={setCurrentHandler}
						layout={{ containerWidth, itemWidth, itemHeight }}
						onWeekPageChange={onWeekPageChange}
						dataSource={weekDates}
						monthChanged={monthChanged}
						themes={themes}
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
		backgroundColor: 'white',
	},
	weekNamesContainer: {
		width: '100%',
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
		backgroundColor: 'white',
	},
	knob: {
		width: windowWidth / 14,
		height: 6,
		borderRadius: 3,
		backgroundColor: 'silver',
	}
})
