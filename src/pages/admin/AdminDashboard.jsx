import { useBookings } from '../../context/BookingContext';
import { equipmentSets } from '../../data/mockData';
import Sidebar from '../../components/layout/Sidebar';
import { CalendarDays, Users, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
    const { bookings } = useBookings();

    const stats = [
        {
            label: 'การจองทั้งหมด', value: bookings.length,
            icon: <CalendarDays size={24} />,
            bg: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))',
            color: '#7c3aed'
        },
        {
            label: 'รอยืนยัน', value: bookings.filter(b => b.status === 'pending').length,
            icon: <Clock size={24} />,
            bg: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
            color: '#f59e0b'
        },
        {
            label: 'ยืนยันแล้ว', value: bookings.filter(b => b.status === 'confirmed').length,
            icon: <CheckCircle size={24} />,
            bg: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
            color: '#10b981'
        },
        {
            label: 'รายได้รวม',
            value: '฿' + bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString(),
            icon: <TrendingUp size={24} />,
            bg: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
            color: '#06b6d4'
        },
    ];

    const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <h1 className="page-title">แดชบอร์ด</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
                    ภาพรวมระบบบริหารจัดการการถ่ายทอดสด
                </p>

                <div className="admin-stats">
                    {stats.map((stat, i) => (
                        <div key={i} className="card admin-stat-card">
                            <div className="admin-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div className="admin-stat-value">{stat.value}</div>
                                <div className="admin-stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent bookings */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-lg)' }}>การจองล่าสุด</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>รหัส</th>
                                <th>ลูกค้า</th>
                                <th>วันที่</th>
                                <th>ประเภทงาน</th>
                                <th>สถานะ</th>
                                <th>ราคา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentBookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{ fontWeight: 700 }}>{b.id}</td>
                                    <td>{b.customerName}</td>
                                    <td>{b.date}</td>
                                    <td>{b.eventType || '-'}</td>
                                    <td>
                                        <span className={`badge ${b.status === 'confirmed' ? 'badge-success' :
                                                b.status === 'pending' ? 'badge-warning' :
                                                    b.status === 'cancelled' ? 'badge-danger' : 'badge-info'
                                            }`}>
                                            {b.status === 'confirmed' ? 'ยืนยัน' :
                                                b.status === 'pending' ? 'รอยืนยัน' :
                                                    b.status === 'cancelled' ? 'ยกเลิก' : b.status}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>฿{b.totalPrice?.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
