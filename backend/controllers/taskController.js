const Task = require('../models/Task');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/v1/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // Only fetch tasks that belong to the user making the request
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      user: req.user.id, // Attach the logged-in user's ID to the task
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Ensure the logged-in user is the actual owner of the task (or an admin)
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      return next(new Error('User not authorized to update this task'));
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true,
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Ensure the logged-in user is the actual owner of the task (or an admin)
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      return next(new Error('User not authorized to delete this task'));
    }

    await task.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async(req, res, next) => {
    try{
        const tasks = await Task.find({}).populate('user', 'name email');
        res.status(200).json({success: true, count: tasks.length, data: tasks});  
    } catch(error) {
        next(error);
    }
}

module.exports = { getTasks, createTask, updateTask, deleteTask, getAllTasks };