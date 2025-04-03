const express = require('express');
const CustomerController = require('../controllers/CustomerController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const customerController = new CustomerController();

/**
 * @swagger
 * /customers/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the customer service is running
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'customer-service',
    timestamp: new Date().toISOString()
  });
});

// Protected routes
router.use(authenticate);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', customerController.createCustomer);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *       401:
 *         description: Unauthorized
 */
router.get('/', customerController.getCustomers);

/**
 * @swagger
 * /customers/search:
 *   get:
 *     summary: Search customers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Unauthorized
 */
router.get('/search', customerController.searchCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.get('/:id', customerController.getCustomerById);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update customer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.put('/:id', customerController.updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete customer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', customerController.deleteCustomer);

/**
 * @swagger
 * /customers/{id}/notes:
 *   post:
 *     summary: Add note to customer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.post('/:id/notes', customerController.addNote);

/**
 * @swagger
 * /customers/{id}/notes/{noteId}:
 *   put:
 *     summary: Update customer note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.put('/:id/notes/:noteId', customerController.updateNote);

/**
 * @swagger
 * /customers/{id}/notes/{noteId}:
 *   delete:
 *     summary: Delete customer note
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.delete('/:id/notes/:noteId', customerController.deleteNote);

module.exports = router; 