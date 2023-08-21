import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, ViewProps, ScrollView } from 'react-native';
import CalendarContext from '../Context';
import WeekDaysNames from './WeekDaysNames';
import constants from '../Utils/constants';
import { getRowAboveTheWeek, generateDates } from '../Utils';
import { MonthWeekCalendarProps, Mode } from './type'
import { DATE_FORMAT } from '../Constants';
import WeekCalendar from './WeekCalendar';
import MonthCalendar from './MonthCalendar';
import moment from 'moment';
import { styleConstructor } from '../Assets/style';
import AgendaList from '../AgendaList';

const { width: windowWidth } = Dimensions.get('window');

const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = (props) => {

	const { calendarWidth, markedDates, theme, locale, customReservation, noEventsText, containerWrapperStyle, firstDay = 0, modeType = 'Both', isReservation = true, isKnob = true, defaultOpenMode = 'Week' } = props;
	
	const context = useContext(CalendarContext)
	const { defaultDate } = context;
	const initDate = defaultDate ?? moment().format(DATE_FORMAT);
	const styles = useMemo(() => styleConstructor(theme), [theme]);
	const CalendarContainerViewWrap = View;
	//var
	const containerWidth = calendarWidth || windowWidth;
	const itemWidth = Math.floor(containerWidth / 7);
	const itemHeight = containerWidth / 8;
	const monthHeight = itemHeight * 6;
	const monthHalfHeight = monthHeight / 2;
	//ref
	const animatedContainerHeight = useRef(new Animated.Value(modeType === 'Month' ? monthHeight : itemHeight));
	const pressedHeightRef = useRef(itemHeight);
	const monthPositionRef = useRef<number>((getRowAboveTheWeek(initDate, firstDay)) * itemHeight)
	const modeRef = useRef<Mode>('week');
	const reservationRef = useRef<View>(null);
	const disablePan = useRef<boolean>(false);
	//state
	const [monthDates, weekDates] = useMemo(() => generateDates(initDate, firstDay), [initDate, firstDay]);
	const monthDatesMinMax = useMemo(() => [monthDates[0], monthDates[monthDates.length - 1]], [monthDates])
	const [mode, setMode] = useState<'week' | 'month'>('week')

	const disablePanTimeRef = useRef<any>(null);
	const handlerDisablePan = (disabled: boolean) => {
		if (disablePan.current !== disabled) {
			disablePanTimeRef.current && clearTimeout(disablePanTimeRef.current);
			if (disabled) {
				disablePan.current = disabled;
			} else {
				disablePanTimeRef.current = setTimeout(() => {
					disablePan.current = disabled;
				}, 300);
			}
		}
	}

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
			<View style={[styles.knobContainer]}>
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
				setMode('month')
				reservationRef.current?.setNativeProps({ pointerEvents: 'auto' })
				cb?.('month')
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
				setMode('week')
				reservationRef.current?.setNativeProps({ pointerEvents: 'box-none' })
				cb?.('week')
			}
		})
	}

	const openOrCloseCalendar = (dy: number) => {
		if (ltHalf(dy)) {
			closeCalendar()
		} else {
			openCalendar()
		}
	}

	const ltHalf = (dy: number) => {
		return dy + pressedHeightRef.current < monthHalfHeight;
	}

	const renderReservation = () => {
		if (customReservation) return customReservation(mode)
		return <AgendaList placeholderText={noEventsText} onAgendaItemPress={props.onAgendaItemPress} mode={mode} initDate={initDate} markedDates={markedDates} styles={styles} />
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
		return Math.abs(distanceY) > 6 && !disablePan.current;
	};
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				if (modeType === 'Month' || modeType === 'Week') return false;
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

	// first day update postion
	useEffect(() => {
		updateMonthPosition(getRowAboveTheWeek(initDate, firstDay));
	}, [firstDay])


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

	useEffect(() => {
		if (defaultOpenMode === 'Month') {
			setTimeout(() => {
				openCalendar();
			}, 1000);
		}
	}, [])


	return (
		<View style={[styles.containerWrapper]}>
			<View style={[styles.weekNamesContainer]}>
				<WeekDaysNames
					firstDay={firstDay}
					locale={locale}
					styles={styles}
					layout={{ containerWidth, itemWidth, itemHeight }}
				/>
			</View>
			<CalendarContainerViewWrap>
				<View {...panResponder.panHandlers} style={[styles.calendar, styles.containerWrapperShadow, containerWrapperStyle]}>
					<View>
						{
							<Animated.View style={[{ overflow: 'hidden', height: modeType === 'Week' ? 0 : animatedContainerHeight.current }]}>
								<Animated.View style={{ transform: [{ translateY: monthPositionY }], overflow: 'hidden' }}>
									<MonthCalendar
										initDate={initDate}
										firstDay={firstDay}
										updateMonthPosition={updateMonthPosition}
										disablePanChange={handlerDisablePan}
										layout={{ containerWidth, itemWidth, itemHeight }}
										dataSource={monthDates}
										isEdge={isEdge}
										markedDates={markedDates}
										styles={styles}
									/>
								</Animated.View>
							</Animated.View>
						}
						{
							(modeType === 'Both' || modeType === 'Week') &&
							<Animated.View
								style={{
									position: modeType === 'Week' ? 'relative' : 'absolute',
									top: modeType === 'Week' ? 0 : weekPositionY,
									left: 0,
									zIndex: weekZIndex,
									width: containerWidth,
									height: itemWidth,
								}}
							>
								<WeekCalendar
									initDate={initDate}
									firstDay={firstDay}
									updateMonthPosition={updateMonthPosition}
									disablePanChange={handlerDisablePan}
									layout={{ containerWidth, itemWidth, itemHeight }}
									dataSource={weekDates}
									markedDates={markedDates}
									isEdge={isEdge}
									styles={styles}
								/>
							</Animated.View>}
					</View>
					{isKnob && renderKnob()}
				</View>
			</CalendarContainerViewWrap>
			{
				isReservation &&
				<View ref={reservationRef} style={[styles.reservationContainer]} {...reservationPanResponder.panHandlers} >
					{renderReservation()}
				</View>
			}
		</View>
	);
};


export default MonthWeekCalendar;



