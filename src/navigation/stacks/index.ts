import StackNames from '../StackNames';
import QuranStack from './quranStack';

export default [
  {
    name: StackNames.Quran,
    component: QuranStack,
    // Nested stack has no back screen of its own, so disable the outer swipe-back gesture too.
    options: { gestureEnabled: false },
  },
];
