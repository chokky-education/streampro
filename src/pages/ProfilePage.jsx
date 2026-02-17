import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [saved, setSaved] = useState(false);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="page container" style={{ maxWidth: 700 }}>
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name?.charAt(0) || <User size={36} />}
                </div>
                <div>
                    <h1 className="profile-name">{user.name}</h1>
                    <p className="profile-email">{user.email}</p>
                    <span className="badge badge-info" style={{ marginTop: 'var(--space-sm)' }}>
                        {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ลูกค้า'}
                    </span>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
                    แก้ไขข้อมูลส่วนตัว
                </h2>

                {saved && (
                    <div style={{
                        background: 'var(--success-bg)', color: 'var(--success)',
                        padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)'
                    }}>
                        ✓ บันทึกข้อมูลเรียบร้อยแล้ว
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { name: 'name', label: 'ชื่อ-นามสกุล', icon: <User size={16} /> },
                        { name: 'email', label: 'อีเมล', icon: <Mail size={16} />, type: 'email' },
                        { name: 'phone', label: 'เบอร์โทรศัพท์', icon: <Phone size={16} />, type: 'tel' },
                        { name: 'address', label: 'ที่อยู่', icon: <MapPin size={16} /> },
                    ].map(field => (
                        <div key={field.name} className="form-group">
                            <label className="form-label">{field.label}</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }}>{field.icon}</span>
                                <input
                                    type={field.type || 'text'}
                                    className="form-input"
                                    style={{ paddingLeft: 38 }}
                                    value={form[field.name]}
                                    onChange={e => setForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                                />
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary">
                        <Save size={16} />
                        บันทึกข้อมูล
                    </button>
                </form>
            </div>
        </div>
    );
}
