const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort = '-createdAt', page = 1, limit = 50 } = req.query;

    const query = { createdBy: req.user._id };

    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name color')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, data: tasks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id })
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name color')
      .populate('comments.user', 'name avatar');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    const populated = await task.populate('assignedTo', 'name email avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { createdBy, _id, __v, ...safeBody } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      safeBody,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'name color');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (for kanban drag-drop)
// @route   PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { status },
      { new: true }
    ).populate('assignedTo', 'name email avatar');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
const addComment = async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ success: false, message: 'Comment text is required' });

    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    task.comments.push({ user: req.user._id, text });
    await task.save();
    await task.populate('comments.user', 'name avatar');

    res.status(201).json({ success: true, data: task.comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, completed, pending, overdue, recentCompleted, weeklyData] = await Promise.all([
      Task.countDocuments({ createdBy: userId }),
      Task.countDocuments({ createdBy: userId, status: 'completed' }),
      Task.countDocuments({ createdBy: userId, status: { $in: ['todo', 'in-progress'] } }),
      Task.countDocuments({ createdBy: userId, status: { $ne: 'completed' }, dueDate: { $lt: now } }),
      Task.countDocuments({ createdBy: userId, status: 'completed', completedAt: { $gte: weekAgo } }),
      Task.aggregate([
        { $match: { createdBy: userId, createdAt: { $gte: weekAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            created: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const priorityBreakdown = await Task.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const categoryBreakdown = await Task.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const recentTasks = await Task.find({ createdBy: userId })
      .sort('-updatedAt')
      .limit(5)
      .populate('assignedTo', 'name avatar');

    res.json({
      success: true,
      data: {
        overview: { total, completed, pending, overdue, recentCompleted },
        weeklyData,
        priorityBreakdown,
        categoryBreakdown,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus, addComment, getStats };
