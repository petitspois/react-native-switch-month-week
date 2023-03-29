import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { sameMonth } from '../../Utils';
import moment from 'moment';

const { width: windowWidth } = Dimensions.get('window');


const areEqual = (prevProps, nextProps) => {
    if (
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

const Day = React.memo((props: any) => {
    const { onDayPress, current, date, style, disabled, layout, themes } = props;

    const _onDayPress = useCallback(() => {
        if(current !== date.toString('yyyy-MM-dd')){
            onDayPress(date.toString('yyyy-MM-dd'))
        }
    }, [onDayPress, date])

    const itemContainerStyle = {
        width: layout.itemWidth,
        height: layout.itemHeight
    }

    const itemInnerEdge = layout.itemHeight * 0.7
    const itemInnerStyle = {
        width: itemInnerEdge,
        height: itemInnerEdge,
        borderRadius: 100,
    }
    const selectedDayStyle = useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        const dateStr = date.toString('yyyy-MM-dd');
        return dateStr === current && !disabled ? { backgroundColor: today === dateStr ? themes.todayTextColor : themes?.selectedDayBackgroundColor } : null;
    }, [current, disabled])

    const dotSize = 4;
    const dotStyle = useMemo(() => {
        return { left: itemInnerStyle.width / 2 - dotSize / 2, width: dotSize, height: dotSize, borderRadius: 100, backgroundColor: themes.dotColor }
    }, [themes])

    const textStyle = useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        const dateStr = date.toString('yyyy-MM-dd');
        return disabled ?
            { color: themes.textDisabledColor } :
            (today === dateStr && dateStr === current && !disabled) ? { color: 'white' } :
                today === dateStr ?
                    { color: themes.todayTextColor } :
                    null;
    }, [current, disabled])

return (
    <TouchableOpacity key={date.toString('yyyy-MM-dd')} activeOpacity={1} onPress={_onDayPress}>
        <View style={[itemContainerStyle, styles.center, style]} >
            <View style={[itemInnerStyle, styles.center, selectedDayStyle]}>
                <Text style={[styles.itemText, textStyle]}>{date.getDate()}</Text>
                <View style={[styles.dot, dotStyle]}></View>
            </View>
        </View>
    </TouchableOpacity>
)
}, areEqual)

export default Day

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111',
    },
    notThisMonthText: {
        color: '#888'
    },
    dot: {
        position: 'absolute',
        bottom: 2,
    }
})