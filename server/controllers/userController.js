const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');

async function createUser(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, mot de passe et nom sont requis' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email, password, name } = req.body;

    const data = { email, name };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createUser, getUsers, updateUser, deleteUser };