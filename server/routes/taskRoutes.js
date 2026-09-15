const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;