import { StyleSheet, Platform } from 'react-native';
import * as defaultStyle from './style';
import { ReturnStyles } from './types';

export const styleConstructor = (theme = {}) => {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create<any>({
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
        dayLunar: {
            marginBottom: 2,
            fontSize: 10,
            color: '#111',
        },
        dot: {
            position: 'absolute',
            left: '50%',
            bottom: 2,
            width: appStyle.dotSize,
            height: appStyle.dotSize,
            borderRadius: 100,
            backgroundColor: appStyle.dotBackgroundColor,
            transform: [{ translateX: -appStyle.dotSize / 2 }],
        },
        dotLunar: {
            width: appStyle.dotSize,
            height: appStyle.dotSize,
            borderRadius: 100,
            backgroundColor: appStyle.dotBackgroundColor,
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
            flex:1,
            paddingHorizontal: 12,
            justifyContent: 'center',
            backgroundColor: appStyle.reservationBackgroundColor
        },
        agendaItemTitle: {
            marginLeft: 52,
            color: appStyle.disabledButtonTextColor,
        },
        agendaItem: {
            flex:1,
        },
        agendaItemInner: {
            flexDirection: 'row',
            flex:1,
        },
        agendaItemBar: {
            width: 4,
            height: '100%',
            borderRadius: 4,
            backgroundColor: appStyle.agendaItemTextColor,
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
            justifyContent: 'space-between',
            borderRadius: 4,
        },
        agendaItemDetailTitle: {
            color: appStyle.dayNameTextColor,
            fontWeight: 'bold'
        },
        agendaItemDetailExtra: {
            color: appStyle.dayNameTextColor,
        },
        agendaItemDetailDescription: {
            marginTop: 4,
            color: appStyle.disabledButtonTextColor,
        }
    })
};
