import { StyleSheet, Text, View, SectionList, SectionListProps } from 'react-native'
import React, { useImperativeHandle, useRef, useCallback, useEffect, useContext } from 'react'
import { getYearMonthLocale, sameWeek } from '../Utils';
import { ReturnStyles } from '../Assets/style/types';
import { debounce } from 'lodash';
import CalendarContext from '../Context';
export interface AgendaListProps {
    sections: SectionListProps<any>['sections'];
    styles: ReturnStyles;
}

const AgendaList: React.FC<AgendaListProps> = (props) => {
    const { sections, styles } = props;
    const listRef = useRef<any>()
    const context = useContext(CalendarContext)
	const { date } = context;

    useEffect(() => {
          setTimeout(() => {
            scrollToSection(date);
          }, 500);
      }, []);

    const Item = (item: any) => {
        return (
            <View style={styles.agendaItemContainer}>
                <Text style={styles.agendaItemTitle}>{item.title.text}</Text>
                <View style={styles.agendaItem}>
                    {
                        item.title.data.map((value: any) => {
                            return (
                                <View style={styles.agendaItemInner}>
                                    <View style={styles.agendaItemSubtitle}>
                                        <Text style={styles.agendaItemSubtitleWeek}>{value.data.week}</Text>
                                        <Text style={styles.agendaItemSubtitleDay}>{value.data.day}</Text>
                                    </View>
                                    <View style={styles.agendaItemDetail}>
                                        <Text style={styles.agendaItemDetailTitle}>{value.data.title}</Text>
                                        <Text style={styles.agendaItemDetailDescription}>{value.data.description}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    };


    const _renderSectionHeader: SectionListProps<any>['renderSectionHeader'] = ({ section: { title } }) => {
        return (
            !!title ? <View style={styles.agendaHeaderContainer}>
                <Text style={styles.agendaHeaderText}>{title}</Text>
            </View> : null
        )
    }

    const _onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
        console.log('onScrollToIndexFailed info: ', info);
    };

    const getSectionIndex = (date: string) => {
        return sections.findIndex((item) => sameWeek(item.date, date));
    }

    const scrollToSection = useCallback(debounce((date: string) => {
        const sectionIndex = getSectionIndex(date);
        listRef?.current.scrollToLocation({
            animated: true,
            sectionIndex: 4,
            itemIndex: 3,
            viewPosition: 0, // position at the top
            viewOffset: 30,
          });
    }, 1000, {leading: false, trailing: true}), [sections])


    return (
        <View style={styles.agendaContainer}>
            <SectionList
                ref={listRef}
                sections={sections}
                keyExtractor={(item, index) => item.date}
                renderItem={({ item }) => <Item title={item} />}
                renderSectionHeader={_renderSectionHeader}
                showsVerticalScrollIndicator={false}
                onScrollToIndexFailed={_onScrollToIndexFailed}
            />
        </View>
    )
}

export default React.memo(AgendaList)
