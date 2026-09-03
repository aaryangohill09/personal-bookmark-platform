const express = require("express");

const Collection = require("../models/Collection");
const Bookmark = require("../models/Bookmark.js");
const auth = require("../middleware/auth");

const router = express.Router();

// GET ALL COLLECTIONS
router.get("/", auth, async (req, res) => {
  try {
    const collections = await Collection.find({
      user: req.user
    }).sort({ createdAt: 1 });

    res.json(collections);
  } catch (error) {
    res.status(500).json({
      message: "Could not load collections"
    });
  }
});

// CREATE COLLECTION
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required"
      });
    }

    const existing = await Collection.findOne({
      user: req.user,
      name: name.trim()
    });

    if (existing) {
      return res.status(400).json({
        message: "Collection already exists"
      });
    }

    const collection = await Collection.create({
      user: req.user,
      name: name.trim()
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({
      message: "Could not create collection"
    });
  }
});

// RENAME COLLECTION
router.put("/:id", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required"
      });
    }

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found"
      });
    }

    if (collection.name === "General") {
      return res.status(400).json({
        message: "General collection cannot be renamed"
      });
    }

    const oldName = collection.name;
    const newName = name.trim();

    collection.name = newName;
    await collection.save();

    await Bookmark.updateMany(
      {
        user: req.user,
        collection: oldName
      },
      {
        collection: newName
      }
    );

    res.json(collection);
  } catch (error) {
    res.status(500).json({
      message: "Could not rename collection"
    });
  }
});

// DELETE COLLECTION
router.delete("/:id", auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found"
      });
    }

    if (collection.name === "General") {
      return res.status(400).json({
        message: "General collection cannot be deleted"
      });
    }

    await Bookmark.updateMany(
      {
        user: req.user,
        collection: collection.name
      },
      {
        collection: "General"
      }
    );

    await Collection.findByIdAndDelete(req.params.id);

    res.json({
      message: "Collection deleted and bookmarks moved to General"
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete collection"
    });
  }
});

module.exports = router;
