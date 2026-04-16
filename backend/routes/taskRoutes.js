const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getAllTasks } = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/admin/all', authorize('admin'), getAllTasks);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;