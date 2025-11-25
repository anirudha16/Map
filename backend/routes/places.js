const router = require("express").Router();
const { supabase } = require("../utils/supabaseClient");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .limit(20);

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
  const { minLon, minLat, maxLon, maxLat } = req.query;

  // Validate
  if (!minLon || !minLat || !maxLon || !maxLat) {
    return res.status(400).json({ error: "Bounding box params missing" });
  }

  console.log("📦 BBOX incoming:", { minLon, minLat, maxLon, maxLat });

  try {
    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc("get_places_in_bbox", {
      min_lon: Number(minLon),
      min_lat: Number(minLat),
      max_lon: Number(maxLon),
      max_lat: Number(maxLat),
    });

    if (error) {
      console.error("❌ RPC Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`📌 RPC returned ${data?.length} places`);
    return res.json(data);
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
