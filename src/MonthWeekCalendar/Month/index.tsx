import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import XDate from 'xdate';
import { getMonthDates, sameMonth } from '../../Utils';
import Day from '../Day';
import _ from 'lodash';

const areEqual = (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
}

const Month = React.memo((props: any) => {
    const { date, containerWidth, ...otherProps } = props;
    const pageData = getMonthDates(date, 0, true) ?? []
    
    return (
        <View style={[otherProps.styles.monthContainer, { width: containerWidth }]}>
            {
                pageData.map((value, index) => {
                    return (
                        <Day key={value} disabled={!sameMonth(date, value.toString('yyyy-MM-dd'))} date={value} {...otherProps} />
                    )
                })
            }
        </View>
    )
}, areEqual)

export default Month
