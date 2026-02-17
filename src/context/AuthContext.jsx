import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('streamingApp_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        const saved = localStorage.getItem('streamingApp_isAdmin');
        return saved === 'true';
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('streamingApp_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('streamingApp_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('streamingApp_isAdmin', isAdmin.toString());
    }, [isAdmin]);

    const login = (email, password) => {
        // Check admin
        if (email === 'admin@streaming.com' && password === 'admin123') {
            const adminUser = {
                id: 'admin',
                name: 'ผู้ดูแลระบบ',
                email: 'admin@streaming.com',
                phone: '02-123-4567',
                address: 'กรุงเทพมหานคร',
                role: 'admin'
            };
            setUser(adminUser);
            setIsAdmin(true);
            return { success: true, isAdmin: true };
        }

        // Check registered users
        const users = JSON.parse(localStorage.getItem('streamingApp_users') || '[]');
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
            const { password: _, ...userData } = found;
            setUser(userData);
            setIsAdmin(false);
            return { success: true, isAdmin: false };
        }

        // Demo user
        if (email === 'demo@test.com' && password === '1234') {
            const demoUser = {
                id: 'user1',
                name: 'สมชาย จันทร์ดี',
                email: 'demo@test.com',
                phone: '081-234-5678',
                address: '123 ถ.สุขุมวิท กรุงเทพฯ',
                role: 'customer'
            };
            setUser(demoUser);
            setIsAdmin(false);
            return { success: true, isAdmin: false };
        }

        return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    };

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('streamingApp_users') || '[]');
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'อีเมลนี้ถูกใช้งานแล้ว' };
        }
        const newUser = {
            ...userData,
            id: 'user_' + Date.now(),
            role: 'customer'
        };
        users.push(newUser);
        localStorage.setItem('streamingApp_users', JSON.stringify(users));
        const { password: _, ...safe } = newUser;
        setUser(safe);
        setIsAdmin(false);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        setIsAdmin(false);
    };

    const updateProfile = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        // Also update in users list
        const users = JSON.parse(localStorage.getItem('streamingApp_users') || '[]');
        const idx = users.findIndex(u => u.id === updated.id);
        if (idx >= 0) {
            users[idx] = { ...users[idx], ...updates };
            localStorage.setItem('streamingApp_users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
