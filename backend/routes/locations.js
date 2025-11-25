const express = require("express");
const router = express.Router();

const {
  getAllLocations,
  getLocationById,
  searchLocationsByName,
} = require("../services/locationService");

// GET ALL locations
router.get("/", async (req, res) => {
  try {
    const { data, error } = await getAllLocations();

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

// SEARCH by name
router.get("/search", async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: "Missing name" });
  }

  const { data, error } = await searchLocationsByName(name);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.json([]);
  }

  return res.json(data);
});

// Helper to validate UUID
const isUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// GET location by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (!isUUID(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const { data, error } = await getLocationById(id);

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Location not found" });
  }

  return res.json(data);
});

module.exports = router;
