import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useCallback, useMemo, useContext } from 'react'
import moment from 'moment';
import _ from 'lodash';
import chineseLunar from "../../Utils/chinese-lunar";



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

    const { onDayPress, current, date, disabled, layout, isEdge, markedDates, isLunar, mode } = props;
    const _onDayPress = useCallback(() => {
        if (current !== date.toString('yyyy-MM-dd')) {
            onDayPress(date.toString('yyyy-MM-dd'))
        }
    }, [onDayPress, date])

    const itemContainerStyle = {
        width: layout.itemWidth,
        height: layout.itemHeight
    }

    const itemInnerEdge = isLunar ? layout.itemHeight * 0.46 : layout.itemHeight * 0.7
    const itemInnerStyle = {
        overflow: 'hidden',
        width: itemInnerEdge,
        height: itemInnerEdge,
        borderRadius: 100,
    }
    const selectedDayStyle = useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        const dateStr = date.toString('yyyy-MM-dd');
        const edge = isEdge ? isEdge(dateStr).isEndEdge || isEdge(dateStr).isStartEdge : false;
        if (dateStr === current && (!disabled || edge)) {
            if (today == dateStr) {
                return styles.selectedTodayButton
            } else {
                return styles.selectedButton
            }
        }
        return undefined
    }, [current, disabled, styles])

    const dotStyle = useMemo(() => {
        const dateStr = date.toString('yyyy-MM-dd');
        return !!markedDates?.[dateStr]?.marked ? styles.dot : undefined;
    }, [markedDates, styles])

    const dotLunarStyle = useMemo(() => {
        const dateStr = date.toString('yyyy-MM-dd');
        return !!markedDates?.[dateStr]?.marked ? styles.dotLunar : undefined;
    }, [markedDates, styles])

    const textStyle = useMemo(() => {
        const today = moment().format('YYYY-MM-DD');
        const dateStr = date.toString('yyyy-MM-dd');

        if (disabled) {
            return styles.disabledButtonText;
        } else if (today === dateStr && dateStr === current) {
            return styles.selectedTodayButtonText;
        } else if (today === dateStr) {
            return styles.todayButtonText;
        } else {
            return styles.buttonText;
        }

    }, [current, disabled, styles])

    const getLunar = useCallback((date: any) => {
        let dateClone = date?.clone();
        if(mode === 'month'){
            dateClone.addHours(-8);
        }
        var lunar = chineseLunar.solarToLunar(dateClone.toDate());
        return chineseLunar.format(lunar, 'D');
    }, [date, mode])

    return (
        <TouchableOpacity activeOpacity={1} onPress={_onDayPress} >
            <View style={[itemContainerStyle, styles.center]} >
                <View style={[styles.center, selectedDayStyle, itemInnerStyle]}>
                    <Text style={[styles.dayText, textStyle]}>{date.getDate()}</Text>
                    {!isLunar && <View style={[dotStyle]}></View>}
                </View>
                {
                    isLunar &&
                    <View style={[styles.dayLunarWrap, styles.center]}>
                        <Text style={[styles.dayLunar, textStyle]}>
                            {getLunar(date)}
                        </Text>
                        <View style={[dotLunarStyle]}></View>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}, areEqual)

export default Day
