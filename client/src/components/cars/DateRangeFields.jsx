import { DatePicker, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/utils/constants';

const { Text } = Typography;

/**
 * Pick-up / return date pair used by the home filter and the booking page.
 */
const DateRangeFields = ({ from, to, onFromChange, onToChange, stacked = false }) => (
  <Flex gap={12} vertical={stacked} wrap>
    <Flex vertical gap={4} style={{ flex: 1, minWidth: 200 }}>
      <Text type="secondary">Pick-up</Text>
      <DatePicker
        showTime={{ format: 'HH:mm' }}
        format={DATE_FORMAT}
        value={from}
        onChange={onFromChange}
        size="large"
        style={{ width: '100%' }}
        disabledDate={(current) => current && current < dayjs().startOf('day')}
      />
    </Flex>

    <Flex vertical gap={4} style={{ flex: 1, minWidth: 200 }}>
      <Text type="secondary">Return</Text>
      <DatePicker
        showTime={{ format: 'HH:mm' }}
        format={DATE_FORMAT}
        value={to}
        onChange={onToChange}
        size="large"
        style={{ width: '100%' }}
        disabledDate={(current) =>
          current && current < (from || dayjs()).startOf('day')
        }
      />
    </Flex>
  </Flex>
);

export default DateRangeFields;
