import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { SproutlyColors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={SproutlyColors.white}
      indicatorColor={SproutlyColors.progressTrack}
      labelStyle={{ selected: { color: SproutlyColors.black } }}>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon
          sf="house"
          androidSrc={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="analysis">
        <Label>Analysis</Label>
        <Icon
          sf="chart.bar"
          androidSrc={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon
          sf="gearshape"
          androidSrc={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
