import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useNavigate, Link } from 'react-router-dom';
import { equipmentSets } from '../data/mockData';
import { CalendarDays, Clock, MapPin, Package, XCircle, CreditCard, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';

const statusMap = {
    pending: { label: 'รอยืนยัน', class: 'badge-warning' },
    confirmed: { label: 'ยืนยันแล้ว', class: 'badge-success' },
    cancelled: { label: 'ยกเลิก', class: 'badge-danger' },
    completed: { label: 'เสร็จสิ้น', class: 'badge-info' }
};

export default function MyBookingsPage() {
    const { user } = useAuth();
    const { getUserBookings, cancelBooking } = useBookings();
    const navigate = useNavigate();
    const [cancelId, setCancelId] = useState(null);

    if (!user) {
        navigate('/login');
        return null;
    }

    const bookings = getUserBookings(user.id);

    const handleCancel = () => {
        cancelBooking(cancelId);
        setCancelId(null);
    };

    return (
        <div className="page container">
            <h1 className="page-title">การจองของฉัน</h1>
            <p className="page-subtitle">ดูและจัดการรายการจองทั้งหมดของคุณ</p>

            {bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <CalendarDays size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-lg)' }} />
                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>ยังไม่มีการจอง</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                        คุณยังไม่ได้ทำการจอง เริ่มต้นจองบริการได้เลย!
                    </p>
                    <Link to="/booking" className="btn btn-primary">จองบริการ</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {bookings.map(booking => {
                        const status = statusMap[booking.status] || statusMap.pending;
                        return (
                            <div key={booking.id} className="card animate-fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                                    <div>
                                        <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)' }}>{booking.id}</span>
                                        <span className={`badge ${status.class}`} style={{ marginLeft: 'var(--space-md)' }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                                        สร้างเมื่อ: {booking.createdAt}
                                    </span>
                                </div>

                                <div className="grid grid-2" style={{ gap: 'var(--space-md)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                        <CalendarDays size={16} /> {booking.date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                        <Clock size={16} /> {booking.time} - {booking.endTime}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                        <MapPin size={16} /> {booking.location || '-'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                        <Package size={16} /> {booking.eventType || '-'}
                                    </div>
                                </div>

                                <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>อุปกรณ์:</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                        {booking.equipment.map(id => {
                                            const eq = equipmentSets.find(e => e.id === id);
                                            return eq ? (
                                                <span key={id} className="badge badge-info">{eq.emoji} {eq.name}</span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                <div style={{
                                    marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>ราคารวม: </span>
                                        <span style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)', color: 'var(--accent-primary)' }}>
                                            ฿{booking.totalPrice?.toLocaleString()}
                                        </span>
                                        <span style={{ marginLeft: 'var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
                                            {booking.depositPaid ? (
                                                <span className="badge badge-success">ชำระมัดจำแล้ว</span>
                                            ) : (
                                                <span className="badge badge-warning">รอชำระมัดจำ</span>
                                            )}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        {!booking.depositPaid && booking.status !== 'cancelled' && (
                                            <Link to={`/payment/${booking.id}`} className="btn btn-primary btn-sm">
                                                <CreditCard size={14} /> ชำระเงิน
                                            </Link>
                                        )}
                                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                            <button className="btn btn-danger btn-sm" onClick={() => setCancelId(booking.id)}>
                                                <XCircle size={14} /> ยกเลิก
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="ยืนยันการยกเลิก">
                <div style={{ textAlign: 'center' }}>
                    <AlertCircle size={48} color="var(--warning)" style={{ marginBottom: 'var(--space-lg)' }} />
                    <p style={{ marginBottom: 'var(--space-lg)' }}>คุณต้องการยกเลิกการจอง <strong>{cancelId}</strong> ใช่หรือไม่?</p>
                    <div className="modal-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-secondary" onClick={() => setCancelId(null)}>ไม่ใช่</button>
                        <button className="btn btn-danger" onClick={handleCancel}>ยกเลิกการจอง</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
