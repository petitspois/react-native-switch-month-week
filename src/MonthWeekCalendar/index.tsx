import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, ViewProps, ScrollView } from 'react-native';
import CalendarContext from '../Context';
import WeekDaysNames from './WeekDaysNames';
import constants from '../Utils/constants';
import { getMonthRows, getRowAboveTheWeek, generateDates, sameMonth } from '../Utils';
import { MonthWeekCalendarProps, Mode } from './type'
import WeekCalendar from './WeekCalendar';
import MonthCalendar from './MonthCalendar';
import moment from 'moment';
import { styleConstructor } from '../Assets/style';

const { width: windowWidth } = Dimensions.get('window');

const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = (props) => {

	const { calendarWidth, markedDates, theme } = props;
	const context = useContext(CalendarContext)
	const initDate = context.initDate;
	const styles = useMemo(()=> styleConstructor(theme), [theme]);
	//var
	const containerWidth = calendarWidth || windowWidth;
	const itemWidth = containerWidth / 7;
	const itemHeight = containerWidth / 8;
	const monthHeight = itemHeight * 6;
	const monthHalfHeight = monthHeight/2;
	//ref
	const animatedContainerHeight = useRef(new Animated.Value(itemHeight));
	const pressedHeightRef = useRef(itemHeight);
	const monthPositionRef = useRef<number>((getRowAboveTheWeek(initDate)) * itemHeight)
	const modeRef = useRef<Mode>('week');
	const reservationRef = useRef<View>(null);
	//state
	const [monthDates, weekDates] = useMemo(() => generateDates(initDate), [initDate]);
	const monthDatesMinMax = useMemo(() => [monthDates[0], monthDates[monthDates.length - 1]], [monthDates])


	const isEdge = (date: string) => {
		return { isEndEdge: moment(date).isAfter(monthDatesMinMax[1], 'month'), isStartEdge: moment(date).isBefore(monthDatesMinMax[0], 'month') }
	}

	const updateMonthPosition = (rows: number) => {
		monthPositionRef.current = rows * itemHeight;
	}

	/**
	 *  TODO: know area
	 */
	const knobRotateLeft = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, monthHeight],
		outputRange: ['0deg', '-30deg']
	})

	const knobRotateRight = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, monthHeight],
		outputRange: ['0deg', '30deg']
	})

	const knobClick = () => {
		modeRef.current === 'week' ? openCalendar() : closeCalendar();
	}

	// render
	const renderKnob = () => {
		return (
			<View style={[styles.knobContainer, styles.containerWrapperShadow]}>
				<TouchableOpacity onPress={knobClick} activeOpacity={1}>
					<View style={styles.knobItem} >
						<Animated.View style={[styles.knob, { transform: [{ rotate: knobRotateLeft }] }]} />
						<Animated.View style={[styles.knob, { left: 17, transform: [{ rotate: knobRotateRight }] }]} />
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	const openCalendar = (cb?: (mode: 'week' | 'month') => void) => {
		Animated.timing(animatedContainerHeight.current, {
			toValue: monthHeight,
			duration: 100,
			useNativeDriver: false,
		}).start((finish) => {
			if (finish) {
				modeRef.current = 'month'
				reservationRef.current?.setNativeProps({ pointerEvents: 'box-only'})
				cb && cb('month')
			}
		})
	}

	const closeCalendar = (cb?: (mode: 'week' | 'month') => void) => {
		Animated.timing(animatedContainerHeight.current, {
			toValue: itemHeight,
			duration: 100,
			useNativeDriver: false,
		}).start((finish) => {
			if (finish) {
				modeRef.current = 'week'
				reservationRef.current?.setNativeProps({ pointerEvents: 'box-none'})
				cb && cb('week')
			}
		})
	}

	const openOrCloseCalendar = (dy: number) => {
		if(ltHalf(dy)){
			closeCalendar()
		}else{
			openCalendar()
		}
	}

	const ltHalf = (dy: number) => {
		return dy + pressedHeightRef.current < monthHalfHeight;
	}

	const _panResponderMove = (dy: number) => {
		if (dy + pressedHeightRef.current < itemHeight) {
			animatedContainerHeight.current.setValue(itemHeight)
			return;
		}
		if (dy + pressedHeightRef.current > monthHeight) {
			animatedContainerHeight.current.setValue(monthHeight)
			return;
		}
		animatedContainerHeight.current.setValue(dy + pressedHeightRef.current)
	}

	/**
	 *  TODO: month week area
	 */
	const isAValidMovement = (distanceX: number, distanceY: number) => {
		return Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 36;
	};
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				return isAValidMovement(gestureState.dx, gestureState.dy)
			},
			onPanResponderGrant: (evt, gestureState) => {
				pressedHeightRef.current = animatedContainerHeight.current._value;
			},
			onPanResponderMove: (evt, gestureState) => {
				_panResponderMove(gestureState.dy)
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				openOrCloseCalendar(gestureState.dy);
			},
			onPanResponderTerminate: (evt, gestureState) => {
				openOrCloseCalendar(gestureState.dy);
			}
		})
	).current;

	/**
	 *  TODO: reservation area
	 */
	const isReservationAValidMovement = (distanceX: number, distanceY: number) => {
		return Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 36 && modeRef.current === 'month';
	};
	const reservationPanResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				return isReservationAValidMovement(gestureState.dx, gestureState.dy)
			},
			onPanResponderGrant: (evt, gestureState) => {
				pressedHeightRef.current = animatedContainerHeight.current._value;
			},
			onPanResponderMove: (evt, gestureState) => {
				_panResponderMove(gestureState.dy)
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				openOrCloseCalendar(gestureState.dy)
			},
			onPanResponderTerminate: (evt, gestureState) => {
				openOrCloseCalendar(gestureState.dy)
			}
		})
	).current;



	// 月定位
	const monthPositionY = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, monthHeight],
		outputRange: [-monthPositionRef.current, 0]
	})

	const weekPositionY = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, monthHeight],
		outputRange: [0, monthPositionRef.current]
	})

	const weekZIndex = animatedContainerHeight.current.interpolate({
		inputRange: [itemHeight, monthHeight],
		outputRange: [99, -99]
	})

	return (
		<View style={[styles.containerWrapper]}>
			<View style={[styles.weekNamesContainer]}>
				<WeekDaysNames layout={{ containerWidth, itemWidth, itemHeight }} dayNames={constants.dayNamesShort} firstDay={0} />
			</View>
			<View {...panResponder.panHandlers}>
				<View>
					<Animated.View style={[{ overflow: 'hidden', height: animatedContainerHeight.current }]}>
						<Animated.View style={{ transform: [{ translateY: monthPositionY }], overflow: 'hidden' }}>
							<MonthCalendar
								initDate={initDate}
								updateMonthPosition={updateMonthPosition}
								layout={{ containerWidth, itemWidth, itemHeight }}
								dataSource={monthDates}
								isEdge={isEdge}
								markedDates={markedDates}
								styles={styles}
							/>
						</Animated.View>
					</Animated.View>
					
					<Animated.View
						style={{
							position: 'absolute',
							top: weekPositionY,
							left: 0,
							zIndex: weekZIndex,
							width: containerWidth,
							height: itemWidth
						}}
					>
						<WeekCalendar
							initDate={initDate}
							updateMonthPosition={updateMonthPosition}
							layout={{ containerWidth, itemWidth, itemHeight }}
							dataSource={weekDates}
							markedDates={markedDates}
							isEdge={isEdge}
							styles={styles}
						/>
					</Animated.View>
				</View>
				{renderKnob()}
			</View>
			<View ref={reservationRef} style={[styles.reservationContainer]} {...reservationPanResponder.panHandlers} >
				<ScrollView>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
					<Text>1232131</Text>
				</ScrollView>
			</View>
		</View>
	);
};


export default MonthWeekCalendar;



