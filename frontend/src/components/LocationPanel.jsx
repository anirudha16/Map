import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewsByLocation, addReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

const LocationPanel = ({ location, onClose }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({ rating: 5, comment: '' });

  const locationId = location?.id;
  const shouldFetchReviews = Boolean(locationId && !location?.isVirtual);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', locationId],
    queryFn: () => getReviewsByLocation(locationId),
    enabled: shouldFetchReviews,
  });

  // ✅ FIXED MUTATION BLOCK
  const mutation = useMutation({
    mutationFn: ({ rating, comment }) => {
      const safeEmail = user?.email || "anonymous_user";
      const safeUsername = safeEmail.split("@")[0];

      console.log("🚀 Sending Review:", {
        rating: Number(rating),
        comment,
        user_email: safeEmail,
        user_name: safeUsername,
      });

      return addReview(locationId, {
        rating: Number(rating),
        comment,
        user_email: safeEmail,
        user_name: safeUsername,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', locationId] });
      setFormState({ rating: 5, comment: '' });
    },

    onError: (error) => {
      console.error("❌ Review submit failed:", error);
    },
  });

  const coordinates = useMemo(() => {
    if (!location) return '';
    return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  }, [location]);

  if (!location) {
    return (
      <aside className="location-panel empty">
        <p>Select a marker to view details.</p>
      </aside>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formState);
  };

  return (
    <aside className="location-panel">
      <header>
        <div>
          <h2>{location.name}</h2>
          <p className="subtle-text">{formatDate(location.created_at)}</p>
        </div>
        <button className="panel-close" onClick={onClose} aria-label="Close panel">
          ×
        </button>
      </header>

      <section>
        <p className="modal-description">{location.description}</p>
        <div className="coordinates">
          <span>Coordinates</span>
          <strong>{coordinates}</strong>
        </div>
      </section>

      {!location.isVirtual && (
        <section className="reviews-section">
          <h3>Reviews</h3>
          {isLoading ? (
            <p>Loading reviews...</p>
          ) : reviews?.length ? (
            <ul className="reviews-list">
              {reviews.map((review) => (
                <li key={review.id}>
                  <div className="review-rating">Rating: {review.rating}/5</div>
                  <div className="review-author">
                    <strong>User:</strong>{" "}
                    {review.user_name || "Unknown User"}
                  </div>
                  <p>{review.comment}</p>
                  <span className="review-meta">
                    {new Date(review.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first one!</p>
          )}
        </section>
      )}

      {location.isVirtual && (
        <p className="subtle-text">
          This pin isn’t stored yet, so reviews are disabled.
        </p>
      )}

      {user && !location.isVirtual ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <label htmlFor="panel-rating">Rating</label>
          <select
            id="panel-rating"
            name="rating"
            value={formState.rating}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, rating: e.target.value }))
            }
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>

          <label htmlFor="panel-comment">Comment</label>
          <textarea
            id="panel-comment"
            name="comment"
            rows="4"
            value={formState.comment}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Share your experience..."
          />

          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
          {mutation.isError && (
            <p className="error-text">
              {mutation.error?.response?.data?.error || 'Unable to submit review'}
            </p>
          )}
        </form>
      ) : (
        <p className="subtle-text">Login to share your experience.</p>
      )}
    </aside>
  );
};

export default LocationPanel;
