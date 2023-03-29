import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import XDate from 'xdate';
import { page, sameWeek, getWeekDates } from '../../Utils';
import Day from '../Day';

const areEqual = (prevProps, nextProps) => {
    if(
        sameWeek(nextProps.current, nextProps.date)
    ){
        return false;
    }
    return true;
}

const Week = React.memo((props: any) => {
    const { date, containerWidth, ...otherProps } = props;  

    const pageData = getWeekDates(date, 0, null) ?? []
    
    return (
        <View style={[styles.page, { width: containerWidth}]}>
            {
                pageData.map((value, index) => {
                    return (
                        <Day key={value.toString('yyyy-MM-dd')} style={{backgroundColor: '#f1f1f1'}} date={value} {...otherProps} />
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