import { StyleSheet, Text, View, SectionList, SectionListProps, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React, { useImperativeHandle, useRef, useCallback, useEffect, useContext, useMemo, useLayoutEffect, useState } from 'react'
import { getYearMonthLocale, sameWeek, chunkRight } from '../Utils';
import { ReturnStyles } from '../Assets/style/types';
import { debounce } from 'lodash';
import CalendarContext from '../Context';
import { FlashList, FlashListProps, ViewToken } from "@shopify/flash-list";
import { UpdateSources } from '../Constants/type';

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
    const didScroll = useRef(false);
    const sectionScroll = useRef(false);
    const context = useContext(CalendarContext)
    const { date, setDate } = context;


    useEffect(() => {
        scrollToSection(date);
    }, [date])

    const _onViewableItemsChanged = (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
        if (info?.viewableItems && !sectionScroll.current) {
            const d = info?.viewableItems?.[0]?.item?.date;
            setDate(d, UpdateSources.LIST_DRAG)
        }
    }

    const _onMomentumScrollEnd = () => {
        sectionScroll.current = false;

    }

    const _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!didScroll.current) {
            didScroll.current = true;
            scrollToSection.cancel();
        }
    };

    const scrollToSection = useCallback(debounce((d: string) => {
        sectionScroll.current = true; 
        const index = getIndexForDates(d);
        listRef.current?.scrollToIndex?.({ index, animated: true })
    }, 1000, { leading: false, trailing: true}), [dataSource])

    const getIndexForDates = (date: string) => {
        const sameDayIndex = dataSource.findIndex(item => item.date === date);
        const sameWeekIndex = dataSource.findIndex(item => sameWeek(item.date, date));
        return sameDayIndex === -1 ? sameWeekIndex : sameDayIndex
    }

    const initIndex = useRef(getIndexForDates(initDate))


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


    const renderItem = useCallback(({ item }: { item: AgendaListDataSource }) => {
        switch (item.type) {
            case 'month':
                return <View style={[styles.agendaItemContainer,]}>{_renderSectionHeader(item)}</View>
            case 'week':
                return <View style={[styles.agendaItemContainer,]}>{_renderWeek(item)}</View>
            case 'day':
                return <View style={[styles.agendaItemContainer,]}>{_renderDay(item)}</View>
        }
    }, [dataSource])

    useEffect(() => {
    }, [])


    return (
        <View style={[styles.agendaContainer]}>
            <FlashList
                ref={listRef}
                data={dataSource}
                bounces={false}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.key}
                getItemType={(item) => {
                    return item.type;
                }}
                initialScrollIndex={initIndex.current}
                estimatedItemSize={60}
                estimatedFirstItemOffset={0}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={_onViewableItemsChanged}
                onMomentumScrollEnd={_onMomentumScrollEnd}
                onScroll={_onScroll}

            />
        </View>
    )
}

export default React.memo(AgendaList)
