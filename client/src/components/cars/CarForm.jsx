import { Button, Form, Input, InputNumber } from 'antd';

/**
 * Shared create/edit form for the admin area.
 */
const CarForm = ({ initialValues, submitting, submitLabel, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      requiredMark={false}
      className="car-form"
    >
      <Form.Item
        name="name"
        label="Car name"
        rules={[{ required: true, message: 'Please enter the car name' }]}
      >
        <Input size="large" placeholder="e.g. Toyota Camry" />
      </Form.Item>

      <Form.Item
        name="image"
        label="Image url"
        rules={[
          { required: true, message: 'Please enter an image url' },
          { type: 'url', message: 'Please enter a valid url' },
        ]}
      >
        <Input size="large" placeholder="https://..." />
      </Form.Item>

      <Form.Item
        name="rentPerHour"
        label="Rent per hour ($)"
        rules={[{ required: true, message: 'Please enter the hourly rate' }]}
      >
        <InputNumber size="large" min={1} style={{ width: '100%' }} placeholder="25" />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Capacity"
        rules={[{ required: true, message: 'Please enter the seat capacity' }]}
      >
        <InputNumber size="large" min={1} max={20} style={{ width: '100%' }} placeholder="5" />
      </Form.Item>

      <Form.Item
        name="fuelType"
        label="Fuel type"
        rules={[{ required: true, message: 'Please enter the fuel type' }]}
      >
        <Input size="large" placeholder="Petrol / Diesel / Electric" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        loading={submitting}
        block
      >
        {submitLabel}
      </Button>
    </Form>
  );
};

export default CarForm;
