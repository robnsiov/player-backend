const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    artists: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Music = mongoose.model("Music", musicSchema);

module.exports = Music;
