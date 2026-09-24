import StackNames from '../StackNames';
import QuranStack from './quranStack';
import HomeStack from './homeStack';

export default [
  {
    name: StackNames.Quran,
    component: QuranStack,
    // Nested stack has no back screen of its own, so disable the outer swipe-back gesture too.
    options: { gestureEnabled: false },
  },
  {
    name: StackNames.HomeStack,
    component: HomeStack,
  },
];
