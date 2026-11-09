import { Empty, List, Modal, Tag } from 'antd';

const BookedSlotsModal = ({ open, slots = [], onClose }) => (
  <Modal
    title="Booked time slots"
    open={open}
    onCancel={onClose}
    footer={null}
    destroyOnHidden
  >
    {slots.length === 0 ? (
      <Empty description="This car has no bookings yet" />
    ) : (
      <List
        dataSource={slots}
        renderItem={(slot, index) => (
          <List.Item>
            <Tag color="volcano">#{index + 1}</Tag>
            {slot.from} → {slot.to}
          </List.Item>
        )}
      />
    )}
  </Modal>
);

export default BookedSlotsModal;
