import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  App as AntApp,
  Button,
  Card,
  Empty,
  Flex,
  Popconfirm,
  Tag,
  Typography,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AppSpinner from '@/components/common/AppSpinner';
import { cancelBooking, fetchMyBookings } from '@/store/slices/bookingsSlice';
import { formatDate, formatSlot } from '@/utils/rental';

const { Title, Text } = Typography;

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { message } = AntApp.useApp();
  const { bookings, status } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = async (id) => {
    const result = await dispatch(cancelBooking(id));
    if (cancelBooking.fulfilled.match(result)) {
      message.success('Booking cancelled');
    } else {
      message.error(result.payload || 'Could not cancel the booking');
    }
  };

  return (
    <div className="page">
      <div className="section__heading">
        <div>
          <Title level={2}>My bookings</Title>
          <Text type="secondary">Track and manage every reservation you have made.</Text>
        </div>
      </div>

      {status === 'loading' && <AppSpinner tip="Loading bookings…" />}

      {status !== 'loading' && bookings.length === 0 && (
        <Empty description="You have no bookings yet.">
          <Link to="/">
            <Button type="primary">Browse cars</Button>
          </Link>
        </Empty>
      )}

      <Flex vertical gap={16}>
        {bookings.map((booking) => (
          <Card key={booking._id} className="booking-card" styles={{ body: { padding: 20 } }}>
            <Flex gap={20} wrap align="center" justify="space-between">
              <Flex gap={20} align="center" wrap>
                <img
                  className="booking-card__image"
                  src={booking.car?.image}
                  alt={booking.car?.name}
                />
                <div>
                  <Flex gap={8} align="center">
                    <Title level={4} style={{ margin: 0 }}>
                      {booking.car?.name}
                    </Title>
                    <Tag color={booking.status === 'cancelled' ? 'red' : 'green'}>
                      {booking.status}
                    </Tag>
                  </Flex>
                  <Text type="secondary">
                    {formatSlot(booking.bookedTimeSlots)} · {booking.totalHours}h ·{' '}
                    {booking.driverRequired ? 'With driver' : 'Self drive'}
                  </Text>
                  <br />
                  <Text type="secondary">
                    Booked on {formatDate(booking.createdAt)} · Ref {booking.transactionId.slice(0, 8)}
                  </Text>
                </div>
              </Flex>

              <Flex align="center" gap={16}>
                <Title level={3} style={{ margin: 0 }}>
                  ${booking.totalAmount}
                </Title>
                {booking.status !== 'cancelled' && (
                  <Popconfirm
                    title="Cancel this booking?"
                    description="The reserved time slot will be released."
                    okText="Yes, cancel"
                    cancelText="No"
                    onConfirm={() => handleCancel(booking._id)}
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Cancel
                    </Button>
                  </Popconfirm>
                )}
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>
    </div>
  );
};

export default MyBookingsPage;
