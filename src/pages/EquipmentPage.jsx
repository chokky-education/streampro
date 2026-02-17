import { useState } from 'react';
import { equipmentSets } from '../data/mockData';
import { Filter } from 'lucide-react';

export default function EquipmentPage() {
    const [filter, setFilter] = useState('all');

    const types = ['all', 'Backup', 'Production', 'Add-on'];
    const filtered = filter === 'all' ? equipmentSets : equipmentSets.filter(e => e.type === filter);

    return (
        <div className="page container">
            <h1 className="page-title">อุปกรณ์ถ่ายทอดสด</h1>
            <p className="page-subtitle">เลือกชุดอุปกรณ์ Backup & Production ที่เหมาะกับงานของคุณ</p>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
                <Filter size={18} style={{ color: 'var(--text-muted)', marginTop: 8 }} />
                {types.map(type => (
                    <button
                        key={type}
                        className={`btn ${filter === type ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        onClick={() => setFilter(type)}
                    >
                        {type === 'all' ? 'ทั้งหมด' : type}
                    </button>
                ))}
            </div>

            <div className="grid grid-3">
                {filtered.map((eq, i) => (
                    <div key={eq.id} className="card equipment-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="equipment-img">{eq.emoji}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                            <div className="equipment-name">{eq.name}</div>
                            <span className={`badge ${eq.type === 'Backup' ? 'badge-info' : eq.type === 'Production' ? 'badge-success' : 'badge-warning'}`}>
                                {eq.type}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                            {eq.description}
                        </p>

                        <div style={{
                            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-md)', marginBottom: 'var(--space-md)'
                        }}>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
                                รายการอุปกรณ์:
                            </p>
                            <ul style={{ listStyle: 'none', fontSize: 'var(--font-size-sm)' }}>
                                {eq.items.map((item, j) => (
                                    <li key={j} style={{ color: 'var(--text-secondary)', padding: '2px 0' }}>• {item}</li>
                                ))}
                            </ul>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--accent-primary)' }}>
                                    ฿{eq.price.toLocaleString()}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>/ครั้ง</span>
                            </div>
                            <div className="equipment-status">
                                <span className={`equipment-status-dot ${eq.available ? 'available' : 'unavailable'}`} />
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>{eq.available ? 'พร้อมใช้งาน' : 'ไม่ว่าง'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
