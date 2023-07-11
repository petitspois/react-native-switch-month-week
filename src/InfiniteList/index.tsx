import inRange from 'lodash/inRange';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';

import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollViewProps } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView, RecyclerListViewProps } from 'recyclerlistview';

import constants from '../Utils/constants';
import { useCombinedRefs } from '../Hooks';

const dataProviderMaker = (items: string[]) => new DataProvider((item1, item2) => item1 !== item2).cloneWithRows(items);

export interface InfiniteListProps
    extends Omit<RecyclerListViewProps, 'dataProvider' | 'layoutProvider' | 'rowRenderer'> {
    data: any[];
    renderItem: RecyclerListViewProps['rowRenderer'];
    pageWidth?: number;
    pageHeight?: number;
    onPageChange?: (pageIndex: number, prevPageIndex: number | undefined, info: { scrolledByUser: boolean }) => void;
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

    const dataProvider = useMemo(() => {
        return dataProviderMaker(data);
    }, [data]);

    const layoutProvider = useRef(
        new LayoutProvider(
            () => 'page',
            (_type, dim) => {
                dim.width = pageWidth;
                dim.height = pageHeight;
            }
        )
    );

    const listRef = useCombinedRefs(ref);
    const pageIndex = useRef<number>();
    const lastFirstVisibleIndex = useRef<number>(-1);
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


    /**
   *  可视区域变化
   */
    const _onVisibleIndicesChanged = (all: number[], now: number[], notNow: number[]) => {
        // now length , user end scrolling
        if(!now.length){
            const newPageIndex = all?.[0];
            if(pageIndex.current !== newPageIndex){
                if (newPageIndex !== undefined) {
                    onPageChange?.(newPageIndex, pageIndex.current, { scrolledByUser: scrolledByUser.current });
                    scrolledByUser.current = false;
                    isOnEdge.current = false;
                    isNearEdge.current = false;

                    if (newPageIndex === 0 || newPageIndex === data.length - 1) {
                        isOnEdge.current = true;
                    } else if (
                        onReachNearEdgeThreshold &&
                        !inRange(newPageIndex as number, onReachNearEdgeThreshold, data.length - onReachNearEdgeThreshold)
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

                pageIndex.current = newPageIndex;
            }

        }
    }


    const onMomentumScrollEnd = useCallback(
        event => {
            if (pageIndex.current) {
                if (isOnEdge.current) {
                    onReachEdge?.(pageIndex.current!);
                    reloadPagesDebounce?.(pageIndex.current);
                } else if (isNearEdge.current) {
                    reloadPagesDebounce?.(pageIndex.current);
                    onReachNearEdge?.(pageIndex.current!);
                }

                scrollViewProps?.onMomentumScrollEnd?.(event);
            }
        },
        [scrollViewProps?.onMomentumScrollEnd, onReachEdge, onReachNearEdge, reloadPagesDebounce]
    );

    const onScrollBeginDrag = useCallback(() => {
        scrolledByUser.current = true;
    }, []);

    const scrollViewPropsMemo = useMemo(() => {
        return {
            pagingEnabled: isHorizontal,
            bounces: false,
            showsHorizontalScrollIndicator: false,
            ...scrollViewProps,
            onScrollBeginDrag,
            onMomentumScrollEnd,
            decelerationRate: 0.1
        };
    }, [onScrollBeginDrag, onMomentumScrollEnd, scrollViewProps, isHorizontal]);

    const style = useMemo(() => {
        return { height: pageHeight };
    }, [pageHeight]);

    return (
        <RecyclerListView
            // @ts-expect-error
            ref={listRef}
            mode={mode}
            isHorizontal={isHorizontal}
            rowRenderer={renderItem}
            dataProvider={dataProvider}
            layoutProvider={layoutProvider.current}
            extendedState={extendedState}
            initialRenderIndex={initialPageIndex}
            // renderAheadOffset={1 * pageWidth}
            scrollThrottle={20}
            style={style}
            scrollViewProps={scrollViewPropsMemo}
            onVisibleIndicesChanged={_onVisibleIndicesChanged}
        />
    );
};

export default forwardRef(InfiniteList);