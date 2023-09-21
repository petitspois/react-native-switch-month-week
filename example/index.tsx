import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { MonthWeekCalendar, MonthWeekCalendarProvider } from '../src';
import moment from 'moment';


const Example = () => {
    const [, updateState] = useState<any>();
	const forceUpdate = useCallback(() => updateState({}), []);
    const [isLunar, setIsLunar] = useState(true);
    const [theme, setTheme] = useState<any>({
        todayTextColor: '#3CA0AE',
        selectedTodayButtonBackgroundColor: '#3CA0AE',
        dotBackgroundColor: '#3CA0AE',
        agendaItemTextColor: '#3CA0AE',
    })
    const [firstDay, setFirstDay] = useState(0)
    const [date, setDate] = useState('2023-04-13')
    const [currentMonth, setCurrentMonth] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'))
    const [markedDates, setMarkedDates] = useState({
        '2023-09-10': { marked: true, markedColor: '#000', data: [{ title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' }] },
        '2023-09-11': { marked: true, markedColor: '#000', data: [{ title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' }] },
        '2023-09-12': {
            marked: true, markedColor: '#000', data: [
                {
                    title: 'Yoov代码走读',
                    isAllDay: true,
                    startTime: '全天',
                },
                {
                    title: 'Yoov代码走读',
                    isAllDay: true,
                    startTime: '全天',
                },
                {
                    title: 'Yoov代码走读',
                    isAllDay: true,
                    startTime: '全天',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
                {
                    title: 'Yoov代码走读',
                    description: '下午5:00- 5:00 11F高速会议室',
                    isAllDay: false,
                    startTime: '17:00',
                    endTime: '18:00',
                },
            ]
        },
        '2023-09-13': { marked: true, markedColor: '#000', data: [{ title: 'Yoov代码走读', description: '下午5:00- 5:00 11F高速会议室' }] },
    })

    useEffect(() => {
        
        // setTimeout(() => {
        //     setTheme(
        //         { 
        //             containerBackgroundColor: '#040404',
        //             calendarBackgroundColor: '#191919',
        //             knobShadowColor: '#333333',
        //             selectedButtonBackgroundColor: '#333333',
        //             buttonTextColor: 'white',
        //             dayNameTextColor: 'white',
        //         }
        //     )
        // }, 4000);

    
        // setTimeout(()=>{
        //     setFirstDay(6)
        //     forceUpdate()
        // }, 6000)

        // setTimeout(() => {
        //     setIsLunar(false)
        // }, 6000);
       
    }, [])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white' }}>
                <Text style={{ padding: 12, fontSize: 18, fontWeight: 'bold', color: 'red' }}>{currentMonth.slice(0, -3)}</Text>
            </View>
            <MonthWeekCalendarProvider
                // defaultDate='2021-04-13'
                key={isLunar+''}
                onMonthChange={(date, type) => {
                    setCurrentMonth(date)
                }}>
                <MonthWeekCalendar
                    firstDay={firstDay}
                    isLunar={isLunar}
                    locale={'cn'}
                    theme={theme}
                    markedDates={markedDates}
                    onAgendaItemPress={(data) => {
                        console.log('data :>> ', data);
                    }}
                />
            </MonthWeekCalendarProvider>
        </SafeAreaView>
    )
}

export default Example

const styles = StyleSheet.create({})