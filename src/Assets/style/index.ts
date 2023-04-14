import { StyleSheet } from 'react-native';
import * as defaultStyle from './style';
import { ReturnStyles } from './types';

export const styleConstructor = (theme = {}) => {
    const appStyle = { ...defaultStyle, ...theme };
    return StyleSheet.create<ReturnStyles>({
        containerWrapper: {
            flex: 1,
            backgroundColor: appStyle.containerBackgroundColor
        },
        containerWrapperShadow: {
            shadowColor: appStyle.knobShadowColor,
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.4,
            shadowRadius: 3,
            elevation: 5,
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

    })
};
