const Customer = require('../models/Customer');
const { ValidationError, NotFoundError } = require('../utils/errors');

class CustomerService {
  async createCustomer(customerData) {
    try {
      const existingCustomer = await Customer.findOne({ email: customerData.email });
      if (existingCustomer) {
        throw new ValidationError('Email already exists');
      }

      const customer = new Customer(customerData);
      return await customer.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }

  async getCustomers(filters = {}, sort = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const customers = await Customer.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Customer.countDocuments(filters);
    
    return {
      customers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getCustomerById(id) {
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return customer;
  }

  async updateCustomer(id, updateData) {
    const customer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    
    return customer;
  }

  async deleteCustomer(id) {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }
    return true;
  }

  async addNote(id, noteContent) {
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    customer.notes.push({
      content: noteContent,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return await customer.save();
  }

  async updateNote(id, noteId, noteContent) {
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const note = customer.notes.id(noteId);
    if (!note) {
      throw new NotFoundError('Note not found');
    }

    note.content = noteContent;
    note.updatedAt = new Date();

    return await customer.save();
  }

  async deleteNote(id, noteId) {
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const note = customer.notes.id(noteId);
    if (!note) {
      throw new NotFoundError('Note not found');
    }

    note.remove();
    return await customer.save();
  }

  async searchCustomers(query) {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    
    return customers;
  }
}

module.exports = new CustomerService(); 