import XDate from 'xdate';
import { isToday, isPastDate, toMarkingFormat } from './index';
import { getDefaultLocale } from '../Utils/services';
import { todayString as commonsTodayString } from '../Commons';
const TOP_POSITION = 65;
/** Today */
export const getTodayDate = () => {
    return toMarkingFormat(new XDate());
};
export const getTodayFormatted = () => {
    const todayString = getDefaultLocale().today || commonsTodayString;
    const today = todayString.charAt(0).toUpperCase() + todayString.slice(1);
    return today;
};
/** Today button's icon */
export const _getIconDown = () => {
    return require('../Img/down.png');
};
export const _getIconUp = () => {
    return require('../Img/up.png');
};
export const getButtonIcon = (date, showTodayButton = true) => {
    if (showTodayButton) {
        const icon = isPastDate(date) ? _getIconDown() : _getIconUp();
        return icon;
    }
};
/** Animations */
export const shouldAnimateTodayButton = (props) => {
    return props.showTodayButton;
};
export const getPositionAnimation = (date, todayBottomMargin = 0) => {
    const toValue = isToday(date) ? TOP_POSITION : -todayBottomMargin || -TOP_POSITION;
    return {
        toValue,
        tension: 30,
        friction: 8,
        useNativeDriver: true
    };
};
export const shouldAnimateOpacity = (props) => {
    return props.disabledOpacity;
};
export const getOpacityAnimation = ({ disabledOpacity = 0 }, disabled) => {
    return {
        toValue: disabled ? disabledOpacity : 1,
        duration: 500,
        useNativeDriver: true
    };
};
