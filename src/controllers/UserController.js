import mongoose from "mongoose";

import UserModule from "../module/UserModule.js";
import jwt from "jsonwebtoken";
import OTPModel from "./../module/OTPModel.js";
import sendEmail from "../../utility/SendEmailUtility.js";

//! Registration.........................
export const registration = async (req, res) => {
  try {
    let reqBody = req.body;
    const data = await UserModule.create(reqBody);
    return res.status(201).json({
      status: "success",
      message: "User created successfully.",
      data: data,
    });
  } catch (err) {
    return res.status(200).json({ status: "fail", error: err.toString() });
  }
};

//! Login.................................
export const login = async (req, res) => {
  try {
    let reqBody = req.body;
    let data = await UserModule.aggregate([
      { $match: reqBody },
      { $project: { _id: 0, email: 1, firstName: 1, lastName: 1, photo: 1 } },
    ]);
    if (data.length > 0) {
      let Playload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: data[0]["email"],
      };
      let token = jwt.sign(Playload, "secretKey1234567890");
      return res
        .status(200)
        .json({ status: "success", token: token, data: data[0] });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.toString() });
  }
};

//! profile update ...............................................
export const profileUpdate = async (req, res) => {
  try {
    const email = req.headers["email"];
    const reqBody = req.body;

    const data = await UserModule.updateOne(
      { email: email },
      { $set: reqBody }
    );
    if (data.matchedCount > 0) {
      return res.status(200).json({ status: "success", data: data });
    } else {
      return res.status(400).json({ status: "fail", message: "No data found" });
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.toString() });
  }
};

//! get all Profile details...............................................
export const profileDetails = async (req, res) => {
  try {
    let email = req.headers.email;
    const data = await UserModule.findOne({ email: email });
    return res.status(200).json({ status: "success", data: data });
  } catch (error) {
    return res.status(400).json({ status: "fail", error: error.toString() });
  }
};

//! Recover Verify Email ....................................
export const RecoverVerifyEmail = async (req, res) => {
  let email = req.params.email;
  let OTPCode = Math.floor(100000 + Math.random() * 900000);

  try {
    let userExists = await UserModule.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ status: "fail", data: "User not found" });
    }

    await OTPModel.create({ email: email, otp: OTPCode });

    await sendEmail(email, "Your OTP Code", `${OTPCode}`);

    return res.status(200).json({
      status: "success",
      data: " ✅ Yorr Email verify OTP code is sent Requestd! ",
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", error: error.toString() });
  }
};

// Recover Verify OTP .........................
export const RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let statusUpdate = 1;

  let OTPCount = await OTPModel.aggregate([
    { $match: { email: email, otp: OTPCode, status: status } },
    { $count: "total" },
  ]);
  if (OTPCount.length > 0) {
    let OTPUpdate = await OTPModel.updateOne(
      { email: email, otp: OTPCode, status: status },
      { email: email, otp: OTPCode, status: statusUpdate }
    );
    return res.status(200).json({ status: "success", data: OTPUpdate });
  } else {
    return res
      .status(400)
      .json({ status: "success", data: "OTP code is already used!" });
  }
};

// Recover Change Password .........................
export const RecoverResetPassword = async (req, res) => {
  const { email, OTP, password } = req.body;
  const statusUpdate = 1;

  try {
    const OTPCount = await OTPModel.aggregate([
      { $match: { email: email, otp: OTP, status: statusUpdate } },
      { $count: "total" },
    ]);

    if (OTPCount.length > 0) {
      const userUpdate = await UserModule.updateOne(
        { email: email },
        { password: password }
      );
      return res.status(200).json({ status: "success", data: userUpdate });
    } else {
      return res
        .status(400)
        .json({ status: "fail", data: "OTP code is invalid or expired!" });
    }
  } catch (error) {
    return res.status(500).json({ status: "fail", error: error.toString() });
  }
};
