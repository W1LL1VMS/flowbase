const prisma = require('../prisma/client');

async function createProject(req, res) {
  try {
    const { title, description, ownerId } = req.body;

    if (!title || !ownerId) {
      return res.status(400).json({ error: 'Titre et ownerId sont requis' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        ownerId
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getProjects(req, res) {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createProject, getProjects };