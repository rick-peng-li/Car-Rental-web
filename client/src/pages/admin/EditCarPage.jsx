import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { App as AntApp, Button, Card, Result, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CarForm from '@/components/cars/CarForm';
import AppSpinner from '@/components/common/AppSpinner';
import { useCars } from '@/hooks/useCars';
import { updateCar } from '@/store/slices/carsSlice';

const { Title, Text } = Typography;

const EditCarPage = () => {
  const { carId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { cars, status, mutationLoading } = useCars();

  const car = useMemo(() => cars.find((item) => item._id === carId), [cars, carId]);

  const handleSubmit = async (values) => {
    const result = await dispatch(updateCar({ id: carId, ...values }));
    if (updateCar.fulfilled.match(result)) {
      message.success('Car updated successfully');
      navigate('/admin');
    } else {
      message.error(result.payload || 'Could not update the car');
    }
  };

  if (status === 'loading') {
    return <AppSpinner tip="Loading car…" minHeight={420} />;
  }

  if (!car) {
    return (
      <Result
        status="404"
        title="Car not found"
        extra={
          <Button type="primary" onClick={() => navigate('/admin')}>
            Back to dashboard
          </Button>
        }
      />
    );
  }

  return (
    <div className="page page--narrow">
      <Link to="/admin" className="back-link">
        <ArrowLeftOutlined /> Back to dashboard
      </Link>

      <Card className="form-card" styles={{ body: { padding: 32 } }}>
        <Title level={3}>Edit car</Title>
        <Text type="secondary">Update the details of {car.name}.</Text>
        <div style={{ marginTop: 24 }}>
          <CarForm
            initialValues={car}
            submitting={mutationLoading}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default EditCarPage;
