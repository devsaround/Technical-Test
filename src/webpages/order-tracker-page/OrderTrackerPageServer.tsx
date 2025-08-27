import { Skeleton } from 'antd';
import { Suspense } from 'react';
import OrderTrackerPageClient from './OrderTrackerPageClient';
import DriversSectionServerWithSuspense from './drivers-section/DriversSectionServer';
import OrdersSectionServerWithSuspense from './orders-section/OrdersSectionServer';

async function OrderTrackerPageServer() {
  return (
    <OrderTrackerPageClient>
      <OrdersSectionServerWithSuspense />
      <DriversSectionServerWithSuspense />
    </OrderTrackerPageClient>
  );
}

export default function OrderTrackerPageServerWithSuspense() {
  return (
    <Suspense fallback={<Skeleton loading active />}>
      <OrderTrackerPageServer />
    </Suspense>
  );
}
