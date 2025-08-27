import { FrownOutlined, RocketOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

interface ISeedDataCardDescriptionProps {
  hasSeedData: boolean;
}

export default function SeedDataCardDescription(
  props: ISeedDataCardDescriptionProps
): React.ReactNode {
  const { hasSeedData } = props;
  if (hasSeedData) {
    return (
      <Alert
        message='Data is ready'
        type='success'
        showIcon
        icon={<RocketOutlined />}
      />
    );
  }

  return (
    <Alert
      message='Data is currently missing'
      type='warning'
      showIcon
      icon={<FrownOutlined />}
    />
  );
}
