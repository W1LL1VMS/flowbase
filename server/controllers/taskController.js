const prisma = require('../prisma/client');

async function createTask(req, res) {
  try {
    const { title, description, status, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Titre et projectId sont requis' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        projectId
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getTasks(req, res) {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { title, description, status }
    });

    res.json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tâche introuvable' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Tâche introuvable' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}



module.exports = { createTask, getTasks, updateTask, deleteTask };