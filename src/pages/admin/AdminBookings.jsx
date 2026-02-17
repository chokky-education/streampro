import { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { equipmentSets } from '../../data/mockData';
import Sidebar from '../../components/layout/Sidebar';
import Modal from '../../components/ui/Modal';
import { Search, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';

const statusMap = {
    pending: { label: 'รอยืนยัน', class: 'badge-warning' },
    confirmed: { label: 'ยืนยันแล้ว', class: 'badge-success' },
    cancelled: { label: 'ยกเลิก', class: 'badge-danger' },
    completed: { label: 'เสร็จสิ้น', class: 'badge-info' }
};

export default function AdminBookings() {
    const { bookings, confirmBooking, cancelBooking } = useBookings();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { id, action }

    const filtered = bookings.filter(b => {
        const matchSearch = !search ||
            b.id.toLowerCase().includes(search.toLowerCase()) ||
            b.customerName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleAction = () => {
        if (confirmAction.action === 'confirm') {
            confirmBooking(confirmAction.id);
        } else if (confirmAction.action === 'cancel') {
            cancelBooking(confirmAction.id);
        }
        setConfirmAction(null);
    };

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <h1 className="page-title">จัดการการจอง</h1>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: 38 }}
                            placeholder="ค้นหารหัสจอง หรือชื่อลูกค้า..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {Object.entries({ all: 'ทั้งหมด', ...Object.fromEntries(Object.entries(statusMap).map(([k, v]) => [k, v.label])) }).map(([key, label]) => (
                        <button
                            key={key}
                            className={`btn ${statusFilter === key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                            onClick={() => setStatusFilter(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>รหัส</th>
                                <th>ลูกค้า</th>
                                <th>วันที่</th>
                                <th>เวลา</th>
                                <th>ประเภท</th>
                                <th>สถานะ</th>
                                <th>มัดจำ</th>
                                <th>ราคา</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => {
                                const status = statusMap[b.status] || statusMap.pending;
                                return (
                                    <tr key={b.id}>
                                        <td style={{ fontWeight: 700 }}>{b.id}</td>
                                        <td>{b.customerName}</td>
                                        <td>{b.date}</td>
                                        <td>{b.time}-{b.endTime}</td>
                                        <td>{b.eventType || '-'}</td>
                                        <td><span className={`badge ${status.class}`}>{status.label}</span></td>
                                        <td>
                                            {b.depositPaid ? (
                                                <span className="badge badge-success">ชำระแล้ว</span>
                                            ) : (
                                                <span className="badge badge-warning">รอชำระ</span>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 700 }}>฿{b.totalPrice?.toLocaleString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button className="btn btn-icon" title="รายละเอียด" onClick={() => setSelectedBooking(b)}>
                                                    <Eye size={16} />
                                                </button>
                                                {b.status === 'pending' && (
                                                    <>
                                                        <button className="btn btn-icon" title="ยืนยัน" style={{ color: 'var(--success)' }}
                                                            onClick={() => setConfirmAction({ id: b.id, action: 'confirm' })}>
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button className="btn btn-icon" title="ยกเลิก" style={{ color: 'var(--danger)' }}
                                                            onClick={() => setConfirmAction({ id: b.id, action: 'cancel' })}>
                                                            <XCircle size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Detail Modal */}
                <Modal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} title={`รายละเอียดการจอง ${selectedBooking?.id}`}>
                    {selectedBooking && (
                        <div style={{ lineHeight: 2 }}>
                            {[
                                ['ลูกค้า', selectedBooking.customerName],
                                ['โทรศัพท์', selectedBooking.customerPhone],
                                ['วันที่', selectedBooking.date],
                                ['เวลา', `${selectedBooking.time} - ${selectedBooking.endTime}`],
                                ['ประเภทงาน', selectedBooking.eventType],
                                ['สถานที่', selectedBooking.location],
                                ['ราคารวม', `฿${selectedBooking.totalPrice?.toLocaleString()}`],
                                ['มัดจำ', `฿${selectedBooking.deposit?.toLocaleString()}`],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '4px 0' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{label}</span>
                                    <strong style={{ fontSize: 'var(--font-size-sm)' }}>{value || '-'}</strong>
                                </div>
                            ))}
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>อุปกรณ์:</p>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                                {selectedBooking.equipment.map(id => {
                                    const eq = equipmentSets.find(e => e.id === id);
                                    return eq ? <span key={id} className="badge badge-info">{eq.emoji} {eq.name}</span> : null;
                                })}
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Confirm Action Modal */}
                <Modal isOpen={!!confirmAction} onClose={() => setConfirmAction(null)}
                    title={confirmAction?.action === 'confirm' ? 'ยืนยันการจอง' : 'ยกเลิกการจอง'}>
                    <div style={{ textAlign: 'center' }}>
                        <AlertCircle size={48} color={confirmAction?.action === 'confirm' ? 'var(--success)' : 'var(--warning)'} style={{ marginBottom: 'var(--space-lg)' }} />
                        <p style={{ marginBottom: 'var(--space-lg)' }}>
                            คุณต้องการ{confirmAction?.action === 'confirm' ? 'ยืนยัน' : 'ยกเลิก'}การจอง <strong>{confirmAction?.id}</strong> ใช่หรือไม่?
                        </p>
                        <div className="modal-actions" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => setConfirmAction(null)}>ไม่ใช่</button>
                            <button className={`btn ${confirmAction?.action === 'confirm' ? 'btn-success' : 'btn-danger'}`} onClick={handleAction}>
                                {confirmAction?.action === 'confirm' ? 'ยืนยัน' : 'ยกเลิก'}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
