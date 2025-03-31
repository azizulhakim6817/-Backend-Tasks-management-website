import mongoose from "mongoose";

const DataSchema = mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    status: { type: String },
    email: { type: String },
    createDate: { type: Date, default: Date.now() },
  },
  { timestamps: true },
  { versionKey: false }
);

const TasksModel = mongoose.model("tasks", DataSchema);

export default TasksModel;
