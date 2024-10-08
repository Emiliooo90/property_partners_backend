const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
    });

    // Log the tasks for debugging
    console.log('Fetched Tasks:', tasks);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user.id,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id), userId: req.user.id },
      data: { title, description },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: parseInt(id), userId: req.user.id },
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

exports.completeTask = async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to complete task with ID: ${id}`); // Debug log

  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id), userId: req.user.id },
      data: { completed: true },
    });

    console.log('Completed Task:', task); // Debug log
    res.json(task);
  } catch (error) {
    console.error('Error completing task:', error); // Debug log
    res.status(500).json({ message: 'Error completing task' });
  }
};

