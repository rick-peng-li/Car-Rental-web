import { Alert, Button, Flex, Form, Input, Modal, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Text } = Typography;

/**
 * Demo checkout. No card data leaves the browser — the booking endpoint
 * issues its own transaction id.
 */
const PaymentModal = ({ open, amount, loading, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onConfirm(values);
  };

  return (
    <Modal
      title="Secure checkout"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={`Pay $${amount}`}
      cancelText="Cancel"
      destroyOnHidden
    >
      <Alert
        type="info"
        showIcon
        message="Demo payment"
        description="This is a demo checkout. No real charge is made and card details are never sent to the server."
        style={{ marginBottom: 20 }}
      />

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="cardNumber"
          label="Card number"
          rules={[
            { required: true, message: 'Please enter a card number' },
            { pattern: /^\d{16}$/, message: 'Card number must be 16 digits' },
          ]}
        >
          <Input size="large" placeholder="4242 4242 4242 4242" maxLength={16} />
        </Form.Item>

        <Form.Item
          name="cardHolder"
          label="Card holder"
          rules={[{ required: true, message: 'Please enter the card holder name' }]}
        >
          <Input size="large" placeholder="John Doe" />
        </Form.Item>

        <Flex gap={12}>
          <Form.Item
            name="expiry"
            label="Expiry"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Expiry is required' },
              { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Use MM/YY' },
            ]}
          >
            <Input size="large" placeholder="MM/YY" />
          </Form.Item>
          <Form.Item
            name="cvc"
            label="CVC"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'CVC is required' },
              { pattern: /^\d{3}$/, message: '3 digits' },
            ]}
          >
            <Input size="large" placeholder="123" />
          </Form.Item>
        </Flex>
      </Form>

      <Text type="secondary">
        <LockOutlined /> Secured with 256-bit encryption
      </Text>

      <Button type="link" onClick={onCancel} style={{ paddingInline: 0 }}>
        Cancel payment
      </Button>
    </Modal>
  );
};

export default PaymentModal;
