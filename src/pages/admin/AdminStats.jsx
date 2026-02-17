import { useBookings } from '../../context/BookingContext';
import Sidebar from '../../components/layout/Sidebar';
import { BarChart3 } from 'lucide-react';

export default function AdminStats() {
    const { bookings } = useBookings();

    const byStatus = {
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    const totalRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const depositCollected = bookings
        .filter(b => b.depositPaid)
        .reduce((sum, b) => sum + (b.deposit || 0), 0);

    const byEventType = {};
    bookings.forEach(b => {
        const type = b.eventType || 'อื่นๆ';
        byEventType[type] = (byEventType[type] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(byEventType), 1);

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <h1 className="page-title">สถิติ</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
                    ข้อมูลเชิงสถิติของระบบ
                </p>

                <div className="grid grid-2">
                    {/* Booking Status Chart */}
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-xl)' }}>สถานะการจอง</h3>
                        {[
                            { label: 'ยืนยันแล้ว', count: byStatus.confirmed, color: 'var(--success)', pct: (byStatus.confirmed / bookings.length * 100) || 0 },
                            { label: 'รอยืนยัน', count: byStatus.pending, color: 'var(--warning)', pct: (byStatus.pending / bookings.length * 100) || 0 },
                            { label: 'ยกเลิก', count: byStatus.cancelled, color: 'var(--danger)', pct: (byStatus.cancelled / bookings.length * 100) || 0 },
                        ].map(item => (
                            <div key={item.label} style={{ marginBottom: 'var(--space-lg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                                    <span style={{ fontSize: 'var(--font-size-sm)' }}>{item.label}</span>
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{item.count}</span>
                                </div>
                                <div style={{ height: 8, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${item.pct}%`, height: '100%', background: item.color,
                                        borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Revenue */}
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-xl)' }}>ข้อมูลการเงิน</h3>
                        {[
                            { label: 'รายได้รวม (ไม่รวมยกเลิก)', value: `฿${totalRevenue.toLocaleString()}`, color: 'var(--accent-primary)' },
                            { label: 'มัดจำที่เก็บได้', value: `฿${depositCollected.toLocaleString()}`, color: 'var(--success)' },
                            { label: 'ยอดค้างชำระ', value: `฿${(totalRevenue - depositCollected).toLocaleString()}`, color: 'var(--warning)' },
                        ].map(item => (
                            <div key={item.label} style={{
                                padding: 'var(--space-lg)', background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{item.label}</span>
                                <span style={{ fontWeight: 800, fontSize: 'var(--font-size-xl)', color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* By Event Type */}
                    <div className="card" style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                            <BarChart3 size={20} style={{ marginRight: 8 }} />
                            จำนวนจองตามประเภทงาน
                        </h3>
                        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-end', minHeight: 200, flexWrap: 'wrap' }}>
                            {Object.entries(byEventType).map(([type, count]) => (
                                <div key={type} style={{ flex: 1, minWidth: 80, textAlign: 'center' }}>
                                    <div style={{
                                        height: `${(count / maxCount) * 150}px`,
                                        background: 'var(--accent-gradient)',
                                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                                        paddingTop: 'var(--space-sm)', color: 'white', fontWeight: 700
                                    }}>
                                        {count}
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                                        {type}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
