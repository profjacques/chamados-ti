const express = require('express');
const dashboard = require('../controllers/dashboardController');
const tickets = require('../controllers/ticketController');
const comments = require('../controllers/commentController');
const technicians = require('../controllers/technicianController');
const categories = require('../controllers/categoryController');

const router = express.Router();

// Dashboard
router.get('/', dashboard.index);

// Chamados
router.get('/tickets', tickets.index);
router.get('/tickets/new', tickets.new);
router.post('/tickets', tickets.create);
router.get('/tickets/:id', tickets.show);
router.get('/tickets/:id/edit', tickets.edit);
router.put('/tickets/:id', tickets.update);
router.patch('/tickets/:id/quick', tickets.quickUpdate);
router.delete('/tickets/:id', tickets.destroy);
router.post('/tickets/:id/comments', comments.create);

// Técnicos
router.get('/technicians', technicians.index);
router.get('/technicians/new', technicians.new);
router.post('/technicians', technicians.create);
router.get('/technicians/:id/edit', technicians.edit);
router.put('/technicians/:id', technicians.update);
router.delete('/technicians/:id', technicians.destroy);

// Categorias
router.get('/categories', categories.index);
router.get('/categories/new', categories.new);
router.post('/categories', categories.create);
router.get('/categories/:id/edit', categories.edit);
router.put('/categories/:id', categories.update);
router.delete('/categories/:id', categories.destroy);

module.exports = router;
