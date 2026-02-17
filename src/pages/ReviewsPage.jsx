import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sampleReviews } from '../data/mockData';
import StarRating from '../components/ui/StarRating';
import { MessageSquare, Send, Image, Video } from 'lucide-react';

export default function ReviewsPage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem('streamingApp_reviews');
        return saved ? JSON.parse(saved) : sampleReviews;
    });

    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, text: '' });
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const saveReviews = (updated) => {
        setReviews(updated);
        localStorage.setItem('streamingApp_reviews', JSON.stringify(updated));
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!newReview.text.trim()) return;
        const review = {
            id: Date.now(),
            userName: user?.name || 'ลูกค้า',
            rating: newReview.rating,
            date: new Date().toISOString().split('T')[0],
            text: newReview.text,
            reply: null,
            avatar: (user?.name || 'ล').charAt(0)
        };
        saveReviews([review, ...reviews]);
        setNewReview({ rating: 5, text: '' });
        setShowForm(false);
    };

    const handleReply = (reviewId) => {
        if (!replyText.trim()) return;
        const updated = reviews.map(r =>
            r.id === reviewId ? { ...r, reply: replyText } : r
        );
        saveReviews(updated);
        setReplyingTo(null);
        setReplyText('');
    };

    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="page container">
            <h1 className="page-title">รีวิวจากลูกค้า</h1>

            {/* Stats */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, color: 'var(--accent-primary)' }}>
                        {avgRating}
                    </div>
                    <StarRating rating={Math.round(avgRating)} readonly />
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>
                        จาก {reviews.length} รีวิว
                    </p>
                </div>
                <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = reviews.filter(r => r.rating === star).length;
                        const pct = (count / reviews.length) * 100;
                        return (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                                <span style={{ fontSize: 'var(--font-size-sm)', width: 20, textAlign: 'right' }}>{star}</span>
                                <div style={{ flex: 1, height: 8, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', width: 30 }}>{count}</span>
                            </div>
                        );
                    })}
                </div>
                {user && (
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <MessageSquare size={16} />
                        เขียนรีวิว
                    </button>
                )}
            </div>

            {/* Review Form */}
            {showForm && (
                <div className="card animate-fade-in" style={{ marginBottom: 'var(--space-xl)' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-lg)' }}>เขียนรีวิวของคุณ</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div className="form-group">
                            <label className="form-label">ให้คะแนน</label>
                            <StarRating rating={newReview.rating} onRate={r => setNewReview(prev => ({ ...prev, rating: r }))} size={28} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ความคิดเห็น</label>
                            <textarea
                                className="form-input"
                                placeholder="แชร์ประสบการณ์ของคุณ..."
                                value={newReview.text}
                                onChange={e => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <button type="submit" className="btn btn-primary">
                                <Send size={14} /> ส่งรีวิว
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                {reviews.map(review => (
                    <div key={review.id} className="card review-card animate-fade-in">
                        <div className="review-header">
                            <div className="review-avatar">{review.avatar}</div>
                            <div style={{ flex: 1 }}>
                                <div className="review-name">{review.userName}</div>
                                <div className="review-date">{review.date}</div>
                            </div>
                            <StarRating rating={review.rating} readonly size={16} />
                        </div>
                        <p className="review-text">{review.text}</p>

                        {/* Reply */}
                        {review.reply && (
                            <div className="review-reply">
                                <div className="review-reply-label">ตอบกลับจากทีมงาน</div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{review.reply}</p>
                            </div>
                        )}

                        {/* Reply form (admin only) */}
                        {user?.role === 'admin' && !review.reply && (
                            <div style={{ marginTop: 'var(--space-md)' }}>
                                {replyingTo === review.id ? (
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="เขียนตอบกลับ..."
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <button className="btn btn-primary btn-sm" onClick={() => handleReply(review.id)}>
                                            <Send size={14} />
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setReplyingTo(null)}>
                                            ยกเลิก
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                                    >
                                        <MessageSquare size={14} /> ตอบกลับ
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
