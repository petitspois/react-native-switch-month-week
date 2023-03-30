import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import XDate from 'xdate';
import { getMonthDates, sameMonth } from '../../Utils';
import Day from '../Day';

const areEqual = (prevProps, nextProps) => {
    if (
        // sameMonth(nextProps.current, nextProps.date)
        prevProps.current !== nextProps.current
    ) {
        return false;
    }
    return true;
}

const Month = React.memo((props: any) => {
    const { date, containerWidth, ...otherProps } = props;
    const pageData = getMonthDates(date, 0, true) ?? []
    return (
        <View style={[styles.page, { width: containerWidth }]}>
            {
                pageData.map((value, index) => {
                    return (
                        <Day disabled={!sameMonth(date, value.toString('yyyy-MM-dd'))} key={value.toString('yyyy-MM-dd')} date={value} {...otherProps} />
                    )
                })
            }
        </View>
    )
}, areEqual)

export default Month

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})