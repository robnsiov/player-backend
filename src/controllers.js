const express = require("express");
const Music = require("./model");
const musicRouter = express.Router();
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const verifySecretKey = (req, res, next) => {
  const secretKey = req.headers["x-secret-key"];
  if (secretKey && secretKey === process.env.SECRET_KEY) {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Forbidden: Invalid or missing secret key" });
  }
};

musicRouter.get("/check-secret-key", verifySecretKey, (req, res) => {
  res.status(200).json({ message: "Secret key is valid" });
});

musicRouter.get("/musics", async (req, res) => {
  try {
    const musics = await Music.find();
    res.json(musics);
  } catch (err) {
    res.status(500).json({ message: "Fetching musics" });
  }
});
musicRouter.get("/musics/top", async (req, res) => {
  try {
    const topMusic = await Music.findOne({ top: true }).sort({ rating: -1 });
    if (!topMusic) {
      return res.status(404).json({ message: "No music found" });
    }
    res.json(topMusic);
  } catch (err) {
    res.status(500).json({ message: "Fetching top music failed" });
  }
});
musicRouter.post("/musics", verifySecretKey, async (req, res) => {
  try {
    const newMusic = new Music(req.body);
    await newMusic.save();
    res.status(201).json(newMusic);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Creating music failed" });
  }
});
musicRouter.get("/musics/:name", async (req, res) => {
  try {
    const music = await Music.findOne({ name: req.params.name });
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }
    res.json(music);
  } catch (err) {
    res.status(500).json({ message: "Fetching music by ID failed" });
  }
});
musicRouter.put("/musics/:id", verifySecretKey, async (req, res) => {
  try {
    const music = await Music.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }
    res.json(music);
  } catch (err) {
    res.status(400).json({ message: "Updating music failed" });
  }
});
musicRouter.delete("/musics/:id", verifySecretKey, async (req, res) => {
  try {
    const music = await Music.findByIdAndDelete(req.params.id);
    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }
    res.json({ message: "Music deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deleting music failed" });
  }
});

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({ storage });

// Upload endpoint for multiple files
musicRouter.post(
  "/upload",
  verifySecretKey,
  upload.array("file", 10),
  (req, res) => {
    try {
      res
        .status(200)
        .send({ message: "Files uploaded successfully", files: req.files });
    } catch (error) {
      res.status(400).send({ error: "File upload failed. Please try again." });
    }
  }
);

// Serve static files from the 'uploads' directory
musicRouter.use("/uploads", express.static("uploads"));

module.exports = musicRouter;
