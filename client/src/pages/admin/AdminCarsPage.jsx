import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  App as AntApp,
  Button,
  Flex,
  Image,
  Popconfirm,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useCars } from '@/hooks/useCars';
import { fetchAllBookings } from '@/store/slices/bookingsSlice';
import { removeCar } from '@/store/slices/carsSlice';
import { formatDate, formatSlot } from '@/utils/rental';

const { Title, Text } = Typography;

const AdminCarsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message } = AntApp.useApp();
  const { cars, status } = useCars();
  const { bookings, status: bookingsStatus } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const result = await dispatch(removeCar(id));
    if (removeCar.fulfilled.match(result)) {
      message.success('Car deleted');
    } else {
      message.error(result.payload || 'Could not delete the car');
    }
  };

  const carColumns = [
    {
      title: 'Car',
      dataIndex: 'name',
      key: 'name',
      render: (_, car) => (
        <Flex gap={12} align="center">
          <Image src={car.image} width={72} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} preview={false} />
          <div>
            <Text strong>{car.name}</Text>
            <br />
            <Text type="secondary">
              {car.capacity} seats · {car.fuelType}
            </Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rentPerHour',
      key: 'rentPerHour',
      width: 120,
      render: (value) => <Tag color="blue">${value}/hr</Tag>,
    },
    {
      title: 'Bookings',
      key: 'bookings',
      width: 120,
      render: (_, car) => car.bookedTimeSlots?.length || 0,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, car) => (
        <Flex gap={8}>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/edit-car/${car._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this car?"
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(car._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const bookingColumns = [
    {
      title: 'Car',
      key: 'car',
      render: (_, booking) => booking.car?.name || '—',
    },
    {
      title: 'Customer',
      key: 'user',
      render: (_, booking) => booking.user?.username || '—',
    },
    {
      title: 'Period',
      key: 'period',
      render: (_, booking) => formatSlot(booking.bookedTimeSlots),
    },
    {
      title: 'Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
      width: 90,
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 110,
      render: (value) => `$${value}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (value) => (
        <Tag color={value === 'cancelled' ? 'red' : 'green'}>{value}</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (value) => formatDate(value),
    },
  ];

  return (
    <div className="page">
      <Flex justify="space-between" align="center" wrap gap={16} className="section__heading">
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Admin dashboard
          </Title>
          <Text type="secondary">Manage the fleet and keep an eye on every reservation.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/add-car')}>
          Add car
        </Button>
      </Flex>

      <Tabs
        defaultActiveKey="cars"
        className="admin-tabs"
        items={[
          {
            key: 'cars',
            label: `Cars (${cars.length})`,
            children: (
              <Table
                rowKey="_id"
                columns={carColumns}
                dataSource={cars}
                loading={status === 'loading'}
                pagination={{ pageSize: 6, hideOnSinglePage: true }}
                scroll={{ x: 760 }}
              />
            ),
          },
          {
            key: 'bookings',
            label: `Bookings (${bookings.length})`,
            children: (
              <Table
                rowKey="_id"
                columns={bookingColumns}
                dataSource={bookings}
                loading={bookingsStatus === 'loading'}
                pagination={{ pageSize: 6, hideOnSinglePage: true }}
                scroll={{ x: 900 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default AdminCarsPage;
