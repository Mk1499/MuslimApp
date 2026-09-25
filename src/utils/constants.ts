import { Dimensions, I18nManager, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const isRTL = I18nManager.isRTL;
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
