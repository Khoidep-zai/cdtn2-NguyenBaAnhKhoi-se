import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 18,
  interactive = false
}) => {
  return (
    <div style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: interactive ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            color: star <= rating ? '#eab308' : '#cbd5e1',
            transition: 'transform 0.15s ease'
          }}
        >
          <Star size={size} fill={star <= rating ? '#eab308' : 'none'} />
        </button>
      ))}
    </div>
  );
};
