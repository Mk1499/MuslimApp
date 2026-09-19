import ScreenNames from './ScreenNames';
import { AboutScreen } from '@/features/about/AboutScreen';
import Mushaf from '@/features/quran/screens/Mushaf/Mushaf.screen';

export default [
  {
    name: ScreenNames.About,
    component: AboutScreen,
  },
  {
    name: ScreenNames.Mushaf,
    component: Mushaf,
  },
];
