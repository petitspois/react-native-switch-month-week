import { isToday, isDateNotInRange, sameMonth, toMarkingFormat  } from './index';
export function getState(day, current, props) {
    const { minDate, maxDate, disabledByDefault, context } = props;
    let state = '';
    if (context?.date === toMarkingFormat(day)) {
        state = 'selected';
    }
    else if (isToday(day)) {
        state = 'today';
    }
    else if (disabledByDefault) {
        state = 'disabled';
    }
    else if (isDateNotInRange(day, minDate, maxDate)) {
        state = 'disabled';
    }
    else if (!sameMonth(day, current)) {
        state = 'disabled';
    }
    return state;
}
