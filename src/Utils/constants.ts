import { Dimensions, I18nManager, Platform } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isRTL = I18nManager.isRTL;
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const screenAspectRatio = screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
const isTablet = Platform.isPad || (screenAspectRatio < 1.6 && Math.max(screenWidth, screenHeight) >= 900);
const dayNamesShort = ['日','一', '二', '三', '四', '五', '六']
const NUMBER_OF_PAGES = 50;
export default {
    screenWidth,
    screenHeight,
    isRTL,
    isAndroid,
    isIOS,
    isTablet,
    dayNamesShort,
    NUMBER_OF_PAGES,
};
