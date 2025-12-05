import express from "express";
import {
  getReviewsByLocation,
  addReview,
} from "../services/reviewService.js";

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const locationId = req.params.locationId;

    const { data, error } = await getReviewsByLocation(locationId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const { rating, comment, user_email = "anonymous_user", user_name } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be between 1 and 5" });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: "Comment is required" });
    }

    const { data, error } = await addReview({
      locationId,
      rating,
      comment,
      user_email,
      user_name,
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
