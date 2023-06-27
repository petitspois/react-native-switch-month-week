import { StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, LayoutChangeEvent } from 'react-native'
import React, { useImperativeHandle, useRef, useCallback, useEffect, useContext, useMemo, useLayoutEffect, useState } from 'react'
import { getYearMonthLocale, sameWeek, getRowAboveTheWeek, getRowInPage } from '../Utils';
import { ReturnStyles } from '../Assets/style/types';
import { debounce } from 'lodash';
import CalendarContext from '../Context';
import { useDidUpdate } from '../Hooks';
import type { MarkedDates, MarkedData } from '../MonthWeekCalendar/type';

export interface AgendaListProps {
    styles: ReturnStyles;
    initDate: string;
    markedDates: MarkedDates | undefined;
    mode: 'week' | 'month'
    onAgendaItemPress?: (data: AgendaListDataSource) => void;
    placeholderText?: string;
}

export interface AgendaListDataSource {
    data?: {
        title: string;
        description: string;
    },
    date: string;
    day?: number;
    key: string;
    marked?: boolean;
    markedColor?: string;
    type: 'month' | 'week' | 'day';
    week?: string;
    value: string;
}


const AgendaList: React.FC<AgendaListProps> = (props) => {
    const { styles, initDate, markedDates, mode, placeholderText } = props;
    const context = useContext(CalendarContext)
    const [dataSource, setDataSource] = useState<any[]>([])
    const { date } = context;


    useDidUpdate(() => {
        getList(date)
    }, [date])


    const _onDayPress = useCallback((item: any) => {
        if (props.onAgendaItemPress) {
            props.onAgendaItemPress(item);
        }
    }, [])

    const _renderDay = useCallback((item: MarkedData, idx: number) => {
        return (
            <TouchableWithoutFeedback key={idx} onPress={() => _onDayPress(item)}>
                <View style={[styles.agendaItem, { marginVertical: 12, height: item.isAllDay ? 20 : 40 }]}>
                    <View style={styles.agendaItemInner}>
                        <View style={styles.agendaItemBar}></View>
                        <View style={styles.agendaItemDetail}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.agendaItemDetailTitle}>{item?.title}</Text>
                                <Text style={styles.agendaItemDetailExtra}>{item?.startTime}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.agendaItemDetailDescription}>{item?.description}</Text>
                                <Text style={styles.agendaItemDetailExtra}>{item?.endTime}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }, [])


    const renderItems = () => {
        return dataSource.map((item: MarkedData, idx: number) => {
            return (
                <View key={'item'+ idx}>
                    {_renderDay(item, idx)}
                    <View key={'line' + idx} style={{marginLeft: 12, width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: '#ddd'}}></View>
                </View>
            ) 
        })
    }

    const _ListEmptyComponent = () => {
        return (
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Image source={require('../Assets/images/placeholder.png')} style={{ marginBottom: 16, width: 80, height: 80 }} />
                <Text>{placeholderText ?? 'No events'}</Text>
            </View>
        )
    }


    const getList = (date: string) => {
        if (markedDates?.[date]?.data?.length) {
            setDataSource(markedDates?.[date]?.data ?? [])
        }else{
            setDataSource([])
        }
    }

    useEffect(() => {
        getList(initDate);
    }, [])

    return (
        <View style={[styles.agendaContainer]}>
            {
                dataSource.length ? 
                <ScrollView 
                    scrollEnabled={mode === 'week'}
                    showsVerticalScrollIndicator={false}
                    style={{flex:1, paddingHorizontal: 12}}
                >
                    {renderItems()}
                </ScrollView> :
                _ListEmptyComponent()
            }
        </View>
    )


}

export default React.memo(AgendaList, (prevProps, nextProps) => {
    return prevProps.mode === nextProps.mode;
})
