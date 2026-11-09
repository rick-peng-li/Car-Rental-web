import { useMemo, useState } from 'react';
import { Col, Empty, Row, Space, Statistic, Typography } from 'antd';
import { CarOutlined, DollarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import CarCard from '@/components/cars/CarCard';
import CarFilterBar from '@/components/cars/CarFilterBar';
import AppSpinner from '@/components/common/AppSpinner';
import { useCars } from '@/hooks/useCars';
import { filterAvailableCars } from '@/utils/rental';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const { cars, status } = useCars();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fuelType, setFuelType] = useState('all');

  const visibleCars = useMemo(() => {
    const available = filterAvailableCars(cars, from, to);
    if (fuelType === 'all') return available;
    return available.filter(
      (car) => car.fuelType?.toLowerCase() === fuelType.toLowerCase()
    );
  }, [cars, from, to, fuelType]);

  const handleReset = () => {
    setFrom(null);
    setTo(null);
    setFuelType('all');
  };

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__content">
          <Text className="hero__eyebrow">Premium car sharing</Text>
          <Title level={1} className="hero__title">
            Find the perfect car for every journey
          </Title>
          <Paragraph className="hero__text">
            Compare hourly rates, check live availability and book in seconds.
            No hidden fees, free cancellation and 24/7 support.
          </Paragraph>

          <Space size={40} wrap className="hero__stats">
            <Statistic title="Cars available" value={cars.length} prefix={<CarOutlined />} />
            <Statistic title="Starting from" value={22} prefix={<DollarOutlined />} suffix="/hr" />
            <Statistic title="Trusted by drivers" value="100%" prefix={<SafetyCertificateOutlined />} />
          </Space>
        </div>
      </section>

      <section className="section">
        <CarFilterBar
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fuelType={fuelType}
          onFuelTypeChange={setFuelType}
          onReset={handleReset}
        />

        <div className="section__heading">
          <Title level={3}>Available cars</Title>
          <Text type="secondary">
            {visibleCars.length} of {cars.length} cars match your filters
          </Text>
        </div>

        {status === 'loading' && <AppSpinner tip="Loading cars…" minHeight={320} />}

        {status !== 'loading' && visibleCars.length === 0 && (
          <Empty
            className="empty-state"
            description="No cars available for the selected filters. Try another time range or fuel type."
          />
        )}

        <Row gutter={[24, 24]}>
          {visibleCars.map((car) => (
            <Col key={car._id} xs={24} sm={12} lg={8} xl={6}>
              <CarCard car={car} />
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default HomePage;
