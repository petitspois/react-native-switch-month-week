import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import XDate from 'xdate';
import InfiniteList from '../InfiniteList';
import WeekDaysNames from './WeekDaysNames';
import CalendarContext from '../Context';
import styleConstructor from '../Utils/style';
import constants from '../Utils/constants';
import { sameWeek, sameMonth, toMarkingFormat, page, getWeekDates, getMonthCols, getWeekColForMonth } from '../Utils';
import { MonthWeekCalendarProps, Mode } from './type'

import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import WeekCalendar from './WeekCalendar';
import Month from './Month';

const { width: windowWidth } = Dimensions.get('window');

const NUMBER_OF_PAGES = 50;
const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = (props) => {

	const { initialDate, boxWidth } = props;
	const initDate = !!initialDate ? initialDate : new XDate().toString('yyyy-MM-dd')
	//var
	const defaultMode = 'week';
	const containerWidth = boxWidth || windowWidth;
	const itemWidth = containerWidth / 7;
	//ref
	const list = useRef();
	const colsRef = useRef(getMonthCols(initDate));
	const weekNum = getWeekColForMonth(initDate)
	const animatedContainerHeight = useRef(new Animated.Value(itemWidth));
	const pressedHeightRef = useRef(itemWidth);
	//state
	const [calendarMode, setCalendarMode] = useState<Mode>(defaultMode);
	const [items, setItems] = useState(getDatesArray(initDate));
	const [currentDate, setCurrentDate] = useState(initDate)
	const weekPositionYStartRef = useRef<number>((weekNum - 1) * itemWidth);
	const extraData = {
        currentDate
    };

	const setCurrentHandler = (date: string) => {
		setCurrentDate(date);
	}


	// useEffect(() => {
	// 	const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
	// 	// @ts-expect-error
	// 	list.current?.scrollToOffset?.(pageIndex * containerWidth, 0, false);
	// }, [date]);

	const pageIndexHandler = (type: 'week' | 'month', date: string) => {
		// return (type === 'week' ? weekItems : items).findIndex(item => sameWeek(item, date))
	}

	const onDayPress = useCallback((dateData) => {
		// context.setDate?.(dateData.dateString, UpdateSources.DAY_PRESS);
		props.onDayPress?.(dateData);
	}, [props.onDayPress]);

	const _onCurrentDateChange = (date: string) => {
		
	}

	const onPageChange = (pageIndex, _prevPage, { scrolledByUser }) => {
		if (scrolledByUser && calendarMode === 'month') {
			// 动态更新month高度
			colsRef.current = getMonthCols(items[pageIndex]);
			Animated.timing(animatedContainerHeight.current, {
				toValue: getMonthCols(items[pageIndex]) * itemWidth,
				duration: 400,
				useNativeDriver: false,
			}).start((finish) => {

			})
		}
	};

	const onWeekDayPress = (value: any) => {
		console.log('value :>> ', value);
		if(value !== currentDate){
			setCurrentDate(value)
		}
	}

	const _onDayPress = (value: XDate) => {
		setCurrentDate(value.toString('yyyy-MM-dd'))
		const colNum = getWeekColForMonth(value.toString('yyyy-MM-dd'));
		weekPositionYStartRef.current = colNum * itemWidth - itemWidth;
		// weekList?.current?.scrollToOffset?.(pageIndexHandler('week', value.toString('yyyy-MM-dd')) * containerWidth, 0, false)
	}


	const reloadPages = useCallback(pageIndex => {
		const date = items[pageIndex];
		setItems(getDatesArray(date));
	}, [items]);


	const renderItem = useCallback((_type, item) => {
		return (
			<Month current={currentDate} date={item} onDayPress={_onDayPress} containerWidth={containerWidth} />
		)
	}, [currentDate]);




	// render
	const renderKnob = () => {
		return (
			<View style={[styles.knobContainer, { backgroundColor: 'gold' }]} {...panResponder.panHandlers}>
				<View style={[styles.knob]}></View>
			</View>
		)
	}


	useEffect(() => {

	}, [])

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
				// if (evt.nativeEvent.pageY <= itemWidth) {
				// 	animatedContainerHeight.current.setValue(itemWidth)
				// 	return;
				// }
				// if (evt.nativeEvent.pageY >= itemWidth * colsRef.current) {
				// 	animatedContainerHeight.current.setValue(itemWidth * colsRef.current)
				// 	return;
				// }
				// console.log('evt.nativeEvent.pageY animatedContainerHeight:>> ',gestureState);

				if (gestureState.dy + pressedHeightRef.current < itemWidth) {
					animatedContainerHeight.current.setValue(itemWidth)
					return;
				}

				if (gestureState.dy + pressedHeightRef.current > itemWidth * colsRef.current) {
					animatedContainerHeight.current.setValue(itemWidth * colsRef.current)
					return;
				}
				animatedContainerHeight.current.setValue(gestureState.dy + pressedHeightRef.current)
				// 最近一次的移动距离为gestureState.move{X,Y}

				// 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				if (gestureState.dy + pressedHeightRef.current < (itemWidth * colsRef.current) / 2) {
					Animated.timing(animatedContainerHeight.current, {
						toValue: itemWidth,
						duration: 100,
						useNativeDriver: false,
					}).start((finish) => {
						if (finish) {
							setCalendarMode('week')
						}
					})
					return;
				} else {
					Animated.timing(animatedContainerHeight.current, {
						toValue: itemWidth * colsRef.current,
						duration: 100,
						useNativeDriver: false,
					}).start((finish) => {
						if (finish) {
							setCalendarMode('month')
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



	const translateInnerY = animatedContainerHeight.current.interpolate({
		inputRange: [itemWidth, itemWidth * colsRef.current],
		outputRange: [-weekPositionYStartRef.current, 0]
	})

	const weekPositionY = animatedContainerHeight.current.interpolate({
		inputRange: [itemWidth, itemWidth * colsRef.current],
		outputRange: [0, weekPositionYStartRef.current]
	})

	/**
	 *  监听月周切换
	 */
	useEffect(() => {

		if (calendarMode === 'week') {
			return;
		}

		if (calendarMode === 'month') {
			return;
		}

	}, [calendarMode])


	
	return (

		<View style={[styles.containerWrapper]}>
			<View style={[styles.weekNamesContainer]}>
				<WeekDaysNames dayNames={constants.dayNamesShort} firstDay={0} />
			</View>
			<View>
				<Animated.View style={[{ overflow: 'hidden', height: animatedContainerHeight.current, backgroundColor: 'white' }]}>
					<Animated.View style={{ transform: [{ translateY: translateInnerY }], overflow: 'hidden' }}>
						<InfiniteList
							key="list"
							isHorizontal
							ref={list}
							data={items}
							renderItem={renderItem}
							reloadPages={reloadPages}
							onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)}
							extendedState={extraData}
							// style={style.current.container}
							initialPageIndex={NUMBER_OF_PAGES}
							pageHeight={(containerWidth / 7) * 6}
							pageWidth={containerWidth}
							onPageChange={onPageChange}
							scrollViewProps={{
								showsHorizontalScrollIndicator: false
							}} />
					</Animated.View>
				</Animated.View>
				<Animated.View style={{ position: 'absolute', top: weekPositionY, left: 0, zIndex: calendarMode === 'week' ? 99 : -99, width: containerWidth, height: itemWidth }}>
					<WeekCalendar 
						onWeekDayPress={onWeekDayPress} 
						initDate={initDate} 
						mode={calendarMode} 
						current={currentDate} 
						setCurrent={setCurrentHandler}
						layout={{containerWidth, itemWidth}} 
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




function getDatesArray(date: string | undefined, numberOfPages: number = NUMBER_OF_PAGES) {
	const d = date || new XDate().toString();
	const array = [];
	for (let index = -numberOfPages; index <= numberOfPages; index++) {
		const newDate = getDate(d, index);
		array.push(newDate);
	}
	return array;
}

function getDate(date: string, index: number) {
	const d = new XDate(date);
	d.addMonths(index, true);
	d.setDate(1);
	return toMarkingFormat(d);
}

