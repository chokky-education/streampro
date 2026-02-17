import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        const result = login(email, password);
        if (result.success) {
            navigate(result.isAdmin ? '/admin' : '/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                        background: 'var(--accent-gradient)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
                        color: 'white'
                    }}>
                        <LogIn size={28} />
                    </div>
                </div>
                <h2 className="auth-title">เข้าสู่ระบบ</h2>
                <p className="auth-subtitle">ยินดีต้อนรับกลับมา</p>

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
                    <div className="form-group">
                        <label className="form-label">อีเมล</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: 38 }}
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">รหัสผ่าน</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: 38 }}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        เข้าสู่ระบบ
                    </button>
                </form>

                <div className="auth-footer">
                    ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link>
                </div>

                <div style={{
                    marginTop: 'var(--space-xl)', padding: 'var(--space-md)',
                    background: 'var(--info-bg)', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)'
                }}>
                    <strong style={{ color: 'var(--info)' }}>Demo:</strong><br />
                    ลูกค้า: demo@test.com / 1234<br />
                    แอดมิน: admin@streaming.com / admin123
                </div>
            </div>
        </div>
    );
}
