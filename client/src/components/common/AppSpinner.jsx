import { Flex, Spin } from 'antd';

const AppSpinner = ({ tip = 'Loading…', minHeight = 240 }) => (
  <Flex align="center" justify="center" style={{ minHeight }}>
    <Spin size="large" tip={tip}>
      <div style={{ padding: 24 }} />
    </Spin>
  </Flex>
);

export default AppSpinner;
