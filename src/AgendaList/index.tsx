import { StyleSheet, Text, View, SectionList, SectionListProps, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React, { useImperativeHandle, useRef, useCallback, useEffect, useContext, useMemo, useLayoutEffect, useState } from 'react'
import { getYearMonthLocale, sameWeek, getRowAboveTheWeek, getRowInPage } from '../Utils';
import { ReturnStyles } from '../Assets/style/types';
import { debounce } from 'lodash';
import CalendarContext from '../Context';
import { FlashList, FlashListProps, ViewToken } from "@shopify/flash-list";
import { UpdateSources } from '../Constants/type';
import { useDidUpdate } from '../Hooks';

export interface AgendaListProps {
    dataSource: AgendaListDataSource[];
    styles: ReturnStyles;
    initDate: string;
	updateMonthPosition: (rows: number) => void;
	isEdge: (date: string) => { isStartEdge: boolean, isEndEdge: boolean }
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

// const viewabilityConfig = {
//     itemVisiblePercentThreshold: 6 // 50 means if 50% of the item is visible
// };

const AgendaList: React.FC<AgendaListProps> = (props) => {
    const { dataSource, styles, initDate, updateMonthPosition, isEdge } = props;
    const listRef = useRef<any>()
    const didScroll = useRef(false);
    const sectionScroll = useRef(false);
    const avoidDateUpdates = useRef(true);
    const context = useContext(CalendarContext)
    const { date, setDate, updateSource, setUpdateSource } = context;


    useDidUpdate(() => {
        if (updateSource !== UpdateSources.LIST_DRAG) {
            console.log('date :>> ', date);
            scrollToSection(date);
        }
    }, [date])

    const updateMonthPositionHandler = (date: string) => {
		if (isEdge(date).isEndEdge) {
			updateMonthPosition(getRowInPage(date));
		} else if (isEdge(date).isStartEdge) {
			updateMonthPosition(0);
		} else {
			updateMonthPosition(getRowAboveTheWeek(date))
		}
	}

    const _onViewableItemsChanged = (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
        if (info?.viewableItems && !sectionScroll.current && !avoidDateUpdates.current) {
            const d = info?.viewableItems?.[0]?.item?.date;
            if(typeof d === 'string'){
                updateMonthPositionHandler(d);
                setDate(d, UpdateSources.LIST_DRAG)
            }
        }
    }

    const _onMomentumScrollEnd = () => {
        sectionScroll.current = false;
    }

    const _onScrollBeginDrag = () => {
        if(avoidDateUpdates.current){
            avoidDateUpdates.current = false;
        }
    }

    const scrollToSection = useCallback(debounce((d: string) => {
        sectionScroll.current = true;
        const index = getIndexForDates(d);
        listRef.current?.scrollToIndex?.({ index, animated: true })
    }, 500, { leading: false, trailing: true }), [dataSource])

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
                // viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={_onViewableItemsChanged}
                onMomentumScrollEnd={_onMomentumScrollEnd}
                onScrollBeginDrag={_onScrollBeginDrag}
                // onScroll={_onScroll}

            />
        </View>
    )
}

export default React.memo(AgendaList)
