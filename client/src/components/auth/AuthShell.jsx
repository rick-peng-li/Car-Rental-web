import { Link } from 'react-router-dom';
import { CarOutlined } from '@ant-design/icons';

/**
 * Split screen shell used by the login and register pages.
 */
const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="auth-page">
    <div className="auth-page__visual">
      <Link to="/" className="auth-page__brand">
        <CarOutlined /> Car Rental
      </Link>
      <div className="auth-page__copy">
        <h1>Drive anywhere, anytime.</h1>
        <p>
          Hand-picked cars, transparent hourly pricing and instant confirmation —
          everything you need to hit the road.
        </p>
        <ul className="auth-page__points">
          <li>Free cancellation</li>
          <li>Unlimited mileage</li>
          <li>24/7 roadside support</li>
        </ul>
      </div>
    </div>

    <div className="auth-page__panel">
      <div className="auth-card">
        <h2>{title}</h2>
        <p className="auth-card__subtitle">{subtitle}</p>
        {children}
        <div className="auth-card__footer">{footer}</div>
      </div>
    </div>
  </div>
);

export default AuthShell;
