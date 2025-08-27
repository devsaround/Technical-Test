'use client';

import useDeviceWidth from '@/webpages/shared/hooks/useDeviceWidth';
import { PlusOutlined, SmileTwoTone } from '@ant-design/icons';
import { Button, List, Progress } from 'antd';
import {
  PROGRESS_BAR_HEIGHT,
  PROGRESS_BAR_MAX_WIDTH_PERCENT,
} from '../order-tracker-constants';
import styles from './OrdersSectionClient.module.css';

// TEMPORARY PLACEHOLDER DATA
const getMockStatusConfigByIndex = (index: number) => {
  if (index === 0) {
    return [5, 30];
  }

  return [12, 55];
};

export default function OrdersSectionClient() {
  const [deviceWidth] = useDeviceWidth();

  return (
    <>
      <div className={styles['header-container']}>
        <Button size='small' type='primary' icon={<PlusOutlined />}>
          Create Order
        </Button>
      </div>
      <List
        bordered
        dataSource={[1, 2]}
        renderItem={(_, index) => {
          // TEMP (PLACEHOLDER) VALUES
          const [percentComplete, numSteps] = getMockStatusConfigByIndex(index);
          return (
            <List.Item
              actions={[
                <Button danger size='small' key='cancel_button'>
                  Cancel
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<SmileTwoTone style={{ fontSize: '24px' }} />}
                title={`Order #${index + 1}`}
                description={
                  <Progress
                    size={[
                      (deviceWidth * PROGRESS_BAR_MAX_WIDTH_PERCENT) / numSteps,
                      PROGRESS_BAR_HEIGHT,
                    ]}
                    percent={percentComplete}
                    steps={numSteps}
                  />
                }
              />
            </List.Item>
          );
        }}
      />
    </>
  );
}
