import inRange from 'lodash/inRange';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';

import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollViewProps, View, Animated, FlatListProps } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps } from 'recyclerlistview';
import { FlashList, FlashListProps, ViewToken } from "@shopify/flash-list";
import constants from '../Utils/constants';
import { useCombinedRefs } from '../Hooks';


export interface InfiniteListProps
    extends Omit<RecyclerListViewProps, 'dataProvider' | 'layoutProvider' | 'rowRenderer'> {
    data: any[];
    renderItem: FlashListProps<string>["renderItem"];
    pageWidth?: number;
    pageHeight?: number;
    onPageChange?: (page: ViewToken, prevPage: ViewToken, info: { scrolledByUser: boolean }) => void;
    onReachEdge?: (pageIndex: number) => void;
    onReachNearEdge?: (pageIndex: number) => void;
    onReachNearEdgeThreshold?: number;
    initialPageIndex?: number;
    scrollViewProps?: ScrollViewProps;
    reloadPages?: (pageIndex: number) => void;
    positionIndex?: number;
    mode?: 'week' | 'month';
}

const InfiniteList = (props: InfiniteListProps, ref: any) => {
    const {
        isHorizontal,
        renderItem,
        data,
        reloadPages = noop,
        pageWidth = constants.screenWidth,
        pageHeight = constants.screenHeight,
        onPageChange,
        onReachEdge,
        onReachNearEdge,
        onReachNearEdgeThreshold,
        initialPageIndex = 0,
        extendedState,
        scrollViewProps,
        positionIndex = 0,
        mode = 'week'
    } = props;


    const listRef = useCombinedRefs(ref);
    const page = useRef<ViewToken>();
    const isOnEdge = useRef(false);
    const isNearEdge = useRef(false);
    const scrolledByUser = useRef(false);
    const reloadPagesDebounce = useCallback(debounce(reloadPages, 500, { leading: false, trailing: true }), [reloadPages]);

    useEffect(() => {
        setTimeout(() => {
            const x = isHorizontal ? Math.floor(data.length / 2) * pageWidth : 0;
            const y = isHorizontal ? 0 : positionIndex * pageHeight;
            // @ts-expect-error
            listRef.current?.scrollToOffset?.(x, y, false);
        }, 0);
    }, [data]);


    //列表滚动变化监听配置
    const viewabilityConfig =  {
        viewAreaCoveragePercentThreshold: 85,
    } 

    /**
     *  可视区域变化
     */
    const onViewableItemsChanged = ({ viewableItems, changed }: {viewableItems: ViewToken[], changed: ViewToken[]}) => {
        const newPageArr: ViewToken[] = changed.filter(item=>item.isViewable);
        if(
            newPageArr.length
        ){
            const newPage = newPageArr[0];
            if(page.current?.index !== newPage.index){

                if (page.current?.index !== undefined) {
                    onPageChange?.(newPage, page.current, { scrolledByUser: scrolledByUser.current });
                    scrolledByUser.current = false;
                    isOnEdge.current = false;
                    isNearEdge.current = false;

                    if (newPage.index === 0 || newPage.index === data.length - 1) {
                        isOnEdge.current = true;
                    } else if (
                        onReachNearEdgeThreshold &&
                        !inRange(newPage.index as number, onReachNearEdgeThreshold, data.length - onReachNearEdgeThreshold)
                    ) {
                        isNearEdge.current = true;
                    }
                }

                if (isHorizontal && constants.isAndroid) {
                    // NOTE: this is done only to handle 'onMomentumScrollEnd' not being called on Android
                    setTimeout(() => {
                        onMomentumScrollEnd({});
                    }, 100);
                }

                page.current = newPage;
            }
        }
    };

    const viewabilityConfigCallbackPairs = useRef<FlatListProps<string>['viewabilityConfigCallbackPairs']>([{ viewabilityConfig, onViewableItemsChanged }]);

    
    const onMomentumScrollEnd = useCallback(
        (event: any) => {
            if (page.current?.index) {
                if (isOnEdge.current) {
                    onReachEdge?.(page.current.index!);
                    reloadPagesDebounce?.(page.current.index);
                } else if (isNearEdge.current) {
                    reloadPagesDebounce?.(page.current.index);
                    onReachNearEdge?.(page.current.index!);
                }
                scrollViewProps?.onMomentumScrollEnd?.(event);
            }
        },
        [scrollViewProps?.onMomentumScrollEnd, onReachEdge, onReachNearEdge, reloadPagesDebounce]
    );

    const onScrollBeginDrag = useCallback(() => {
        scrolledByUser.current = true;
    }, []);


    const style = useMemo(() => {
        return { height: pageHeight };
    }, [pageHeight]);

    return (
        <View style={style}>
            <FlashList
                ref={listRef}
                data={data}
                mode={mode}
                pagingEnabled
                bounces={false}
                horizontal={isHorizontal}
                renderItem={renderItem}
                keyExtractor={(item, index) => mode + '-' +item}
                estimatedItemSize={pageWidth}
                initialScrollIndex={initialPageIndex}
                showsHorizontalScrollIndicator={false}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                // onScroll={onScroll}
                extraData={extendedState}
                onScrollBeginDrag={onScrollBeginDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                decelerationRate={0.0}
                disableIntervalMomentum
            />
        </View>
    )

    // return (
    //     <RecyclerListView
    //         // @ts-expect-error
    //         ref={listRef}
    //         mode={mode}
    //         isHorizontal={isHorizontal}
    //         rowRenderer={renderItem}
    //         dataProvider={dataProvider}
    //         layoutProvider={layoutProvider.current}
    //         extendedState={extendedState}
    //         initialRenderIndex={initialPageIndex}
    //         renderAheadOffset={7 * pageWidth}
    //         onScroll={onScroll}
    //         style={style}
    //         scrollViewProps={scrollViewPropsMemo}
    //     />
    // );
};

export default forwardRef(InfiniteList);