import { Link } from 'react-router-dom';
import { Radio, Phone, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="navbar-brand-icon" style={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                                <Radio size={16} />
                            </div>
                            StreamPro
                        </div>
                        <p className="footer-desc">
                            บริการถ่ายทอดสดครบวงจร Backup & Production<br />
                            พร้อมอุปกรณ์มืออาชีพ ทีมงานคุณภาพ<br />
                            ให้บริการทั่วประเทศไทย
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-title">บริการ</h4>
                        <ul className="footer-links">
                            <li><Link to="/equipment">อุปกรณ์</Link></li>
                            <li><Link to="/booking">จองบริการ</Link></li>
                            <li><Link to="/reviews">รีวิว</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-title">ลิงก์ด่วน</h4>
                        <ul className="footer-links">
                            <li><Link to="/login">เข้าสู่ระบบ</Link></li>
                            <li><Link to="/register">สมัครสมาชิก</Link></li>
                            <li><Link to="/my-bookings">การจองของฉัน</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-title">ติดต่อเรา</h4>
                        <ul className="footer-links">
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={14} />
                                <span>081-234-5678</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageCircle size={14} />
                                <span>Line: @streampro</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={14} />
                                <span>info@streampro.co.th</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2026 StreamPro - ระบบบริหารจัดการการถ่ายทอดสด. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
