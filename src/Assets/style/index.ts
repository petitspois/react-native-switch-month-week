import { StyleSheet, Platform } from 'react-native';
import * as defaultStyle from './style';
import { ReturnStyles } from './types';

export const styleConstructor = (theme = {}) => {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create<ReturnStyles>({
        containerWrapper: {
            flex: 1,
            backgroundColor: appStyle.containerBackgroundColor
        },
        calendar: {
        },
        containerWrapperShadow: {
            borderBottomColor: appStyle.knobShadowColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        weekNamesContainer: {
            width: '100%',
            height: 30,
            flexDirection: 'row',
            backgroundColor: appStyle.calendarBackgroundColor
        },
        weekNamesText: {
            color: appStyle.buttonTextColor,
        },
        weekContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: appStyle.calendarBackgroundColor
        },
        monthContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: appStyle.calendarBackgroundColor
        },
        reservationContainer: {
            flex: 1,
            backgroundColor: appStyle.reservationBackgroundColor
        },
        knobContainer: {
            position: 'relative',
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 24,
            backgroundColor: appStyle.calendarBackgroundColor
        },
        knobItem: {
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            width: 40,
            height: 24,
        },
        knob: {
            position: 'absolute',
            width: 18,
            height: 4,
            left: 4,
            borderRadius: 4,
            backgroundColor: '#ccc',
        },
        dayText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: '#111',
        },
        dot: {
            position: 'absolute',
            left: '50%',
            bottom: 2,
            width: appStyle.dotSize,
            height: appStyle.dotSize,
            borderRadius: 100,
            backgroundColor: appStyle.dotBackgroundColor
        },
        center: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedButton: {
            backgroundColor: appStyle.selectedButtonBackgroundColor,
        },
        selectedTodayButton: {
            backgroundColor: appStyle.selectedTodayButtonBackgroundColor,
        },
        disabledButtonText: {
            color: appStyle.disabledButtonTextColor
        },
        todayButtonText: {
            color: appStyle.todayTextColor,
        },
        buttonText: {
            color: appStyle.buttonTextColor,
        },
        selectedTodayButtonText: {
            color: 'white',
        },
        agendaContainer: {
            flex:1,
            backgroundColor: appStyle.containerBackgroundColor
        },
        agendaHeaderContainer: {
            flexDirection: 'row',
        },
        agendaHeaderText: {
            color: appStyle.buttonTextColor,
            fontWeight: 'bold',
            fontSize: 24,
        },
        agendaItemContainer: {
            paddingHorizontal: 18,
            justifyContent: 'center',
            height: 60,
            backgroundColor: appStyle.reservationBackgroundColor
        },
        agendaItemTitle: {
            marginLeft: 52,
            color: appStyle.disabledButtonTextColor,
        },
        agendaItem: {
            flex:1,
            justifyContent: 'center',
        },
        agendaItemInner: {
            flexDirection: 'row',
            height: 50,
        },
        agendaItemSubtitle: {
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: 40,
        },
        agendaItemSubtitleWeek: {
            color: appStyle.buttonTextColor,
            fontSize: 12,
        },
        agendaItemSubtitleDay: {
            color: appStyle.buttonTextColor,
            fontSize: 20,
            fontWeight: 'bold'
        },
        agendaItemDetail: {
            flex: 1,
            paddingHorizontal: 6,
            paddingVertical: 4,
            marginLeft: 12,
            borderRadius: 4,
            borderLeftWidth: 4,
            borderLeftColor: appStyle.agendaItemTextColor,
            backgroundColor: appStyle.agendaItemBackgroundColor,
        },
        agendaItemDetailTitle: {
            color: appStyle.agendaItemTextColor,
        },
        agendaItemDetailDescription: {
            marginTop: 4,
            color: appStyle.agendaItemTextColor,
        }
    })
};
