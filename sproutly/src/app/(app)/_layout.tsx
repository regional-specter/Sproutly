import { StatusBar } from 'expo-status-bar';

import AppTabs from '@/components/app-tabs';

export default function AppLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AppTabs />
    </>
  );
}
