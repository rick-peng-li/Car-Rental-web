import { useEffect } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthShell from '@/components/auth/AuthShell';
import { clearAuthError, loginUser } from '@/store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate(location.state?.from || '/', { replace: true });
    }
  }, [token, navigate, location.state]);

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your rentals and bookings."
      footer={
        <span>
          New here? <Link to="/register">Create an account</Link>
        </span>
      }
    >
      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input placeholder="admin" autoComplete="username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password placeholder="••••••••" autoComplete="current-password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Sign in
        </Button>
      </Form>
    </AuthShell>
  );
};

export default LoginPage;
