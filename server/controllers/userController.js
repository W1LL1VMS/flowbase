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

module.exports = { createUser, getUsers };