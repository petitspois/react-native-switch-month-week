import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useMemo, useContext } from 'react'
import moment from 'moment';
import _ from 'lodash';


const areEqual = (prevProps, nextProps) => {
    if (
        (
            nextProps.current === nextProps.date.toString('yyyy-MM-dd') ||
            prevProps.current === nextProps.date.toString('yyyy-MM-dd') ||
            !_.isEqual(prevProps.markedDates, nextProps.markedDates) ||
            !_.isEqual(prevProps.styles, nextProps.styles)
        )
    ) {
        return false;
    }
    return true;
}

const Day = React.memo((props: any) => {

    const styles = useMemo(() => props.styles, [props.styles]);

    const { onDayPress, current, date, disabled, layout, isEdge, markedDates } = props;
    const _onDayPress = useCallback(() => {
        if (current !== date.toString('yyyy-MM-dd')) {
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
        const edge = isEdge ? isEdge(dateStr).isEndEdge || isEdge(dateStr).isStartEdge : false;
        return dateStr === current && (!disabled || edge) ?
                    today == dateStr ? styles.selectedTodayButton : styles.selectedButton : undefined;
    }, [current, disabled, styles])

    const dotSize = 4;
    const dotStyle = useMemo(() => {
        const dateStr = date.toString('yyyy-MM-dd');
        return !!markedDates?.[dateStr]?.marked ? styles.dot : undefined;
    }, [markedDates, styles])

    const textStyle = useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        const dateStr = date.toString('yyyy-MM-dd');
        return disabled ?
            styles.disabledButtonText :
            (today === dateStr && dateStr === current && !disabled) ? 
                styles.selectedTodayButtonText :
                today === dateStr ?
                    styles.todayButtonText :
                    styles.buttonText;
    }, [current, disabled, styles])

    return (
        <TouchableOpacity activeOpacity={1} onPress={_onDayPress}>
            <View style={[itemContainerStyle, styles.center]} >
                <View style={[itemInnerStyle, styles.center, selectedDayStyle]}>
                    <Text style={[styles.dayText, textStyle]}>{date.getDate()}</Text>
                    <View style={[dotStyle]}></View>
                </View>
            </View>
        </TouchableOpacity>
    )
}, areEqual)

export default Day
