import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: String },
    password: { type: String },
    photo: { type: String },
    createDate: { type: Date, default: new Date() },
  },
  { timestamps: true, versionKey: false }
);

const UserModule = mongoose.model("users", DataSchema);

export default UserModule;
