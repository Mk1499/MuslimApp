import { Image } from 'react-native';
import React from 'react';

export default function AppImage(props: React.ComponentProps<typeof Image>) {
  return <Image {...props} />;
}
