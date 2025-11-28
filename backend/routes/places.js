const router = require("express").Router();
const { supabase } = require("../utils/supabaseClient");

router.get("/", async (req, res) => {
  try {
    const min_lon = Number(req.query.minLon ?? -180); // CHANGED FOR BOUNDING BOX FETCHING
    const min_lat = Number(req.query.minLat ?? -90); // CHANGED FOR BOUNDING BOX FETCHING
    const max_lon = Number(req.query.maxLon ?? 180); // CHANGED FOR BOUNDING BOX FETCHING
    const max_lat = Number(req.query.maxLat ?? 90); // CHANGED FOR BOUNDING BOX FETCHING
    const { data, error } = await supabase.rpc("get_places_in_bbox", { // CHANGED FOR BOUNDING BOX FETCHING
      min_lon, // CHANGED FOR BOUNDING BOX FETCHING
      min_lat, // CHANGED FOR BOUNDING BOX FETCHING
      max_lon, // CHANGED FOR BOUNDING BOX FETCHING
      max_lat, // CHANGED FOR BOUNDING BOX FETCHING
    }); // CHANGED FOR BOUNDING BOX FETCHING

    if (error) {
      console.error("Places query error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`✅ Places fetched: ${data?.length || 0} rows`);
    if (data && data.length > 0) {
      console.log("Sample place data:", JSON.stringify(data[0], null, 2));
    }

    return res.json(data || []);
  } catch (err) {
    console.error("Places route error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/bbox", async (req, res) => {
  const { minLon, minLat, maxLon, maxLat, zoom } = req.query;

  // Validate
  if (!minLon || !minLat || !maxLon || !maxLat) {
    return res.status(400).json({ error: "Bounding box params missing" });
  }

  console.log("📦 BBOX incoming:", { minLon, minLat, maxLon, maxLat, zoom });

  try {
    const min_lon = Number(minLon);
    const min_lat = Number(minLat);
    const max_lon = Number(maxLon);
    const max_lat = Number(maxLat);
    const zoomLevel = Number(zoom);
    if (zoomLevel < 8) {
      return res.json([]);
    }

    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc("get_places_in_bbox", {
      min_lon,
      min_lat,
      max_lon,
      max_lat,
    });

    if (error) {
      console.error("❌ RPC Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`📌 RPC returned ${data?.length} places`);
    return res.json(data || []);
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
