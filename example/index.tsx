import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MonthWeekCalendar } from '../src';
import MonthWeekCalendarProvider from '../src/Context/Provider';

const Example = () => {
    return (
        <MonthWeekCalendar date="2023-02-03" />
    )
}

export default Example

const styles = StyleSheet.create({})