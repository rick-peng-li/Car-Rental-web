import { Link } from 'react-router-dom';
import { Button, Result } from 'antd';

const NotFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you are looking for does not exist."
    extra={
      <Link to="/">
        <Button type="primary">Back home</Button>
      </Link>
    }
  />
);

export default NotFoundPage;
