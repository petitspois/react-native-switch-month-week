import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getWeekDates } from '../../Utils';
import Day from '../Day';
import isEqual from 'lodash/isEqual';

const areEqual = (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
}

const Week = React.memo((props: any) => {
    const { date, containerWidth, firstDay, ...otherProps } = props;  

    const pageData = getWeekDates(date, firstDay, null) ?? []
    
    return (
        <View style={[otherProps.styles.weekContainer, { width: containerWidth}]}>
            {
                pageData.map((value, index) => {
                    return (
                        <Day key={index} date={value} {...otherProps} />
                    )
                })
            }
        </View>
    )
}, areEqual)

export default Week

const styles = StyleSheet.create({
    page: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
})