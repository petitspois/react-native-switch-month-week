import React from 'react';
import { ScrollViewProps } from 'react-native';
export interface InfiniteListProps {
    data: any[];
    renderItem: () => JSX.Element | JSX.Element[] | null;
    pageWidth?: number;
    pageHeight?: number;
    onPageChange?: (pageIndex: number, prevPageIndex: number, info: {
        scrolledByUser: boolean;
    }) => void;
    onReachEdge?: (pageIndex: number) => void;
    onReachNearEdge?: (pageIndex: number) => void;
    onReachNearEdgeThreshold?: number;
    initialPageIndex?: number;
    scrollViewProps?: ScrollViewProps;
    reloadPages?: (pageIndex: number) => void;
    positionIndex?: number;
}