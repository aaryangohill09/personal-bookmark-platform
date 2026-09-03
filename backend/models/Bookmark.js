const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    type: {
      type: String,
      enum: ["website", "article", "video", "other"],
      default: "website"
    },

    favorite: {
      type: Boolean,
      default: false
    },

    readLater: {
      type: Boolean,
      default: false
    },

    collection: {
      type: String,
      default: "General"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);