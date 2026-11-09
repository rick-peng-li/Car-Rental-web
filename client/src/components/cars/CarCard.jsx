import { Button, Card, Flex, Tag, Typography } from 'antd';
import {
  ThunderboltOutlined,
  TeamOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const CarCard = ({ car }) => (
  <Card
    className="car-card"
    cover={
      <div className="car-card__cover">
        <img src={car.image} alt={car.name} loading="lazy" />
        <Tag className="car-card__price" color="geekblue" bordered={false}>
          ${car.rentPerHour}/hr
        </Tag>
      </div>
    }
    styles={{ body: { padding: 20 } }}
  >
    <Title level={4} className="car-card__title">
      {car.name}
    </Title>

    <Flex gap={16} className="car-card__meta">
      <Text type="secondary">
        <TeamOutlined /> {car.capacity} seats
      </Text>
      <Text type="secondary">
        <ThunderboltOutlined /> {car.fuelType}
      </Text>
    </Flex>

    <Link to={`/booking/${car._id}`}>
      <Button type="primary" block icon={<ArrowRightOutlined />} iconPosition="end" size="large">
        Book now
      </Button>
    </Link>
  </Card>
);

export default CarCard;
