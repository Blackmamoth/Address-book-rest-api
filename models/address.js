const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for your contact"],
    },
    email: {
      type: String,
      required: [true, "Please provide a email for your contact"],
    },
    phone: {
      type: Number,
      required: [true, "Please provide a phone number for your contact"],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
