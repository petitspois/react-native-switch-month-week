import { StyleSheet, Text, View, SectionList, SectionListProps } from 'react-native'
import React, { useImperativeHandle, useRef, useCallback, useEffect, useContext } from 'react'
import { getYearMonthLocale, sameWeek } from '../Utils';
import { ReturnStyles } from '../Assets/style/types';
import { debounce } from 'lodash';
import CalendarContext from '../Context';
import { FlashList, FlashListProps, ViewToken } from "@shopify/flash-list";

export interface AgendaListProps {
    dataSource: AgendaListDataSource[];
    styles: ReturnStyles;
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
    const { dataSource, styles } = props;
    const listRef = useRef<any>()
    const context = useContext(CalendarContext)
    const { date } = context;



    const _renderSectionHeader = (item: AgendaListDataSource) => {
        return (
            <View style={styles.agendaHeaderContainer}>
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

    const renderItem = ({ item }: { item: AgendaListDataSource }) => {
        return (
            <View style={[styles.agendaItemContainer]}>
                {item.type === 'month' && _renderSectionHeader(item)}
                {item.type === 'week' && _renderWeek(item)}
                {item.type === 'day' && _renderDay(item)}
            </View>
        )
    }

    return (
        <View style={[styles.agendaContainer]}>
            <FlashList
                ref={listRef}
                data={dataSource}
                bounces={false}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.key}
                estimatedItemSize={18}
                // initialScrollIndex={initialPageIndex}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default React.memo(AgendaList)
