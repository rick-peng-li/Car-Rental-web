import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { App as AntApp, Button, Card, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CarForm from '@/components/cars/CarForm';
import { addCar } from '@/store/slices/carsSlice';

const { Title, Text } = Typography;

const AddCarPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { mutationLoading } = useSelector((state) => state.cars);

  const handleSubmit = async (values) => {
    const result = await dispatch(addCar(values));
    if (addCar.fulfilled.match(result)) {
      message.success('Car added successfully');
      navigate('/admin');
    } else {
      message.error(result.payload || 'Could not add the car');
    }
  };

  return (
    <div className="page page--narrow">
      <Link to="/admin" className="back-link">
        <ArrowLeftOutlined /> Back to dashboard
      </Link>

      <Card className="form-card" styles={{ body: { padding: 32 } }}>
        <Title level={3}>Add a new car</Title>
        <Text type="secondary">Fill in the details below to publish the car to the fleet.</Text>
        <div style={{ marginTop: 24 }}>
          <CarForm
            submitting={mutationLoading}
            submitLabel="Add car"
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default AddCarPage;
