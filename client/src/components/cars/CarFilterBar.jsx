import { Button, Flex, Select, Typography } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import DateRangeFields from '@/components/cars/DateRangeFields';

const FUEL_OPTIONS = [
  { value: 'all', label: 'All fuel types' },
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
];

/**
 * Availability + fuel filter displayed above the car grid.
 */
const CarFilterBar = ({
  from,
  to,
  onFromChange,
  onToChange,
  fuelType,
  onFuelTypeChange,
  onReset,
}) => (
  <div className="filter-bar">
    <Flex wrap gap={16} align="flex-end" justify="space-between">
      <DateRangeFields
        from={from}
        to={to}
        onFromChange={onFromChange}
        onToChange={onToChange}
      />

      <Flex vertical gap={4} style={{ minWidth: 170 }}>
        <Typography.Text type="secondary">Fuel type</Typography.Text>
        <Select
          value={fuelType}
          onChange={onFuelTypeChange}
          options={FUEL_OPTIONS}
          size="large"
        />
      </Flex>

      <Button size="large" icon={<ClearOutlined />} onClick={onReset}>
        Reset
      </Button>
    </Flex>
  </div>
);

export default CarFilterBar;
