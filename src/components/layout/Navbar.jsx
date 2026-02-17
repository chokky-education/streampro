import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Radio, Menu, X, User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileOpen(false);
    };

    const links = [
        { path: '/', label: 'หน้าแรก' },
        { path: '/equipment', label: 'อุปกรณ์' },
        { path: '/booking', label: 'จองบริการ' },
        { path: '/reviews', label: 'รีวิว' },
    ];

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-brand">
                        <div className="navbar-brand-icon">
                            <Radio size={20} />
                        </div>
                        StreamPro
                    </Link>

                    <ul className="navbar-links">
                        {links.map(link => (
                            <li key={link.path}>
                                <Link to={link.path} className={isActive(link.path)}>{link.label}</Link>
                            </li>
                        ))}
                        {user && (
                            <li>
                                <Link to="/my-bookings" className={isActive('/my-bookings')}>การจองของฉัน</Link>
                            </li>
                        )}
                        {isAdmin && (
                            <li>
                                <Link to="/admin" className={isActive('/admin')}>แอดมิน</Link>
                            </li>
                        )}
                    </ul>

                    <div className="navbar-actions">
                        {user ? (
                            <>
                                <Link to="/profile" className="btn btn-secondary btn-sm">
                                    <User size={16} />
                                    {user.name}
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="btn btn-primary btn-sm">
                                        <Shield size={16} />
                                        Admin
                                    </Link>
                                )}
                                <button className="btn btn-icon" onClick={handleLogout} title="ออกจากระบบ">
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm">เข้าสู่ระบบ</Link>
                                <Link to="/register" className="btn btn-primary btn-sm">สมัครสมาชิก</Link>
                            </>
                        )}
                        <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                {links.map(link => (
                    <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                        {link.label}
                    </Link>
                ))}
                {user && (
                    <>
                        <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>การจองของฉัน</Link>
                        <Link to="/profile" onClick={() => setMobileOpen(false)}>โปรไฟล์</Link>
                        {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}>แอดมิน</Link>}
                        <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: '1rem' }}>
                            ออกจากระบบ
                        </button>
                    </>
                )}
                {!user && (
                    <>
                        <Link to="/login" onClick={() => setMobileOpen(false)}>เข้าสู่ระบบ</Link>
                        <Link to="/register" onClick={() => setMobileOpen(false)}>สมัครสมาชิก</Link>
                    </>
                )}
            </div>
        </>
    );
}
