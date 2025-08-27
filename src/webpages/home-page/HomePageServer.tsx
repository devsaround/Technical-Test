import { SeedDataService } from '@/services/seed-data/SeedDataService';
import HomePageClient from '@/webpages/home-page/HomePageClient';
import { Skeleton } from 'antd';
import { Suspense } from 'react';

async function HomePageServer() {
  const hasSeedData = await SeedDataService.genHasSeedData();
  return <HomePageClient hasSeedData={hasSeedData} />;
}

export default function HomePageServerWithSuspense() {
  return (
    <Suspense fallback={<Skeleton loading active />}>
      <HomePageServer />
    </Suspense>
  );
}
