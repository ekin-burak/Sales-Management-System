const CustomerService = require('../services/CustomerService');
const { ValidationError, NotFoundError } = require('../utils/errors');

class CustomerController {
  async createCustomer(req, res, next) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async getCustomers(req, res, next) {
    try {
      const { page = 1, limit = 10, sort, ...filters } = req.query;
      const result = await CustomerService.getCustomers(filters, sort, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req, res, next) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async updateCustomer(req, res, next) {
    try {
      const customer = await CustomerService.updateCustomer(req.params.id, req.body);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      await CustomerService.deleteCustomer(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addNote(req, res, next) {
    try {
      const note = await CustomerService.addNote(req.params.id, req.body.content);
      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req, res, next) {
    try {
      const note = await CustomerService.updateNote(req.params.id, req.params.noteId, req.body);
      res.json(note);
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req, res, next) {
    try {
      await CustomerService.deleteNote(req.params.id, req.params.noteId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async searchCustomers(req, res, next) {
    try {
      const { query } = req.query;
      const customers = await CustomerService.searchCustomers(query);
      res.json(customers);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerController; 