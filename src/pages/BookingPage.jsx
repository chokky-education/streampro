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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [hoverDate, setHoverDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [selectedEquipment, setSelectedEquipment] = useState([]);
    const [eventType, setEventType] = useState('');
    const [location, setLocation] = useState('');
    const [step, setStep] = useState(1);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Calculate number of days selected
    const numDays = useMemo(() => {
        if (!startDate) return 0;
        if (!endDate) return 1;
        const diffTime = Math.abs(endDate - startDate);
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }, [startDate, endDate]);

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

    // Price for equipment per day × number of days
    const pricePerDay = selectedEquipment.reduce((sum, id) => {
        const eq = equipmentSets.find(e => e.id === id);
        return sum + (eq?.price || 0);
    }, 0);

    const totalPrice = pricePerDay * (numDays || 1);
    const deposit = Math.ceil(totalPrice * 0.3);

    const isToday = (dayObj) => {
        if (!dayObj.date) return false;
        const today = new Date();
        return dayObj.date.toDateString() === today.toDateString();
    };

    // Check if a date is the start or end of the range
    const isStart = (dayObj) => {
        if (!dayObj.date || !startDate) return false;
        return dayObj.date.toDateString() === startDate.toDateString();
    };

    const isEnd = (dayObj) => {
        if (!dayObj.date || !endDate) return false;
        return dayObj.date.toDateString() === endDate.toDateString();
    };

    // Check if a date is in the selected range
    const isInRange = (dayObj) => {
        if (!dayObj.date || !startDate) return false;
        const rangeEnd = endDate || hoverDate;
        if (!rangeEnd) return false;
        const min = startDate < rangeEnd ? startDate : rangeEnd;
        const max = startDate < rangeEnd ? rangeEnd : startDate;
        return dayObj.date >= min && dayObj.date <= max;
    };

    // Handle date click for range selection
    const handleDateClick = (dayObj) => {
        if (dayObj.otherMonth || dayObj.past) return;

        if (!startDate || (startDate && endDate)) {
            // First click or reset: set start date
            setStartDate(dayObj.date);
            setEndDate(null);
        } else {
            // Second click: set end date
            if (dayObj.date < startDate) {
                setEndDate(startDate);
                setStartDate(dayObj.date);
            } else {
                setEndDate(dayObj.date);
            }
        }
    };

    // Format date range for display
    const formatDateRange = () => {
        if (!startDate) return '-';
        const opts = { year: 'numeric', month: 'long', day: 'numeric' };
        const start = startDate.toLocaleDateString('th-TH', opts);
        if (!endDate || startDate.toDateString() === endDate.toDateString()) return start;
        const end = endDate.toLocaleDateString('th-TH', opts);
        return `${start} — ${end}`;
    };

    const formatDateShort = () => {
        if (!startDate) return '-';
        const s = startDate.toLocaleDateString('th-TH');
        if (!endDate || startDate.toDateString() === endDate.toDateString()) return s;
        return `${s} - ${endDate.toLocaleDateString('th-TH')}`;
    };

    // Get all dates in range as ISO strings
    const getDateList = () => {
        if (!startDate) return [];
        const dates = [];
        const end = endDate || startDate;
        const d = new Date(startDate);
        while (d <= end) {
            dates.push(new Date(d).toISOString().split('T')[0]);
            d.setDate(d.getDate() + 1);
        }
        return dates;
    };

    const handleConfirmBooking = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        const booking = addBooking({
            userId: user.id,
            date: startDate.toISOString().split('T')[0],
            endDate: endDate ? endDate.toISOString().split('T')[0] : startDate.toISOString().split('T')[0],
            dates: getDateList(),
            numDays,
            time: selectedTime,
            endTime: selectedEndTime,
            equipment: selectedEquipment,
            totalPrice,
            pricePerDay,
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
                    {/* Step 1: Calendar with date range */}
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

                            {/* Instruction hint */}
                            <div style={{
                                textAlign: 'center', padding: 'var(--space-sm) var(--space-lg)',
                                fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)',
                                background: 'rgba(124,58,237,0.06)', borderRadius: 'var(--radius-md)',
                                margin: '0 var(--space-lg) var(--space-sm)'
                            }}>
                                💡 คลิกวันแรก แล้วคลิกวันสุดท้าย เพื่อจองหลายวัน
                            </div>

                            <div className="calendar-grid">
                                {dayNames.map(d => (
                                    <div key={d} className="calendar-day-header">{d}</div>
                                ))}
                                {days.map((dayObj, i) => {
                                    const start = isStart(dayObj);
                                    const end = isEnd(dayObj);
                                    const inRange = isInRange(dayObj);
                                    return (
                                        <div
                                            key={i}
                                            className={[
                                                'calendar-day',
                                                dayObj.otherMonth ? 'other-month' : '',
                                                dayObj.past ? 'disabled' : '',
                                                isToday(dayObj) ? 'today' : '',
                                                start ? 'range-start' : '',
                                                end ? 'range-end' : '',
                                                (start || end) ? 'selected' : '',
                                                inRange && !start && !end ? 'in-range' : ''
                                            ].filter(Boolean).join(' ')}
                                            onClick={() => handleDateClick(dayObj)}
                                            onMouseEnter={() => {
                                                if (startDate && !endDate && dayObj.date && !dayObj.otherMonth && !dayObj.past) {
                                                    setHoverDate(dayObj.date);
                                                }
                                            }}
                                            onMouseLeave={() => setHoverDate(null)}
                                        >
                                            {dayObj.day}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Selected range info */}
                            {startDate && (
                                <div style={{
                                    padding: 'var(--space-md) var(--space-lg)', margin: 'var(--space-sm) var(--space-lg)',
                                    background: 'rgba(124,58,237,0.1)', borderRadius: 'var(--radius-md)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)'
                                }}>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                            {endDate && startDate.toDateString() !== endDate.toDateString() ? 'ช่วงวันที่เลือก' : 'วันที่เลือก'}
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>
                                            {formatDateRange()}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: 'var(--accent-gradient)', color: 'white',
                                        padding: 'var(--space-xs) var(--space-md)', borderRadius: 'var(--radius-full)',
                                        fontWeight: 800, fontSize: 'var(--font-size-lg)', minWidth: 60, textAlign: 'center'
                                    }}>
                                        {numDays} วัน
                                    </div>
                                </div>
                            )}

                            {startDate && (
                                <div style={{ padding: 'var(--space-lg)' }}>
                                    <h3 style={{ marginBottom: 'var(--space-md)', fontSize: 'var(--font-size-base)' }}>
                                        <Clock size={16} style={{ marginRight: 4 }} />
                                        เลือกเวลาเริ่ม - สิ้นสุด (ทุกวัน)
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
                            {numDays > 1 && (
                                <div style={{
                                    padding: 'var(--space-md)', marginBottom: 'var(--space-lg)',
                                    background: 'rgba(6,182,212,0.1)', borderRadius: 'var(--radius-md)',
                                    fontSize: 'var(--font-size-sm)', color: 'var(--accent-secondary)',
                                    display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
                                }}>
                                    <CalendarDays size={16} />
                                    ราคาอุปกรณ์จะคำนวณ × {numDays} วัน อัตโนมัติ
                                </div>
                            )}
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
                                            <div>
                                                <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--accent-primary)' }}>
                                                    ฿{eq.price.toLocaleString()}
                                                </span>
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>/วัน</span>
                                            </div>
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
                                    <strong>{formatDateRange()}</strong>
                                </div>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>จำนวนวัน</span>
                                    <strong style={{ color: 'var(--accent-primary)' }}>{numDays} วัน</strong>
                                </div>
                                <div className="booking-item">
                                    <span style={{ color: 'var(--text-secondary)' }}>เวลา</span>
                                    <strong>{selectedTime} - {selectedEndTime} (ทุกวัน)</strong>
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
                                            return <div key={id}>{eq?.name} - ฿{eq?.price.toLocaleString()}/วัน</div>;
                                        })}
                                    </div>
                                </div>

                                {numDays > 1 && (
                                    <div className="booking-item">
                                        <span style={{ color: 'var(--text-secondary)' }}>ราคาต่อวัน</span>
                                        <strong>฿{pricePerDay.toLocaleString()}</strong>
                                    </div>
                                )}

                                <div className="booking-item" style={{ borderBottom: 'none' }}>
                                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                                        รวมทั้งสิ้น {numDays > 1 ? `(${numDays} วัน)` : ''}
                                    </span>
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
                                {formatDateShort()}
                            </span>
                        </div>
                        <div className="booking-item">
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                📅 จำนวนวัน
                            </span>
                            <span style={{
                                fontSize: 'var(--font-size-sm)', fontWeight: 700,
                                color: numDays > 1 ? 'var(--accent-primary)' : 'var(--text-primary)'
                            }}>
                                {numDays || '-'} วัน
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
                        {numDays > 1 && (
                            <div className="booking-item">
                                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    ราคา/วัน
                                </span>
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                    ฿{pricePerDay.toLocaleString()}
                                </span>
                            </div>
                        )}
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
                                    (step === 1 && (!startDate || !selectedTime)) ||
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
