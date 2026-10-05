const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");
const checkRole = require("../middleware/role");

const router = express.Router();


// =====================================================
// HELPER FUNCTIONS
// =====================================================

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isTimeFormatValid = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};


// =====================================================
// CREATE BOOKING
// =====================================================

router.post("/", verifyToken, checkRole("PARENT"), async (req, res) => {
  try {
    const {
      caregiverId,
      childName,
      date,
      startTime,
      endTime,
      serviceLocation,
      parentNote,
    } = req.body;

    // -----------------------------
    // Required fields
    // -----------------------------

    if (
      !caregiverId ||
      !childName ||
      !date ||
      !startTime ||
      !endTime ||
      !serviceLocation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Caregiver, child name, date, start time, end time and service location are required.",
        data: null,
      });
    }

    // -----------------------------
    // Validate text fields
    // -----------------------------

    if (!childName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Child name cannot be empty.",
        data: null,
      });
    }

    if (!serviceLocation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service location cannot be empty.",
        data: null,
      });
    }

    // -----------------------------
    // Validate caregiver ID
    // -----------------------------

    if (!mongoose.Types.ObjectId.isValid(caregiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid caregiver ID.",
        data: null,
      });
    }

    // -----------------------------
    // Find caregiver
    // -----------------------------

    const caregiver = await User.findOne({
      _id: caregiverId,
      role: "CAREGIVER",
    });

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: "Selected caregiver was not found.",
        data: null,
      });
    }

    // Prevent caregiver from booking themselves
    if (String(caregiver._id) === String(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot book yourself as a caregiver.",
        data: null,
      });
    }

    // -----------------------------
    // Validate date
    // -----------------------------

    const bookingDate = new Date(`${date}T00:00:00.000Z`);

    if (Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid booking date.",
        data: null,
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past.",
        data: null,
      });
    }

    // -----------------------------
    // Validate time format
    // -----------------------------

    if (
      !isTimeFormatValid(startTime) ||
      !isTimeFormatValid(endTime)
    ) {
      return res.status(400).json({
        success: false,
        message: "Start time and end time must be in HH:MM format.",
        data: null,
      });
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: "End time must be later than start time.",
        data: null,
      });
    }

    const durationHours = (endMinutes - startMinutes) / 60;

    // -----------------------------
    // Calculate booking day range
    // -----------------------------

    const dayStart = new Date(bookingDate);

    const dayEnd = new Date(bookingDate);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    // -----------------------------
    // Prevent exact duplicate booking
    // -----------------------------

    const duplicateBooking = await Booking.findOne({
      parent: req.user.id,
      caregiver: caregiverId,
      date: {
        $gte: dayStart,
        $lt: dayEnd,
      },
      startTime,
      endTime,
      status: {
        $in: ["PENDING", "CONFIRMED"],
      },
    });

    if (duplicateBooking) {
      return res.status(409).json({
        success: false,
        message:
          "You already have a pending or confirmed booking for this caregiver at this time.",
        data: null,
      });
    }

    // -----------------------------
    // Calculate estimated amount
    // -----------------------------

    const hourlyRate =
      caregiver.hourlyRate !== undefined &&
      caregiver.hourlyRate !== null
        ? Number(caregiver.hourlyRate)
        : null;

    const estimatedAmount =
      hourlyRate !== null
        ? durationHours * hourlyRate
        : null;

    // -----------------------------
    // Create booking
    // -----------------------------

    const booking = await Booking.create({
      parent: req.user.id,
      caregiver: caregiverId,
      childName: childName.trim(),
      date: bookingDate,
      startTime,
      endTime,
      durationHours,
      serviceLocation: serviceLocation.trim(),
      parentNote: parentNote?.trim() || "",
      hourlyRate,
      estimatedAmount,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Booking request created successfully.",
      data: booking,
    });

  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the booking.",
      data: null,
    });
  }
});


// =====================================================
// GET BOOKINGS
// =====================================================

router.get("/", verifyToken, async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "PARENT") {
      bookings = await Booking.find({
        parent: req.user.id,
      })
        .populate(
          "caregiver",
          "name email phone location experience skills hourlyRate"
        )
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({
        caregiver: req.user.id,
      })
        .populate("parent", "name email phone")
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully.",
      data: bookings,
    });

  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving bookings.",
      data: null,
    });
  }
});


// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

router.patch(
  "/:id/status",
  verifyToken,
  checkRole("CAREGIVER"),
  async (req, res) => {
    try {
      const {
        status,
        caregiverResponse,
        hourlyRate,
        agreedAmount,
      } = req.body;

      const allowedStatuses = ["CONFIRMED", "CANCELLED"];

      // -----------------------------
      // Validate status
      // -----------------------------

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking status.",
          data: null,
        });
      }

      // -----------------------------
      // Validate booking ID
      // -----------------------------

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID.",
          data: null,
        });
      }

      // -----------------------------
      // Find booking belonging to caregiver
      // -----------------------------

      const booking = await Booking.findOne({
        _id: req.params.id,
        caregiver: req.user.id,
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or you are not assigned to it.",
          data: null,
        });
      }

      // -----------------------------
      // Only pending bookings can change
      // -----------------------------

      if (booking.status !== "PENDING") {
        return res.status(400).json({
          success: false,
          message: `This booking has already been ${booking.status.toLowerCase()}.`,
          data: null,
        });
      }

      // -----------------------------
      // Caregiver response
      // -----------------------------

      if (caregiverResponse !== undefined) {
        booking.caregiverResponse = caregiverResponse.trim();
      }

      // -----------------------------
      // Validate hourly rate
      // -----------------------------

      if (hourlyRate !== undefined) {
        const rate = Number(hourlyRate);

        if (Number.isNaN(rate) || rate <= 0) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid hourly rate.",
            data: null,
          });
        }

        booking.hourlyRate = rate;
      }

      // -----------------------------
      // Validate agreed amount
      // -----------------------------

      if (agreedAmount !== undefined) {
        const amount = Number(agreedAmount);

        if (Number.isNaN(amount) || amount <= 0) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid agreed amount.",
            data: null,
          });
        }

        booking.agreedAmount = amount;
      }

      // -----------------------------
      // Repair duration for old bookings
      // -----------------------------

      if (!booking.durationHours) {
        const start = timeToMinutes(booking.startTime);
        const end = timeToMinutes(booking.endTime);

        if (end > start) {
          booking.durationHours = (end - start) / 60;
        }
      }

      // -----------------------------
      // CONFIRM BOOKING
      // -----------------------------

      if (status === "CONFIRMED") {

        if (!booking.hourlyRate) {
          return res.status(400).json({
            success: false,
            message: "An hourly rate is required before confirming.",
            data: null,
          });
        }

        if (!booking.agreedAmount) {
          return res.status(400).json({
            success: false,
            message: "An agreed amount is required before confirming.",
            data: null,
          });
        }

        // -----------------------------
        // Check for overlapping confirmed
        // booking for this caregiver
        // -----------------------------

        const dayStart = new Date(booking.date);
        dayStart.setUTCHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

        const existingConfirmedBookings = await Booking.find({
          _id: {
            $ne: booking._id,
          },
          caregiver: booking.caregiver,
          date: {
            $gte: dayStart,
            $lt: dayEnd,
          },
          status: "CONFIRMED",
        });

        const bookingStart = timeToMinutes(booking.startTime);
        const bookingEnd = timeToMinutes(booking.endTime);

        const hasOverlap = existingConfirmedBookings.some(
          (existingBooking) => {
            const existingStart = timeToMinutes(
              existingBooking.startTime
            );

            const existingEnd = timeToMinutes(
              existingBooking.endTime
            );

            return (
              bookingStart < existingEnd &&
              bookingEnd > existingStart
            );
          }
        );

        if (hasOverlap) {
          return res.status(409).json({
            success: false,
            message:
              "This booking overlaps with another confirmed booking for this caregiver.",
            data: null,
          });
        }
      }

      // -----------------------------
      // Update status
      // -----------------------------

      booking.status = status;

      await booking.save();

      return res.status(200).json({
        success: true,
        message: `Booking ${status.toLowerCase()} successfully.`,
        data: booking,
      });

    } catch (error) {
      console.error("Update booking error:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong while updating the booking.",
        data: null,
      });
    }
  }
);


module.exports = router;