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
            position: 'absolute',
            bottom: 4,
            left:0,
            width: '100%',
            height: 20,
            zIndex: 99,
            backgroundColor: 'transparent',
            shadowColor: appStyle.knobShadowColor,
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { height: 4, width: 0 },
            elevation: 3
            // borderBottomColor: appStyle.knobShadowColor,
            // borderBottomWidth: StyleSheet.hairlineWidth,
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
            backgroundColor: appStyle.containerBackgroundColor
        },
        agendaHeaderContainer: {
            paddingHorizontal: 18,
            paddingVertical: 12,
            flexDirection: 'row',
        },
        agendaHeaderText: {
            color: appStyle.buttonTextColor,
            fontWeight: 'bold',
            fontSize: 24,
        },
        agendaItemContainer: {
            paddingHorizontal: 18,
        },
        agendaItemTitle: {
            marginVertical: 12,
            marginLeft: 52,
            color: appStyle.disabledButtonTextColor,
        },
        agendaItem: {
        },
        agendaItemInner: {
            flex: 1,
            flexDirection: 'row',
            marginVertical: 12,
            height: 50,
        },
        agendaItemSubtitle: {
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 40,
        },
        agendaItemSubtitleWeek: {
            color: appStyle.buttonTextColor,
            fontSize: 16,
        },
        agendaItemSubtitleDay: {
            color: appStyle.buttonTextColor,
            fontSize: 26,
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
