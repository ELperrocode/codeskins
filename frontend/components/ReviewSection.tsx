'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import { getReviews, getMyReview, createReview, updateReview, deleteReview } from '../lib/api';
import { IconStar, IconEdit, IconTrash, IconCheck, IconX, IconMessage } from '@tabler/icons-react';

interface ReviewSectionProps {
  templateId: string;
  className?: string;
}

interface Review {
  _id: string;
  userId: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

interface ReviewForm {
  rating: number;
  title: string;
  comment: string;
}

export default function ReviewSection({ templateId, className = '' }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ReviewForm>({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchMyReview();
    }
  }, [templateId, user]);

  const fetchReviews = async () => {
    try {
      const response = await getReviews(templateId);
      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setStats({
          averageRating: response.data.averageRating,
          totalReviews: response.data.totalReviews,
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    try {
      const response = await getMyReview(templateId);
      if (response.success && response.data?.review) {
        setMyReview(response.data.review);
        setForm({
          rating: response.data.review.rating,
          title: response.data.review.title,
          comment: response.data.review.comment,
        });
      }
    } catch (error) {
      console.error('Error fetching my review:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editing && myReview) {
        const response = await updateReview(myReview._id, form);
        if (response.success && response.data?.review) {
          setMyReview(response.data.review);
          setEditing(false);
          setShowForm(false);
          fetchReviews(); // Refresh reviews to update stats
        }
      } else {
        const response = await createReview({
          templateId,
          ...form,
        });
        if (response.success && response.data?.review) {
          setMyReview(response.data.review);
          setShowForm(false);
          fetchReviews(); // Refresh reviews to update stats
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview || !confirm('Are you sure you want to delete your review?')) return;

    try {
      const response = await deleteReview(myReview._id);
      if (response.success) {
        setMyReview(null);
        setForm({ rating: 5, title: '', comment: '' });
        fetchReviews(); // Refresh reviews to update stats
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(false);
    if (myReview) {
      setForm({
        rating: myReview.rating,
        title: myReview.title,
        comment: myReview.comment,
      });
    } else {
      setForm({ rating: 5, title: '', comment: '' });
    }
    setError('');
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange?.(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
            disabled={!interactive}
          >
            <IconStar
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-500 fill-current'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <div className="text-lg">Loading reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Review Stats */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <IconMessage className="w-5 h-5" />
            Reviews ({stats.totalReviews})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {stats.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(stats.averageRating))}
              <div className="text-sm text-muted-foreground mt-1">
                Average Rating
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Review */}
      {user && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">My Review</CardTitle>
            <CardDescription className="text-muted-foreground">
              {myReview ? 'You have reviewed this template' : 'Share your experience with this template'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {myReview && !showForm ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(myReview.rating)}
                      <span className="font-medium text-foreground">{myReview.title}</span>
                      {myReview.isVerified && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{myReview.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(myReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleEdit}
                      className="border-border text-foreground hover:bg-accent"
                    >
                      <IconEdit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDelete}
                      className="border-border text-destructive hover:bg-destructive/10"
                    >
                      <IconTrash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rating
                  </label>
                  {renderStars(form.rating, true, (rating) =>
                    setForm(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief summary of your experience"
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Comment
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your detailed experience with this template..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-border text-foreground hover:bg-accent flex-1"
                  >
                    <IconX className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                  >
                    <IconCheck className="w-4 h-4 mr-2" />
                    {submitting ? 'Saving...' : (editing ? 'Update Review' : 'Submit Review')}
                  </Button>
                </div>
              </form>
            )}

            {!myReview && !showForm && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3"
                >
                  <IconMessage className="w-4 h-4 mr-2" />
                  Write a Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          All Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-center">
              <IconMessage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review this template!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="font-medium text-foreground">{review.title}</span>
                        {review.isVerified && (
                          <Badge variant="default" className="bg-success text-success-foreground">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          by {review.userId.firstName && review.userId.lastName 
                            ? `${review.userId.firstName} ${review.userId.lastName}`
                            : review.userId.username
                          }
                        </span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 