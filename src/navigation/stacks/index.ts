import StackNames from '../StackNames';
import QuranStack from './quranStack';
import HomeStack from './homeStack';
import MutashabihatStack from './mutashabihatStack';
import MediaStack from './mediaStack';

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
  {
    name: StackNames.MediaStack,
    component: MediaStack,
  },
];
