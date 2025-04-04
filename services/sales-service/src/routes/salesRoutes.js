const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const saleController = require('../controllers/SaleController');

const router = express.Router();

// Validation middleware
const saleValidation = [
  body('customerId').isMongoId().withMessage('Invalid customer ID'),
  body('userId').isUUID().withMessage('Invalid user ID'),
  body('products').isArray().withMessage('Products must be an array'),
  body('products.*.name').notEmpty().withMessage('Product name is required'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('products.*.price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('paymentMethod').isIn(['cash', 'credit_card', 'bank_transfer']).withMessage('Invalid payment method'),
  body('status').optional().isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status')
];

/**
 * @swagger
 * /api/sales/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the sales service is running
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'sales-service',
    timestamp: new Date().toISOString()
  });
});

// Protected routes
router.use(authenticateToken);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - userId
 *               - products
 *               - totalAmount
 *               - paymentMethod
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - price
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     price:
 *                       type: number
 *                       minimum: 0
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit_card, bank_transfer]
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', saleValidation, saleController.createSale);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales
 *       401:
 *         description: Unauthorized
 */
router.get('/', saleController.getSales);

/**
 * @swagger
 * /api/sales/{id}:
 *   get:
 *     summary: Get sale by ID
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
 *         description: Sale details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 */
router.get('/:id', saleController.getSaleById);

/**
 * @swagger
 * /api/sales/{id}:
 *   put:
 *     summary: Update sale
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
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     price:
 *                       type: number
 *                       minimum: 0
 *               totalAmount:
 *                 type: number
 *                 minimum: 0
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit_card, bank_transfer]
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *     responses:
 *       200:
 *         description: Sale updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 */
router.put('/:id', saleValidation, saleController.updateSale);

/**
 * @swagger
 * /api/sales/{id}:
 *   delete:
 *     summary: Delete sale
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
 *         description: Sale deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sale not found
 */
router.delete('/:id', saleController.deleteSale);

/**
 * @swagger
 * /api/sales/customer/{customerId}:
 *   get:
 *     summary: Get sales by customer ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sales for the customer
 *       401:
 *         description: Unauthorized
 */
router.get('/customer/:customerId', saleController.getSalesByCustomer);

/**
 * @swagger
 * /api/sales/user/{userId}:
 *   get:
 *     summary: Get sales by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sales by the user
 *       401:
 *         description: Unauthorized
 */
router.get('/user/:userId', saleController.getSalesByUser);

module.exports = router; 