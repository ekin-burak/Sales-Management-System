const Sale = require('../models/Sale');
const { AppError } = require('../utils/errors');

class SaleService {
  async createSale(saleData) {
    try {
      const sale = new Sale(saleData);
      await sale.save();
      return sale;
    } catch (error) {
      throw new AppError('Error creating sale', 500);
    }
  }

  async getSaleById(id) {
    try {
      const sale = await Sale.findById(id)
        .populate('customerId', 'name email')
        .populate('userId', 'name email');
      
      if (!sale) {
        throw new AppError('Sale not found', 404);
      }
      
      return sale;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching sale', 500);
    }
  }

  async getSales(query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        customerId,
        userId,
        startDate,
        endDate
      } = query;

      const filter = {};
      if (status) filter.status = status;
      if (customerId) filter.customerId = customerId;
      if (userId) filter.userId = userId;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      const sales = await Sale.find(filter)
        .populate('customerId', 'name email')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Sale.countDocuments(filter);

      return {
        sales,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new AppError('Error fetching sales', 500);
    }
  }

  async updateSale(id, updateData) {
    try {
      const sale = await Sale.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!sale) {
        throw new AppError('Sale not found', 404);
      }

      return sale;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating sale', 500);
    }
  }

  async deleteSale(id) {
    try {
      const sale = await Sale.findByIdAndDelete(id);

      if (!sale) {
        throw new AppError('Sale not found', 404);
      }

      return sale;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting sale', 500);
    }
  }

  async getSalesByCustomer(customerId) {
    try {
      const sales = await Sale.find({ customerId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
      return sales;
    } catch (error) {
      throw new AppError('Error fetching customer sales', 500);
    }
  }

  async getSalesByUser(userId) {
    try {
      const sales = await Sale.find({ userId })
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });
      return sales;
    } catch (error) {
      throw new AppError('Error fetching user sales', 500);
    }
  }
}

module.exports = new SaleService(); 