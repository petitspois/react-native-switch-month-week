import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import XDate from 'xdate';
import InfiniteList from '../InfiniteList';
import WeekDaysNames from './WeekDaysNames';
import CalendarContext from '../Context';
import styleConstructor from '../Utils/style';
import constants from '../Utils/constants';
import { sameWeek, toMarkingFormat, page, getWeekDates, getMonthCols } from '../Utils';
import { MonthWeekCalendarProps } from './type'

const { width: windowWidth } = Dimensions.get('window');

const NUMBER_OF_PAGES = 50;
const MonthWeekCalendar: React.FC<MonthWeekCalendarProps> = ({
	date,
	...props
}) => {

	const gridBound = props?.itemWidth ?? windowWidth/7
	const colsRef = useRef(5)
	const mode = useRef('month');
	const [calendarMode, setCalendarMode] = useState('month');
	const animatedContainerHeight = useRef(new Animated.Value(gridBound * 5));
	const { current, firstDay = 0, markedDates, allowShadow = true, hideDayNames, theme, calendarWidth, testID, initialDate } = props;

	const [items, setItems] = useState(getDatesArray(initialDate, 'week', NUMBER_OF_PAGES));
	const style = useRef(styleConstructor(theme));
	const list = useRef();
	const extraData = {
		current,
		date,
		firstDay
	};
	const containerWidth = calendarWidth || constants.screenWidth;

	const weekStyle = useMemo(() => {
		return [{ width: containerWidth }];
	}, [containerWidth]);


	useEffect(() => {
		const pageIndex = items.findIndex(item => sameWeek(item, date, firstDay));
		// @ts-expect-error
		list.current?.scrollToOffset?.(pageIndex * containerWidth, 0, false);
	}, [date]);


	const onDayPress = useCallback((dateData) => {
		// context.setDate?.(dateData.dateString, UpdateSources.DAY_PRESS);
		props.onDayPress?.(dateData);
	}, [props.onDayPress]);


	const onPageChange = useCallback((pageIndex, _prevPage, { scrolledByUser }) => {
		if (scrolledByUser) {
			colsRef.current = getMonthCols(items[pageIndex]);

			Animated.timing(animatedContainerHeight.current, {
                toValue: getMonthCols(items[pageIndex])*gridBound, 
                duration: 400,
				useNativeDriver: false,
            }).start((finish)=>{

			})
		}
	}, [items]);


	const reloadPages = useCallback(pageIndex => {
		const date = items[pageIndex];
		setItems(getDatesArray(date, firstDay, NUMBER_OF_PAGES));
	}, [items]);


	const renderItem = useCallback((_type, item) => {
		const pageData = page(new XDate(item)) ?? []
		return (
			<View style={[styles.page]}>
				{
					pageData.map(value => {
						return (
							<View style={[styles.itemContainer]}>
								<Text style={[styles.itemText]}>{value.getDate()}</Text>
							</View>
						)
					})
				}
			</View>
		)
	}, [date]);



	// render
	const renderKnob = () => {
		return (
			<View style={[styles.knobContainer, { backgroundColor: 'gold'}]} {...panResponder.panHandlers}>
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
				console.log('按下')
				// 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

				// gestureState.{x,y} 现在会被设置为0
			},
			onPanResponderMove: (evt, gestureState) => {
				if (evt.nativeEvent.pageY <= gridBound) {
					animatedContainerHeight.current.setValue(gridBound)
					return;
				}
				if (evt.nativeEvent.pageY >= gridBound * colsRef.current) {
					animatedContainerHeight.current.setValue(gridBound * colsRef.current)
					return;
				}
				animatedContainerHeight.current.setValue(evt.nativeEvent.pageY)
				// 最近一次的移动距离为gestureState.move{X,Y}

				// 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
			},
			onPanResponderTerminationRequest: (evt, gestureState) => true,
			onPanResponderRelease: (evt, gestureState) => {
				if(evt.nativeEvent.pageY < (gridBound * colsRef.current)/2){
					Animated.timing(animatedContainerHeight.current, {
						toValue: gridBound, 
						duration: 100,
						useNativeDriver: false,
					}).start((finish)=>{
						if(finish){
							setCalendarMode('week')
						}
					})
					return;
				}else{
					Animated.timing(animatedContainerHeight.current, {
						toValue: gridBound * colsRef.current, 
						duration: 100,
						useNativeDriver: false,
					}).start((finish)=>{
						if(finish){
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

	animatedContainerHeight.current.addListener(()=>{
		console.log('2 :>> ', 2);
	})


	const translateInnerY = animatedContainerHeight.current.interpolate({
		inputRange: [gridBound, gridBound * colsRef.current],
		outputRange: [0, 0]
	})

	/**
	 *  监听月周切换
	 */
	useEffect(() => {

		if(calendarMode === 'week'){
			console.log('calendarMode :>> ', calendarMode);
			return;
		}

		if(calendarMode === 'month'){
			console.log('calendarMode :>> ', calendarMode);
			return;
		}
	  
	}, [calendarMode])

	console.log('items :>> ', items);

	return (
		<View testID={testID} style={[styles.containerWrapper]}>
			<View style={[styles.weekNamesContainer]}>
				<WeekDaysNames dayNames={constants.dayNamesShort} firstDay={firstDay} style={style.current.dayHeader} />
			</View>
			<Animated.View style={[{ overflow: 'hidden', height: animatedContainerHeight.current }]}>
				<Animated.View style={{ transform: [{ translateY: translateInnerY }], overflow: 'hidden' }}>
					<InfiniteList
						key="week-list"
						isHorizontal
						ref={list}
						data={items}
						renderItem={renderItem}
						reloadPages={reloadPages}
						onReachNearEdgeThreshold={Math.round(NUMBER_OF_PAGES * 0.4)}
						extendedState={extraData}
						style={style.current.container}
						initialPageIndex={NUMBER_OF_PAGES}
						pageHeight={(windowWidth / 7) * 6}
						pageWidth={containerWidth}
						onPageChange={onPageChange}
						scrollViewProps={{
							showsHorizontalScrollIndicator: false
						}} />
				</Animated.View>
			</Animated.View>
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
	page: {
		width: windowWidth,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	itemContainer: {
		width: windowWidth / 7,
		height: windowWidth / 7,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'red'
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


function getDate(date: string, index: number) {
	const d = new XDate(date);
	d.addMonths(index, true);
	// if (index !== 0) {
	d.setDate(1);
	// }
	return toMarkingFormat(d);
}

function getDatesArray(date: string, type: 'month'| 'week',  numberOfPages: number = NUMBER_OF_PAGES) {
	const d = date || new XDate().toString();
	const array = [];
	for (let index = -numberOfPages; index <= numberOfPages; index++) {
		const newDate = type === 'month' ? getDate(d, index) : getWeekDate(d, 1, index);
		array.push(newDate);
	}
	return array;
}



function getWeekDate(date: string, firstDay: number, weekIndex: number) {
    // const d = new XDate(current || context.date);
    const d = new XDate(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    return toMarkingFormat(newDate);
}
