import { ConfigProvider, App as AntApp } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';

const theme = {
  token: {
    colorPrimary: '#4f46e5',
    colorInfo: '#4f46e5',
    colorLink: '#4f46e5',
    borderRadius: 12,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorTextBase: '#0f172a',
    colorBgLayout: '#f6f7fb',
  },
  components: {
    Button: { controlHeightLG: 44, fontWeight: 600 },
    Card: { boxShadowTertiary: '0 10px 30px rgba(15, 23, 42, 0.06)' },
    Table: { headerBg: '#f8fafc' },
    Layout: { headerBg: '#ffffff', bodyBg: '#f6f7fb' },
  },
};

const App = () => (
  <ConfigProvider theme={theme}>
    <AntApp>
      <RouterProvider router={router} />
    </AntApp>
  </ConfigProvider>
);

export default App;
