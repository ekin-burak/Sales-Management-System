const saleService = require('../services/SaleService');
const { validationResult } = require('express-validator');

class SaleController {
  async createSale(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sale = await saleService.createSale(req.body);
      res.status(201).json(sale);
    } catch (error) {
      next(error);
    }
  }

  async getSaleById(req, res, next) {
    try {
      const sale = await saleService.getSaleById(req.params.id);
      res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async getSales(req, res, next) {
    try {
      const result = await saleService.getSales(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateSale(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sale = await saleService.updateSale(req.params.id, req.body);
      res.json(sale);
    } catch (error) {
      next(error);
    }
  }

  async deleteSale(req, res, next) {
    try {
      const result = await saleService.deleteSale(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSalesByCustomer(req, res, next) {
    try {
      const sales = await saleService.getSalesByCustomer(req.params.customerId);
      res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  async getSalesByUser(req, res, next) {
    try {
      const sales = await saleService.getSalesByUser(req.params.userId);
      res.json(sales);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaleController(); 