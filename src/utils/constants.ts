import { Dimensions, I18nManager } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const isRTL = I18nManager.isRTL;
