import mongoose from "mongoose";

import UserModule from "../module/UserModule.js";
import jwt from "jsonwebtoken";

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
    const ID = new mongoose.Types.ObjectId(req.params["ID"]);
    const reqBody = req.body;

    const data = await UserModule.updateOne(
      { email: email, _id: ID },
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
