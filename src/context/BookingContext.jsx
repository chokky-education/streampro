import { createContext, useContext, useState, useEffect } from 'react';
import { sampleBookings } from '../data/mockData';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('streamingApp_bookings');
        return saved ? JSON.parse(saved) : sampleBookings;
    });

    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        localStorage.setItem('streamingApp_bookings', JSON.stringify(bookings));
    }, [bookings]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const addBooking = (booking) => {
        const newBooking = {
            ...booking,
            id: 'BK' + String(bookings.length + 1).padStart(3, '0'),
            status: 'pending',
            depositPaid: false,
            createdAt: new Date().toISOString().split('T')[0]
        };
        setBookings(prev => [...prev, newBooking]);
        addToast('จองสำเร็จ! กรุณาชำระมัดจำภายใน 24 ชั่วโมง', 'success');
        return newBooking;
    };

    const cancelBooking = (bookingId) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
        addToast('ยกเลิกการจองเรียบร้อยแล้ว', 'warning');
    };

    const confirmBooking = (bookingId) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, status: 'confirmed' } : b
        ));
        addToast('ยืนยันการจองเรียบร้อยแล้ว', 'success');
    };

    const confirmDeposit = (bookingId) => {
        setBookings(prev => prev.map(b =>
            b.id === bookingId ? { ...b, depositPaid: true } : b
        ));
        addToast('ยืนยันการชำระมัดจำเรียบร้อยแล้ว', 'success');
    };

    const getUserBookings = (userId) => {
        return bookings.filter(b => b.userId === userId);
    };

    return (
        <BookingContext.Provider value={{
            bookings, toasts, addBooking, cancelBooking, confirmBooking,
            confirmDeposit, getUserBookings, addToast
        }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBookings = () => useContext(BookingContext);
