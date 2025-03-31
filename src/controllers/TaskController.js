import TasksModels from "../module/TaskModule.js";

//! create Tasks..............................................
export const createTask = async (req, res) => {
  try {
    let reqBody = req.body;
    reqBody.email = req.headers.email;

    const data = await TasksModels.create(reqBody);
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(400).json({ status: "fail", data: err.message });
  }
};

//! read tasks ..............................................
export const readTasks = async (req, res) => {
  try {
    let email = req.headers["email"];
    let data = await TasksModels.find({ email: email });
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "fail", data: err.message });
  }
};

//! update tasks.........................................
export const updateTask = async (req, res) => {
  try {
    let id = req.params.id;
    let status = req.params.status;
    let Query = { _id: id };
    let reqBody = { status: status };

    let data = await TasksModels.updateOne(Query, reqBody, { new: true });
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(400).json({ status: "fail", data: err.message });
  }
};

//! Delate Task.......................................................
export let deleteTask = async (req, res) => {
  try {
    let id = req.params.id;
    let Query = { _id: id };

    let data = await TasksModels.deleteOne(Query);
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(401).json({ status: "fial", error: error.toString() });
  }
};

//! List Task By Status.........................................
export const listTaskByStatus = async (req, res) => {
  let status = req.params.status;
  let email = req.headers.email;

  try {
    let data = await TasksModels.aggregate([
      { $match: { email: email, status: status } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createDate: {
            $dateToString: { date: "$createDate", format: "%d-%m-%Y" },
          },
        },
      },
    ]);
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(500).json({ status: "fail", data: err.message });
  }
};

//! Tasks status count..........................................
export const tasksStatusCount = async (req, res) => {
  try {
    const email = req.headers.email;
    const data = await TasksModels.aggregate([
      { $match: { email: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ]);
    res.status(200).json({ status: "success", data: data });
  } catch (err) {
    res.status(400).json({ status: "fail", data: err.message });
  }
};
