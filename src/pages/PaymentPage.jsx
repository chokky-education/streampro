import { useParams, Link } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { equipmentSets } from '../data/mockData';
import { CreditCard, Download, CheckCircle, QrCode } from 'lucide-react';

export default function PaymentPage() {
    const { bookingId } = useParams();
    const { bookings, confirmDeposit } = useBookings();

    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) {
        return (
            <div className="page container" style={{ textAlign: 'center' }}>
                <h1 className="page-title">ไม่พบรายการจอง</h1>
                <Link to="/my-bookings" className="btn btn-primary">กลับหน้าการจอง</Link>
            </div>
        );
    }

    const handleDownloadPDF = () => {
        // Simple PDF-like summary
        const content = `
===========================================
    สรุปค่าใช้จ่าย - StreamPro
===========================================

หมายเลขการจอง: ${booking.id}
วันที่: ${booking.date}
เวลา: ${booking.time} - ${booking.endTime}
ประเภทงาน: ${booking.eventType || '-'}
สถานที่: ${booking.location || '-'}

-------------------------------------------
รายการอุปกรณ์:
${booking.equipment.map(id => {
            const eq = equipmentSets.find(e => e.id === id);
            return `  - ${eq?.name}: ฿${eq?.price.toLocaleString()}`;
        }).join('\n')}

-------------------------------------------
รวมทั้งสิ้น: ฿${booking.totalPrice?.toLocaleString()}
มัดจำ (30%): ฿${booking.deposit?.toLocaleString()}
สถานะมัดจำ: ${booking.depositPaid ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
===========================================
    `;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${booking.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="page container">
            <h1 className="page-title">ชำระเงิน</h1>
            <p className="page-subtitle">หมายเลขการจอง: {booking.id}</p>

            <div className="payment-layout">
                {/* QR Code */}
                <div className="card qr-container">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-sm)' }}>สแกน QR Code เพื่อชำระเงิน</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        วางมัดจำ ฿{booking.deposit?.toLocaleString()}
                    </p>
                    <div className="qr-code">
                        <QrCode size={120} />
                        <span style={{ fontSize: 'var(--font-size-xs)' }}>PromptPay QR Code</span>
                        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800 }}>
                            ฿{booking.deposit?.toLocaleString()}
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-lg)' }}>
                        หรือโอนเงินเข้าบัญชี: ธ.กสิกรไทย 123-4-56789-0<br />
                        ชื่อบัญชี: บจก.สตรีมโปร
                    </p>

                    {booking.depositPaid ? (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: 'var(--space-sm)', color: 'var(--success)', fontWeight: 700,
                            padding: 'var(--space-md)', background: 'var(--success-bg)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <CheckCircle size={20} /> ชำระมัดจำเรียบร้อยแล้ว
                        </div>
                    ) : (
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            onClick={() => confirmDeposit(booking.id)}
                        >
                            <CreditCard size={18} /> แจ้งชำระเงินแล้ว
                        </button>
                    )}
                </div>

                {/* Expense Summary */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-lg)' }}>สรุปค่าใช้จ่าย</h3>

                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>รายการ</th>
                                <th style={{ textAlign: 'right' }}>ราคา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booking.equipment.map(id => {
                                const eq = equipmentSets.find(e => e.id === id);
                                return eq ? (
                                    <tr key={id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{eq.emoji} {eq.name}</div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{eq.type}</div>
                                        </td>
                                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                            ฿{eq.price.toLocaleString()}
                                        </td>
                                    </tr>
                                ) : null;
                            })}
                        </tbody>
                    </table>

                    <div style={{
                        marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)',
                        borderTop: '2px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>ราคารวม</span>
                            <span style={{ fontWeight: 700 }}>฿{booking.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>มัดจำ (30%)</span>
                            <span style={{ fontWeight: 700, color: 'var(--warning)' }}>฿{booking.deposit?.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>ยอดคงเหลือ</span>
                            <span className="expense-total">฿{(booking.totalPrice - booking.deposit)?.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: 'var(--space-xl)' }}
                        onClick={handleDownloadPDF}
                    >
                        <Download size={16} /> ดาวน์โหลดสรุปค่าใช้จ่าย
                    </button>
                </div>
            </div>
        </div>
    );
}
