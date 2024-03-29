export interface ReturnStyles {
    containerWrapper: {
        flex: number;
        backgroundColor: string;
    },
    calendar: {

    },
    containerWrapperShadow: {
        borderBottomColor: string;
        borderBottomWidth: number;
    },
    weekNamesContainer: {
        width: string | number;
        height: number;
        flexDirection: 'row';
    },
    weekNamesText: {
        color: string;
    }
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
    agendaContainer: {
        flex:1,
        backgroundColor: string;
    },
    agendaHeaderContainer: {
        flexDirection: 'row';
        paddingHorizontal: number;
    },
    agendaHeaderText: {
        color: string;
        fontWeight: 'bold';
        fontSize: number;
    },
    agendaItemContainer: {
        backgroundColor: string;
    },
    agendaItemTitle: {
        color: string;
    },
    agendaItem: {
        flexDirection: 'row';
    },
    agendaItemInner: {
        flexDirection: 'row';
    },
    agendaItemBar: {
       width: number;
    },
    agendaItemSubtitleWeek: {
        color: string;
        fontSize: 16;
    },
    agendaItemSubtitleDay: {
        color: string;
        fontSize: 26;
        fontWeight: 'bold';
    },
    agendaItemDetail: {
        paddingHorizontal: 6;
        paddingVertical: 4;
        marginLeft: 12;
        borderRadius: 4;
        backgroundColor: string;
    },
    agendaItemDetailTitle: {
        color: string;
    },
    agendaItemDetailExtra: {
        color: string;
    },
    agendaItemDetailDescription: {
        marginTop: 4;
        color: string;
    }
}
