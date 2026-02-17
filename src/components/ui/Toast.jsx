import { useBookings } from '../../context/BookingContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
    success: <CheckCircle size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#ef4444" />,
    info: <Info size={18} color="#3b82f6" />,
    warning: <AlertTriangle size={18} color="#f59e0b" />
};

export default function ToastContainer() {
    const { toasts } = useBookings();

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    {icons[toast.type] || icons.info}
                    <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
