import mongoose from "mongoose";

const OTPSchema = mongoose.Schema(
  {
    email: { type: String },
    otp: { type: String },
    status: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now() },
  },
  { timestamps: true },
  { versionKey: false }
);

const OTPModel = mongoose.model("otps", OTPSchema);
export default OTPModel;
