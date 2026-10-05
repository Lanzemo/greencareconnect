const express = require("express");

const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// GET MY PROFILE
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving your profile.",
      data: null,
    });
  }
});

// UPDATE MY PROFILE
router.patch("/profile", verifyToken, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      bio,
      experience,
      skills,
      hourlyRate,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
          data: null,
        });
      }

      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }

    if (location !== undefined) {
      updateData.location = location.trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio.trim();
    }

    if (experience !== undefined) {
      updateData.experience = experience.trim();
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          success: false,
          message: "Skills must be provided as a list.",
          data: null,
        });
      }

      updateData.skills = skills
        .map((skill) => String(skill).trim())
        .filter(Boolean);
    }

    if (hourlyRate !== undefined) {
      const rate = Number(hourlyRate);

      if (Number.isNaN(rate) || rate < 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid hourly rate.",
          data: null,
        });
      }

      updateData.hourlyRate = rate;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating your profile.",
      data: null,
    });
  }
});

// GET CAREGIVERS
router.get("/caregivers", verifyToken, async (req, res) => {
  try {
    const caregivers = await User.find(
      { role: "CAREGIVER" },
      {
        name: 1,
        email: 1,
        role: 1,
        phone: 1,
        location: 1,
        bio: 1,
        experience: 1,
        skills: 1,
        hourlyRate: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Caregivers retrieved successfully.",
      data: caregivers,
    });
  } catch (error) {
    console.error("Get caregivers error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while retrieving caregivers.",
      data: null,
    });
  }
});

module.exports = router;