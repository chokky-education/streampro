import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { equipmentSets, timeSlots } from '../data/mockData';
import { ChevronLeft, ChevronRight, CalendarDays, Clock, Package, MapPin, FileText } from 'lucide-react';

export default function BookingPage() {
    const { user } = useAuth();
    const { addBooking } = useBookings();
    const navigate = useNavigate();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [eventType, setEventType] = useState('');
    const [location, setLocation] = useState('');
    const [step, setStep] = useState(1);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDays = new Date(year, month, 0).getDate();
        const result = [];

        for (let i = firstDay - 1; i >= 0; i--) {
            result.push({ day: prevDays - i, otherMonth: true });
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            result.push({ day: i, otherMonth: false, past: date < today, date });
        }
        const remaining = 42 - result.length;
        for (let i = 1; i <= remaining; i++) {
            result.push({ day: i, otherMonth: true });
        }
        return result;
    }, [year, month]);

    const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    const totalPrice = selectedEquipment.reduce((sum, id) => {
        const eq = equipmentSets.find(e => e.id === id);
        return sum + (eq?.price || 0);
    }, 0);

    const deposit = Math.ceil(totalPrice * 0.3);

    const isToday = (dayObj) => {
        if (!dayObj.date) return false;
        const today = new Date();
        return dayObj.date.toDateString() === today.toDateString();
    };

    const isSelected = (dayObj) => {
        if (!dayObj.date || !selectedDate) return false;
        return dayObj.date.toDateString() === selectedDate.toDateString();
    };

    const handleConfirmBooking = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const booking = addBooking({
            userId: user.id,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            endTime: selectedEndTime,
            equipment: selectedEquipment,
            totalPrice,
            deposit,
            customerName: user.name,
            customerPhone: user.phone || '',
            eventType,
            location
        });
        navigate('/my-bookings');
    };

    return (
        <div className="page container">
            <h1 className="page-title">จองบริการ</h1>
            <p className="page-subtitle">เลือกวัน เวลา และชุดอุปกรณ์ที่ต้องการ</p>

            {/* Progress steps */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
                {['เลือกวันที่', 'เลือกอุปกรณ์', 'รายละเอียด', 'ยืนยัน'].map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-full)',
                            background: step > i ? 'var(--accent-gradient)' : step === i + 1 ? 'var(--accent-primary)' : 'var(--bg-card)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto var(--space-sm)', color: 'white', fontWeight: 700,
                            fontSize: 'var(--font-size-sm)', border: step === i + 1 ? 'none' : '1px solid var(--border)'
                        }}>
                            {i + 1}
                        </div>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {s}
                        </span>
                    </div>
                ))}
            </div>

            <div className="booking-layout">
                <div>
                    {/* Step 1: Calendar */}
                    {step === 1 && (
                        <div className="calendar animate-fade-in">
                            <div className="calendar-header">
                                <button className="btn btn-icon" onClick={() => setCurrentMonth(new Date(year, month - 1))}>
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="calendar-title">{monthNames[month]} {year + 543}</span>
                                <button className="btn btn-icon" onClick={() => setCurrentMonth(new Date(year, month + 1))}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                            <div className="calendar-grid">
                                {dayNames.map(d => (
                                    <div key={d} className="calendar-day-header">{d}</div>
                                ))}
                                {days.map((dayObj, i) => (
                                    <div
                                        key={i}
                                        className={`calendar-day ${dayObj.otherMonth ? 'other-month' : ''} ${dayObj.past ? 'disabled' : ''} ${isToday(dayObj) ? 'today' : ''} ${isSelected(dayObj) ? 'selected' : ''}`}
                                        onClick={() => !dayObj.otherMonth && !dayObj.past && setSelectedDate(dayObj.date)}
                                    >
                                        {dayObj.day}
                                    </div>
                                ))}
                            </div>

                            {selectedDate && (
                                <div style={{ padding: 'var(--space-lg)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-base)' }}>
                                        <Clock size={16} style={{ marginRight: 4 }} />
                                        เลือกเวลาเริ่ม - สิ้นสุด
                                    </h3>
                                    <div className="time-slots" style={{ marginBottom: 'var(--space-md)' }}>
                                        {timeSlots.map(time => (
                                            <div
                                                key={time}
                                                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                                onClick={() => { setSelectedTime(time); if (!selectedEndTime) setSelectedEndTime(timeSlots[Math.min(timeSlots.indexOf(time) + 4, timeSlots.length - 1)]); }}
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                    {selectedTime && (
                                        <>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                                                เวลาสิ้นสุด:
                                            </p>
                                            <div className="time-slots">
                                                {timeSlots.filter(t => t > selectedTime).map(time => (
                                                    <div
                                                        key={time}
                                                        className={`time-slot ${selectedEndTime === time ? 'selected' : ''}`}
                                                        onClick={() => setSelectedEndTime(time)}
                                                    >
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Equipment */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                                <Package size={20} style={{ marginRight: 8 }} />
                                เลือกชุดอุปกรณ์
                            </h3>
                            <div className="grid grid-2">
                                {equipmentSets.map(eq => (
                                    <div
                                        key={eq.id}
                                        className="card equipment-card"
                                        style={{
                                            cursor: eq.available ? 'pointer' : 'not-allowed',
                                            opacity: eq.available ? 1 : 0.5,
                                            borderColor: selectedEquipment.includes(eq.id) ? 'var(--accent-primary)' : undefined,
                                            background: selectedEquipment.includes(eq.id) ? 'rgba(124, 58, 237, 0.1)' : undefined
                                        }}
                                        onClick={() => {
                                            if (!eq.available) return;
                                            setSelectedEquipment(prev =>
                                                prev.includes(eq.id) ? prev.filter(id => id !== eq.id) : [...prev, eq.id]
                                            );
                                        }}
                                    >
                                        <div className="equipment-img">{eq.emoji}</div>
                                        <div className="equipment-name">{eq.name}</div>
                                        <div className="equipment-type">{eq.type}</div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                                            {eq.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--accent-primary)' }}>
                                                ฿{eq.price.toLocaleString()}
                                            </span>
                                            <div className="equipment-status">
                                                <span className={`equipment-status-dot ${eq.available ? 'available' : 'unavailable'}`} />
                                                {eq.available ? 'ว่าง' : 'ไม่ว่าง'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <div className="card animate-fade-in">
                            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                                <FileText size={20} style={{ marginRight: 8 }} />
                                รายละเอียดงาน
                            </h3>
                            <div className="form-group">
                                <label className="form-label">ประเภทงาน</label>
                                <select className="form-input" value={eventType} onChange={e => setEventType(e.target.value)}>
                                    <option value="">เลือกประเภทงาน</option>
                                    <option value="งานบวช">งานบวช</option>
                                    <option value="งานแต่งงาน">งานแต่งงาน</option>
                                    <option value="งานสัมมนา">งานสัมมนา</option>
                                    <option value="งานคอนเสิร์ต">งานคอนเสิร์ต</option>
                                    <option value="งานกีฬา">งานกีฬา</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">สถานที่จัดงาน</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ paddingLeft: 38 }}
                                        placeholder="ระบุสถานที่จัดงาน"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirm */}
                    {step === 4 && (
                        <div className="card animate-fade-in">
                            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                                ยืนยันการจอง
                            </h3>
                            <div style={{ lineHeight: 2.2 }}>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>วันที่</span>
                                    <strong>{selectedDate?.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                </div>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>เวลา</span>
                                    <strong>{selectedTime} - {selectedEndTime}</strong>
                                </div>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>ประเภทงาน</span>
                                    <strong>{eventType || '-'}</strong>
                                </div>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>สถานที่</span>
                                    <strong>{location || '-'}</strong>
                                </div>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>อุปกรณ์</span>
                                    <div style={{ textAlign: 'right' }}>
                                        {selectedEquipment.map(id => {
                                            const eq = equipmentSets.find(e => e.id === id);
                                            return <div key={id}>{eq?.name} - ฿{eq?.price.toLocaleString()}</div>;
                                        })}
                                    </div>
                                </div>
                                <div className="booking-item" style={{ borderBottom: 'none' }}>
                                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>รวมทั้งสิ้น</span>
                                    <span className="expense-total">฿{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="booking-item" style={{ borderBottom: 'none' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>มัดจำ (30%)</span>
                                    <strong style={{ color: 'var(--warning)' }}>฿{deposit.toLocaleString()}</strong>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-lg)' }} onClick={handleConfirmBooking}>
                                ยืนยันการจอง
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar Summary */}
                <div className="booking-summary">
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-lg)' }}>สรุปการจอง</h3>
                        <div className="booking-item">
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                <CalendarDays size={14} style={{ marginRight: 4 }} /> วันที่
                            </span>
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                {selectedDate ? selectedDate.toLocaleDateString('th-TH') : '-'}
                            </span>
                        </div>
                        <div className="booking-item">
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                <Clock size={14} style={{ marginRight: 4 }} /> เวลา
                            </span>
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                {selectedTime ? `${selectedTime} - ${selectedEndTime || '..'}` : '-'}
                            </span>
                        </div>
                        <div className="booking-item">
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                <Package size={14} style={{ marginRight: 4 }} /> อุปกรณ์
                            </span>
                            <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                {selectedEquipment.length} รายการ
                            </span>
                        </div>
                        <div style={{
                            marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)',
                            borderTop: '1px solid var(--border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: 700 }}>รวม</span>
                            <span className="expense-total">฿{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                        {step > 1 && (
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>
                                ย้อนกลับ
                            </button>
                        )}
                        {step < 4 && (
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={
                                    (step === 1 && (!selectedDate || !selectedTime)) ||
                                    (step === 2 && selectedEquipment.length === 0)
                                }
                                onClick={() => setStep(s => s + 1)}
                            >
                                ถัดไป
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
