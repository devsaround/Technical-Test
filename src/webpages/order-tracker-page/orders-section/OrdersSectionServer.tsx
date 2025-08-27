import PageHeaderClient from '@/webpages/shared/components/page-header/PageHeaderClient';
import { Skeleton } from 'antd';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import styles from './OrdersSectionServer.module.css';

const DynamicOrdersSectionClient = dynamic(
  () => import('./OrdersSectionClient'),
  { ssr: false }
);

async function OrdersSectionServer() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <>
      <PageHeaderClient hasDivider title='Orders' />
      <DynamicOrdersSectionClient />
    </>
  );
}

export default async function OrdersSectionServerWithSuspense() {
  return (
    <section className={styles['root-container']}>
      <Suspense fallback={<Skeleton loading active />}>
        <OrdersSectionServer />
      </Suspense>
    </section>
  );
}
