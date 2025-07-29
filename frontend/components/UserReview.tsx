import { useEffect, useState } from 'react';
import { getMyReview } from '../lib/api';
import { Card, CardContent } from './ui/card';

export default function UserReview({ templateId }: { templateId: string }) {
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      setLoading(true);
      try {
        const response = await getMyReview(templateId);
        setReview(response?.data?.review || null);
      } catch (error) {
        setReview(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [templateId]);

  if (loading) return <div className="text-white">Cargando tu reseña...</div>;
  if (!review) return <div className="text-white">No has dejado una reseña para este template.</div>;

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex mb-4">
          {[...Array(review.rating)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
            </svg>
          ))}
        </div>
        <p className="text-white/90 mb-4 italic">"{review.comment}"</p>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold text-lg">
              {review.userId?.username?.slice(0, 2).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold">{review.userId?.username || 'Anonymous'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
