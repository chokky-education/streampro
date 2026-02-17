import { Link } from 'react-router-dom';
import { Radio, Camera, Mic, Monitor, Shield, Clock, Star, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { promotions, sampleReviews } from '../data/mockData';
import StarRating from '../components/ui/StarRating';

export default function HomePage() {
    return (
        <div className="page">
            {/* Hero */}
            <section className="hero container">
                <h1 className="hero-title">
                    บริการถ่ายทอดสด<br />
                    <span>Backup & Production</span><br />
                    มืออาชีพ
                </h1>
                <p className="hero-subtitle">
                    ครบวงจร ทั้งอุปกรณ์ ทีมงาน และระบบจัดการ
                    พร้อมให้บริการทุกงานทั่วประเทศไทย
                </p>
                <div className="hero-actions">
                    <Link to="/booking" className="btn btn-primary btn-lg">
                        จองบริการเลย
                        <ArrowRight size={20} />
                    </Link>
                    <Link to="/equipment" className="btn btn-secondary btn-lg">
                        ดูอุปกรณ์ทั้งหมด
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <div className="container">
                <div className="stats-grid">
                    {[
                        { value: '500+', label: 'งานที่ถ่ายทอดแล้ว' },
                        { value: '50+', label: 'ชุดอุปกรณ์' },
                        { value: '4.9', label: 'คะแนนเฉลี่ย' },
                        { value: '100%', label: 'ลูกค้าพึงพอใจ' },
                    ].map((stat, i) => (
                        <div key={i} className="card stat-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services */}
            <section className="section container">
                <div className="section-header">
                    <h2 className="section-title">บริการของเรา</h2>
                    <p className="section-subtitle">ครบทุกความต้องการด้านการถ่ายทอดสด</p>
                </div>
                <div className="grid grid-3">
                    {[
                        { icon: <Camera size={32} />, title: 'Backup Equipment', desc: 'ชุดอุปกรณ์สำรอง กล้อง ไมโครโฟน พร้อมใช้งาน', color: '#7c3aed' },
                        { icon: <Monitor size={32} />, title: 'Production Set', desc: 'ชุดโปรดักชั่นครบครัน สวิตเชอร์ มอนิเตอร์ ระบบไฟ', color: '#06b6d4' },
                        { icon: <Mic size={32} />, title: 'Add-on Equipment', desc: 'อุปกรณ์เสริม เลือกเพิ่มได้ตามต้องการ', color: '#10b981' },
                    ].map((service, i) => (
                        <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                                background: `${service.color}20`, color: service.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 'var(--space-lg)'
                            }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
                                {service.title}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Us */}
            <section className="section container">
                <div className="section-header">
                    <h2 className="section-title">ทำไมต้องเลือกเรา?</h2>
                </div>
                <div className="grid grid-4">
                    {[
                        { icon: <Shield size={24} />, title: 'มืออาชีพ', desc: 'ทีมงานมากประสบการณ์' },
                        { icon: <Clock size={24} />, title: 'ตรงเวลา', desc: 'พร้อมก่อนงานเสมอ' },
                        { icon: <Star size={24} />, title: 'คุณภาพ', desc: 'อุปกรณ์ระดับพรีเมียม' },
                        { icon: <Phone size={24} />, title: 'ซัพพอร์ต', desc: 'ดูแลตลอด 24 ชม.' },
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ textAlign: 'center' }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-full)',
                                background: 'var(--accent-gradient)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
                                color: 'white'
                            }}>
                                {item.icon}
                            </div>
                            <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{item.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Promotions */}
            <section className="section container">
                <div className="section-header">
                    <h2 className="section-title">โปรโมชั่น</h2>
                    <p className="section-subtitle">ข้อเสนอพิเศษสำหรับคุณ</p>
                </div>
                <div className="grid grid-3">
                    {promotions.map((promo, i) => (
                        <div key={promo.id} className="promo-card animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="promo-image" style={{ background: promo.gradient }}>
                                <span style={{ fontSize: '3rem' }}>{promo.emoji}</span>
                                <span className="promo-badge">{promo.discount} OFF</span>
                            </div>
                            <div className="promo-content">
                                <h3 className="promo-title">{promo.title}</h3>
                                <p className="promo-desc">{promo.description}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-sm)' }}>
                                    หมดเขต: {promo.validUntil}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews */}
            <section className="section container">
                <div className="section-header">
                    <h2 className="section-title">รีวิวจากลูกค้า</h2>
                    <p className="section-subtitle">เสียงจากลูกค้าที่ไว้วางใจเรา</p>
                </div>
                <div className="grid grid-2">
                    {sampleReviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="card review-card">
                            <div className="review-header">
                                <div className="review-avatar">{review.avatar}</div>
                                <div>
                                    <div className="review-name">{review.userName}</div>
                                    <div className="review-date">{review.date}</div>
                                </div>
                            </div>
                            <StarRating rating={review.rating} readonly />
                            <p className="review-text">{review.text}</p>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
                    <Link to="/reviews" className="btn btn-secondary">
                        ดูรีวิวทั้งหมด <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Contact */}
            <section className="section container">
                <div className="card-glass" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
                    <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>ติดต่อเรา</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: 600, margin: '0 auto var(--space-xl)' }}>
                        สนใจบริการ? ติดต่อเราได้ทุกช่องทาง เรายินดีให้คำปรึกษา
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-xl)', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <Phone size={20} color="#7c3aed" />
                            <span style={{ fontWeight: 600 }}>081-234-5678</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                            <MessageCircle size={20} color="#06b6d4" />
                            <span style={{ fontWeight: 600 }}>Line: @streampro</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
