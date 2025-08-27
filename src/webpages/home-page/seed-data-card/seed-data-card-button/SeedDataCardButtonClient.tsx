import { DatabaseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface ISeedDataCardButtonClientProps {
  isLoading: boolean;
  hasSeedData: boolean;
  makeDELETERequest: () => void;
  makePOSTRequest: () => void;
}

export default function SeedDataCardButtonClient(
  props: ISeedDataCardButtonClientProps
): React.ReactNode {
  const { isLoading, hasSeedData, makeDELETERequest, makePOSTRequest } = props;

  if (isLoading) {
    return <LoadingOutlined />;
  }

  if (hasSeedData) {
    return (
      <>
        <Button
          danger
          type='primary'
          shape='round'
          icon={<DatabaseOutlined />}
          onClick={makeDELETERequest}
        >
          Delete seed
        </Button>
      </>
    );
  }

  return (
    <>
      <Button
        type='primary'
        shape='round'
        icon={<DatabaseOutlined />}
        onClick={makePOSTRequest}
      >
        Create seed
      </Button>
    </>
  );
}
