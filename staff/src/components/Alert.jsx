import { forwardRef } from 'react';
import Icon from './Icon.jsx';

/* tone: 'error' | 'success' | 'info'. Errors are announced to screen readers immediately. */
const Alert = forwardRef(function Alert({ tone = 'info', children, className = '' }, ref) {
  return (
    <div
      ref={ref}
      tabIndex={ref ? -1 : undefined}
      className={`alert alert-${tone} ${className}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon name={tone === 'success' ? 'check' : 'info'} size={20} />
      <div>{children}</div>
    </div>
  );
});

export default Alert;
