import { useEffect } from 'react';
import { Alert, Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthShell from '@/components/auth/AuthShell';
import { clearAuthError, registerUser } from '@/store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    const result = await dispatch(
      registerUser({ username: values.username, password: values.password })
    );

    if (registerUser.fulfilled.match(result)) {
      message.success('Account created, please sign in');
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book your first car in under a minute."
      footer={
        <span>
          Already registered? <Link to="/login">Sign in</Link>
        </span>
      }
    >
      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

      <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large">
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please choose a username' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
        >
          <Input placeholder="johndoe" autoComplete="username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please choose a password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="••••••••" autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="••••••••" autoComplete="new-password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Create account
        </Button>
      </Form>
    </AuthShell>
  );
};

export default RegisterPage;
