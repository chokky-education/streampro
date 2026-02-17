import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!form.name || !form.email || !form.password) {
            setError('กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }
        if (form.password.length < 4) {
            setError('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
            return;
        }
        const result = register(form);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    const fields = [
        { name: 'name', label: 'ชื่อ-นามสกุล', type: 'text', icon: <User size={16} />, placeholder: 'ชื่อเต็มของคุณ', required: true },
        { name: 'email', label: 'อีเมล', type: 'email', icon: <Mail size={16} />, placeholder: 'your@email.com', required: true },
        { name: 'phone', label: 'เบอร์โทรศัพท์', type: 'tel', icon: <Phone size={16} />, placeholder: '081-234-5678' },
        { name: 'address', label: 'ที่อยู่', type: 'text', icon: <MapPin size={16} />, placeholder: 'ที่อยู่ของคุณ' },
        { name: 'password', label: 'รหัสผ่าน', type: 'password', icon: <Lock size={16} />, placeholder: '••••••••', required: true },
        { name: 'confirmPassword', label: 'ยืนยันรหัสผ่าน', type: 'password', icon: <Lock size={16} />, placeholder: '••••••••', required: true },
    ];

    return (
        <div className="auth-page">
            <div className="card auth-card" style={{ maxWidth: 480 }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                        background: 'var(--accent-gradient)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
                        color: 'white'
                    }}>
                        <UserPlus size={28} />
                    </div>
                </div>
                <h2 className="auth-title">สมัครสมาชิก</h2>
                <p className="auth-subtitle">สร้างบัญชีเพื่อจองบริการ</p>

                {error && (
                    <div style={{
                        background: 'var(--danger-bg)', color: 'var(--danger)',
                        padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div key={field.name} className="form-group">
                            <label className="form-label">
                                {field.label} {field.required && <span style={{ color: 'var(--danger)' }}>*</span>}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }}>{field.icon}</span>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    className="form-input"
                                    style={{ paddingLeft: 38 }}
                                    placeholder={field.placeholder}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        สมัครสมาชิก
                    </button>
                </form>

                <div className="auth-footer">
                    มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    );
}
