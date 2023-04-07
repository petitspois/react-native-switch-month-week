export interface ReturnStyles {
    containerWrapper: {
        flex: number;
        backgroundColor: string;
    },
    containerWrapperShadow: {
        shadowColor: string;
        shadowOffset: { width: number, height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    },
    weekNamesContainer: {
        width: string | number;
        height: number;
        flexDirection: 'row';
    },
    weekContainer: {
        flexDirection: 'row';
        flexWrap: 'wrap';
        backgroundColor: string;
    },
    monthContainer: {
        flexDirection: 'row';
        flexWrap: 'wrap';
        backgroundColor: string;
    },
    reservationContainer: {
        flex: number;
    },
    knobContainer: {
        justifyContent: 'center';
        alignItems: 'center';
        width: '100%';
        height: number;
        backgroundColor: string;
    },
    knobItem: {
        position: 'relative';
        flexDirection: 'row';
        alignItems: 'center';
        width: number;
        height: number;
    },
    knob: {
        position: 'absolute';
        width: number;
        height: number;
        left: number;
        borderRadius: number;
        backgroundColor: string;
    },
    dayText: {
        fontSize: number;
        fontWeight: 'bold';
        color: string;
    },
    dot: {
        position: 'absolute';
        left: string | number;
        bottom: 2;
        width: number;
        height: number;
        borderRadius: number;
        backgroundColor: string;
    },
    center: {
        justifyContent: 'center';
        alignItems: 'center';
    },
    selectedButton: {
        backgroundColor: string;
    },
    selectedTodayButton: {
        backgroundColor: string;
    },
    disabledButtonText: {
        color: string;
    },
    buttonText: {
        color: string;
    }
    todayButtonText: {
        color: string;
    },
    selectedTodayButtonText: {
        color: string;
    },

}
