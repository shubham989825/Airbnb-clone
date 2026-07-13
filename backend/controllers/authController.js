import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.js";

const createJwt = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "user",
  profilePhoto: user.profilePhoto,
  createdAt: user.createdAt,
  isHost: user.isHost,
  verificationStatus: user.verificationStatus,
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = createJwt(user._id);

    res.status(201).json({
      ...buildUserResponse(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password || ""))) {
      const token = createJwt(user._id);

      res.json({
        ...buildUserResponse(user),
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" });
    }

    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!googleRes.ok) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const profile = await googleRes.json();

    if (profile.aud !== process.env.VITE_GOOGLE_CLIENT_ID && profile.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Google client ID mismatch" });
    }

    if (!profile.email_verified) {
      return res.status(401).json({ message: "Google email must be verified" });
    }

    const email = profile.email.toLowerCase();
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(20).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name: profile.name || email.split("@")[0],
        email,
        password: hashedPassword,
        profilePhoto: profile.picture || "",
        googleId: profile.sub,
      });
    } else if (!user.googleId) {
      user.googleId = profile.sub;
      await user.save();
    }

    const token = createJwt(user._id);

    res.json({
      ...buildUserResponse(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase?.();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({ message: "If that email exists, reset instructions have been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>Hi ${user.name || "there"},</p>
        <p>Click the link below to reset your password. The link expires in 1 hour.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "If that email exists, reset instructions have been sent." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Your password has been reset successfully. Please log in with your new password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};