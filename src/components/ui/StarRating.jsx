import { Star } from 'lucide-react';

export default function StarRating({ rating, onRate, size = 20, readonly = false }) {
    return (
        <div className="review-stars" style={{ cursor: readonly ? 'default' : 'pointer' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={size}
                    fill={star <= rating ? '#f59e0b' : 'none'}
                    color={star <= rating ? '#f59e0b' : '#4a4a6a'}
                    onClick={() => !readonly && onRate && onRate(star)}
                    style={{ transition: 'all 0.15s ease' }}
                />
            ))}
        </div>
    );
}
