import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  App as AntApp,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Flex,
  Result,
  Row,
  Tag,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CarOutlined,
  ThunderboltOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import AppSpinner from '@/components/common/AppSpinner';
import BookingSummary from '@/components/booking/BookingSummary';
import BookedSlotsModal from '@/components/booking/BookedSlotsModal';
import PaymentModal from '@/components/booking/PaymentModal';
import DateRangeFields from '@/components/cars/DateRangeFields';
import { useCars } from '@/hooks/useCars';
import { useBookingQuote } from '@/hooks/useBookingQuote';
import { createBooking } from '@/store/slices/bookingsSlice';
import { DATE_FORMAT, RENTAL_RULES } from '@/utils/constants';
import { getRangeError, isCarAvailable } from '@/utils/rental';

const { Title, Text } = Typography;

const defaultPickup = () => dayjs().add(1, 'day').hour(10).minute(0).second(0).millisecond(0);
const defaultReturn = () => dayjs().add(2, 'day').hour(10).minute(0).second(0).millisecond(0);

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message } = AntApp.useApp();

  const { cars, status } = useCars();
  const { submitting, error } = useSelector((state) => state.bookings);

  const [from, setFrom] = useState(defaultPickup);
  const [to, setTo] = useState(defaultReturn);
  const [driverRequired, setDriverRequired] = useState(false);
  const [slotsOpen, setSlotsOpen] = useState(false);

  const car = useMemo(() => cars.find((item) => item._id === carId), [cars, carId]);

  const { hours, totalAmount, showPayment, openPayment, closePayment } = useBookingQuote(
    car,
    from,
    to,
    driverRequired
  );

  const rangeError = getRangeError(from, to);

  const rangeAvailable = useMemo(() => {
    if (!car || !from || !to || rangeError) return false;
    return isCarAvailable(car, from.toDate(), to.toDate());
  }, [car, from, to, rangeError]);

  useEffect(() => {
    if (status === 'succeeded' && cars.length > 0 && !car) {
      message.error('Car not found');
      navigate('/', { replace: true });
    }
  }, [status, cars.length, car, message, navigate]);

  const handleConfirmPayment = async () => {
    const result = await dispatch(
      createBooking({
        car: car._id,
        bookedTimeSlots: {
          from: from.format(DATE_FORMAT),
          to: to.format(DATE_FORMAT),
        },
        driverRequired,
      })
    );

    if (createBooking.fulfilled.match(result)) {
      closePayment();
      message.success('Booking confirmed — enjoy your ride!');
      navigate('/my-bookings');
    }
  };

  if (status === 'loading') {
    return <AppSpinner tip="Loading car details…" minHeight={420} />;
  }

  if (!car) {
    return (
      <Result
        status="404"
        title="Car not found"
        subTitle="The car you are looking for is no longer available."
        extra={
          <Link to="/">
            <Button type="primary">Back to cars</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeftOutlined /> Back to all cars
      </Link>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={14}>
          <div className="booking-visual">
            <img src={car.image} alt={car.name} />
          </div>

          <Title level={2} style={{ marginTop: 24 }}>
            {car.name}
          </Title>

          <Flex gap={12} wrap>
            <Tag icon={<TeamOutlined />}>{car.capacity} seats</Tag>
            <Tag icon={<ThunderboltOutlined />} color="green">
              {car.fuelType}
            </Tag>
            <Tag icon={<CarOutlined />} color="blue">
              ${car.rentPerHour}/hour
            </Tag>
          </Flex>

          <Descriptions className="rental-rules" column={1} size="small" style={{ marginTop: 24 }}>
            {RENTAL_RULES.map((rule) => (
              <Descriptions.Item key={rule} label={<CalendarOutlined />}>
                {rule}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="booking-panel" styles={{ body: { padding: 24 } }}>
            <Title level={4}>Reserve this car</Title>

            {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

            <DateRangeFields
              from={from}
              to={to}
              onFromChange={setFrom}
              onToChange={setTo}
              stacked
            />

            {rangeError && (
              <Alert type="warning" showIcon message={rangeError} style={{ marginTop: 12 }} />
            )}

            {!rangeError && !rangeAvailable && (
              <Alert
                type="warning"
                showIcon
                message="This car is already booked for part of the selected period."
                style={{ marginTop: 12 }}
              />
            )}

            <Button
              className="slots-button"
              size="large"
              onClick={() => setSlotsOpen(true)}
              style={{ marginTop: 16 }}
              block
            >
              View booked slots
            </Button>

            <Divider dashed />

            <Checkbox
              checked={driverRequired}
              onChange={(event) => setDriverRequired(event.target.checked)}
            >
              Add a driver (+$30/hour)
            </Checkbox>

            <BookingSummary
              car={car}
              hours={hours}
              driverRequired={driverRequired}
              totalAmount={totalAmount}
            />

            <Divider dashed />

            <Button
              type="primary"
              size="large"
              block
              disabled={!rangeAvailable || hours <= 0}
              onClick={openPayment}
              loading={submitting}
            >
              Continue · ${totalAmount}
            </Button>
          </Card>
        </Col>
      </Row>

      <BookedSlotsModal
        open={slotsOpen}
        slots={car.bookedTimeSlots}
        onClose={() => setSlotsOpen(false)}
      />

      <PaymentModal
        open={showPayment}
        amount={totalAmount}
        loading={submitting}
        onCancel={closePayment}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
};

export default BookingPage;
