const express = require("express");

const Bookmark = require("../models/Bookmark.js");
const auth = require("../middleware/auth");

const router = express.Router();

// GET ALL BOOKMARKS
router.get("/", auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user
    }).sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({
      message: "Could not load bookmarks"
    });
  }
});

// ADD BOOKMARK
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      url,
      description,
      type,
      favorite,
      readLater,
      collection
    } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        message: "Title and URL are required"
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user,
      title,
      url,
      description: description || "",
      type: type || "website",
      favorite: favorite || false,
      readLater: readLater || false,
      collection: collection || "General"
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({
      message: "Could not add bookmark",
      error: error.message
    });
  }
});

// UPDATE BOOKMARK
router.put("/:id", auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user
      },
      req.body,
      {
        new: true
      }
    );

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found"
      });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({
      message: "Could not update bookmark"
    });
  }
});

// DELETE BOOKMARK
router.delete("/:id", auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found"
      });
    }

    res.json({
      message: "Bookmark deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete bookmark"
    });
  }
});

module.exports = router;
