const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caregiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    childName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    durationHours: {
      type: Number,
      required: true,
      min: 0,
    },

    serviceLocation: {
      type: String,
      required: true,
      trim: true,
    },

    parentNote: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    caregiverResponse: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    hourlyRate: {
      type: Number,
      min: 0,
    },

    estimatedAmount: {
      type: Number,
      min: 0,
    },

    agreedAmount: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", BookingSchema);