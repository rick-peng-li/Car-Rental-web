import { Divider, Flex, Typography } from 'antd';
import { DRIVER_RATE_PER_HOUR } from '@/utils/constants';

const { Text } = Typography;

const Row = ({ label, value, strong }) => (
  <Flex justify="space-between" align="center">
    <Text type="secondary">{label}</Text>
    <Text strong={strong}>{value}</Text>
  </Flex>
);

const BookingSummary = ({ car, hours, driverRequired, totalAmount }) => {
  const baseAmount = hours * (car?.rentPerHour || 0);
  const driverFee = driverRequired ? hours * DRIVER_RATE_PER_HOUR : 0;

  return (
    <div className="booking-summary">
      <Row label="Rent per hour" value={`$${car?.rentPerHour ?? 0}`} />
      <Row label="Duration" value={`${hours} hour${hours === 1 ? '' : 's'}`} />
      <Row label="Car subtotal" value={`$${baseAmount}`} />
      <Row
        label={`Driver ($${DRIVER_RATE_PER_HOUR}/hr)`}
        value={driverRequired ? `$${driverFee}` : 'Not required'}
      />
      <Divider style={{ margin: '12px 0' }} />
      <Row label="Total" value={`$${totalAmount}`} strong />
    </div>
  );
};

export default BookingSummary;
