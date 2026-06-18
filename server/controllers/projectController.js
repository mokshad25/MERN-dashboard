const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort('-createdAt');
    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const taskCount = await Task.countDocuments({ project: p._id });
        const completedCount = await Task.countDocuments({ project: p._id, status: 'completed' });
        return { ...p.toObject(), taskCount, completedCount };
      })
    );
    res.json({ success: true, data: projectsWithCounts });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { owner, _id, __v, ...safeBody } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      safeBody,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    await Task.updateMany({ project: req.params.id }, { project: null });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
