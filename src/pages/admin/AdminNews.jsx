import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { sampleNews } from '../../data/mockData';
import Modal from '../../components/ui/Modal';
import { Plus, Edit3, Trash2, Newspaper } from 'lucide-react';

export default function AdminNews() {
    const [news, setNews] = useState(() => {
        const saved = localStorage.getItem('streamingApp_news');
        return saved ? JSON.parse(saved) : sampleNews;
    });

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', emoji: '📰' });
    const [deleteId, setDeleteId] = useState(null);

    const saveNews = (updated) => {
        setNews(updated);
        localStorage.setItem('streamingApp_news', JSON.stringify(updated));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;

        if (editingId) {
            const updated = news.map(n =>
                n.id === editingId ? { ...n, ...form } : n
            );
            saveNews(updated);
        } else {
            const newItem = {
                id: Date.now(),
                ...form,
                date: new Date().toISOString().split('T')[0]
            };
            saveNews([newItem, ...news]);
        }
        setForm({ title: '', content: '', emoji: '📰' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item) => {
        setForm({ title: item.title, content: item.content, emoji: item.emoji });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = () => {
        saveNews(news.filter(n => n.id !== deleteId));
        setDeleteId(null);
    };

    const emojis = ['📰', '🆕', '🔧', '📍', '🎉', '📢', '💡', '⚡'];

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)' }}>
                    <div>
                        <h1 className="page-title" style={{ marginBottom: 0 }}>จัดการข่าวสาร</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                            เพิ่ม แก้ไข หรือลบข่าวสารและโปรโมชั่น
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', emoji: '📰' }); }}>
                        <Plus size={16} /> เพิ่มข่าวสาร
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                            {editingId ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">ไอคอน</label>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                                    {emojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className={`btn ${form.emoji === emoji ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                            style={{ fontSize: '1.2rem', padding: '0.5rem' }}
                                            onClick={() => setForm(prev => ({ ...prev, emoji }))}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">หัวข้อ</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="หัวข้อข่าวสาร"
                                    value={form.title}
                                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">เนื้อหา</label>
                                <textarea
                                    className="form-input"
                                    placeholder="รายละเอียดข่าวสาร"
                                    value={form.content}
                                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? 'บันทึก' : 'เพิ่มข่าวสาร'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* News List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {news.map(item => (
                        <div key={item.id} className="card news-card">
                            <div className="news-image">{item.emoji}</div>
                            <div className="news-content">
                                <div className="news-title">{item.title}</div>
                                <div className="news-date">{item.date}</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>
                                    {item.content}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexShrink: 0 }}>
                                <button className="btn btn-icon" onClick={() => handleEdit(item)}>
                                    <Edit3 size={16} />
                                </button>
                                <button className="btn btn-icon" style={{ color: 'var(--danger)' }} onClick={() => setDeleteId(item.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Delete Modal */}
                <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="ลบข่าวสาร">
                    <p style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
                        คุณต้องการลบข่าวสารนี้ใช่หรือไม่?
                    </p>
                    <div className="modal-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>ยกเลิก</button>
                        <button className="btn btn-danger" onClick={handleDelete}>ลบ</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
