import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import XDate from 'xdate';

const { width: windowWidth } = Dimensions.get('window');


const areEqual = (prevProps, nextProps) => {
    if(
        (
            nextProps.current === nextProps.date.toString('yyyy-MM-dd') ||
            prevProps.current === nextProps.date.toString('yyyy-MM-dd')
        ) &&
        nextProps.current !== prevProps.current
    ) {
        return false;
    }
    return true;
}

const Day = React.memo((props:any) => {
    const { onDayPress, current, date, style } = props;
    return (
        <TouchableOpacity activeOpacity={1} onPress={() => onDayPress(date.toString('yyyy-MM-dd'))}>
            <View style={[styles.itemContainer, style]} key={date.toString('yyyy-MM-dd')}>
                <View style={[{ width: '60%', height: '60%', justifyContent: 'center', alignItems: 'center' }, date.toString('yyyy-MM-dd') === current ? { backgroundColor: '#bbb', borderRadius: 100 } : null]}>
                    <Text style={[styles.itemText]}>{date.getDate()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}, areEqual)

export default Day

const styles = StyleSheet.create({
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
})