'use client';

import { TEntityDriverClient } from '@/services/order-tracker/drivers/IEntityDriver';
import useDeviceWidth from '@/webpages/shared/hooks/useDeviceWidth';
import { purple } from '@ant-design/colors';
import { CarTwoTone } from '@ant-design/icons';
import { List, Progress } from 'antd';
import {
  PROGRESS_BAR_HEIGHT,
  PROGRESS_BAR_MAX_WIDTH_PERCENT,
} from '../order-tracker-constants';

// TEMPORARY PLACEHOLDER DATA
const getMockStatusConfigByIndex = (index: number) => {
  if (index === 0) {
    return [5, 30];
  }

  if (index === 1) {
    return [12, 55];
  }

  return [0, 0];
};

interface IDriversSectionClientProps {
  drivers: TEntityDriverClient[];
}

export default function DriversSectionClient(
  props: IDriversSectionClientProps
) {
  const { drivers } = props;

  const [deviceWidth] = useDeviceWidth();

  return (
    <List<TEntityDriverClient>
      bordered
      dataSource={drivers}
      renderItem={(driver, index) => {
        const [percentComplete, numSteps] = getMockStatusConfigByIndex(index);
        return (
          <List.Item>
            <List.Item.Meta
              avatar={
                <CarTwoTone
                  twoToneColor={purple[5]}
                  style={{ fontSize: '24px' }}
                />
              }
              title={`Driver: ${driver._id}`}
              description={
                <Progress
                  strokeColor={purple[5]}
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
  );
}
