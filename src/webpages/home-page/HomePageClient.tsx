'use client';

import { Col, Row } from 'antd';
import PageHeaderClient from '../shared/components/page-header/PageHeaderClient';
import PageSubHeaderClient from '../shared/components/page-sub-header/PageSubHeaderClient';
import SeedDataCardClient from './seed-data-card/SeedDataCardClient';

interface IHomePageClientProps {
  hasSeedData: boolean;
}

export default function HomePageClient(props: IHomePageClientProps) {
  const { hasSeedData } = props;

  return (
    <main>
      <section>
        <PageHeaderClient hasDivider title='Home' />
      </section>
      <section>
        <PageSubHeaderClient title='Hello, Tahmid!' />
        <Row>
          <Col span={12}>
            <SeedDataCardClient hasSeedData={hasSeedData} />
          </Col>
        </Row>
      </section>
    </main>
  );
}
