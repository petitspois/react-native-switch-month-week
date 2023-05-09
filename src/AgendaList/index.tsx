import { StyleSheet, Text, View, SectionList, SectionListProps } from 'react-native'
import React, { useImperativeHandle, useRef, useCallback, useEffect, useContext, useMemo, useLayoutEffect, useState } from 'react'
import { getYearMonthLocale, sameWeek, sameMonth } from '../Utils';
import { ReturnStyles } from '../Assets/style/types';
import { debounce } from 'lodash';
import CalendarContext from '../Context';
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { chunk } from 'lodash';

export interface AgendaListProps {
    dataSource: AgendaListDataSource[];
    styles: ReturnStyles;
    initDate: string;
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
    const { dataSource, styles, initDate } = props;
    const listRef = useRef<any>()
    const context = useContext(CalendarContext)
    const { date } = context;
    const initIndex = dataSource.findIndex(item => item.type === 'month' && sameMonth(item.date, initDate));
    const chunkDataSource = chunk(dataSource, 20);
    const [data, setData] = useState<AgendaListDataSource[]>([])
    const queryDate = (date: string, size=20): Promise<any> => {
        return new Promise((resolve) => {
            const index = dataSource.findIndex(item => sameWeek(item.date, date));
            setTimeout(() => {
                if(size>=0){
                    resolve(
                        dataSource.slice(index+1, index + size) as AgendaListDataSource[]
                    )
                }else{
                    resolve(
                       dataSource.slice(index + size, index) as AgendaListDataSource[]
                    )
                }
            }, 2000);
        })
    }


    console.log('chunkDataSource :>> ', chunkDataSource);
    const init = async () => {
        const newData = await queryDate(date)
        setData(newData)
    }

    const _onStartReached = async () => {
        // const newData = await queryDate(data[0].date, -20)
        // setData(newData)
    }

    const _onEndReached = async () => {
        const newData = await queryDate(data[data.length-1].date, 20)
        console.log('newData :>> ', newData);
        // setData(d=> {
        //     return d.concat(newData)
        // })
    }

    const _renderSectionHeader = (item: AgendaListDataSource) => {
        return (
            <View style={[styles.agendaHeaderContainer]}>
                <Text style={styles.agendaHeaderText}>{item.value}</Text>
            </View>
        )
    }

    const _renderWeek = (item: AgendaListDataSource) => {
        return (
            <Text style={styles.agendaItemTitle}>{item.value}</Text>
        )
    }

    const _renderDay = (item: AgendaListDataSource) => {
        return (
            <View style={styles.agendaItem}>
                <View style={styles.agendaItemInner}>
                    <View style={styles.agendaItemSubtitle}>
                        <Text style={styles.agendaItemSubtitleWeek}>{item.week}</Text>
                        <Text style={styles.agendaItemSubtitleDay}>{item.day}</Text>
                    </View>
                    <View style={styles.agendaItemDetail}>
                        <Text style={styles.agendaItemDetailTitle}>{item?.data?.title}</Text>
                        <Text style={styles.agendaItemDetailDescription}>{item?.data?.description}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const _onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
        console.log('onScrollToIndexFailed info: ', info);
    };

    const renderItem = useCallback(({ item }: { item: AgendaListDataSource }) => {
        switch (item.type) {
            case 'month':
                return <View style={[styles.agendaItemContainer, { height: 56.3 }]}>{_renderSectionHeader(item)}</View>
            case 'week':
                return <View style={[styles.agendaItemContainer, { height: 43 }]}>{_renderWeek(item)}</View>
            case 'day':
                return <View style={[styles.agendaItemContainer, { height: 74 }]}>{_renderDay(item)}</View>
        }
    }, [dataSource])

    useEffect(() => {
        init();
    }, [])

    return (
        <View style={[styles.agendaContainer]}>
            {data.length ? <FlatList
                ref={listRef}
                data={data}
                bounces={false}
                renderItem={renderItem}
                getItemLayout={(data, index) => {
                    const type = (data && data[index]?.type) || 'month';
                    const itemHeight = type === 'month' ? 56.3 : type === 'week' ? 43 : 74;
                    return { length: itemHeight, offset: itemHeight * index, index };
                }}
                keyExtractor={(item, index) => item.key}
                showsVerticalScrollIndicator={false}
                onStartReached={_onStartReached}
                onEndReached={_onEndReached}
                showDefaultLoadingIndicators
            /> : null}
            {/* <FlashList
                ref={listRef}
                data={dataSource}
                bounces={false}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.key}
                getItemType={(item) => {
                    return item.type;
                }}
                initialScrollIndex={initialIndex}
                estimatedItemSize={57.8}
                estimatedFirstItemOffset={0}
                showsVerticalScrollIndicator={false}
            /> */}
        </View>
    )
}

export default React.memo(AgendaList)
