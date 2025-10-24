const express = require("express");
const movieModel = require("../models/movieModel");
const router = express.Router();

router.get("/search/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const movie = await movieModel.findOne({ title: { $regex: title, $options: "i" } });

    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
