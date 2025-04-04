const { Sale } = require('../models/Sale');
const Customer = require('../models/Customer');
const { AppError } = require('../utils/errors');

class SaleService {
  async createSale(saleData) {
    try {
      const sale = new Sale(saleData);
      await sale.save();
      return sale;
    } catch (error) {
      console.error('Sale creation error:', error);
      throw new AppError('Error creating sale', 500);
    }
  }

  async getSaleById(id) {
    try {
      // First, get the sale without population
      const sale = await Sale.findById(id);
      
      if (!sale) {
        throw new AppError('Sale not found', 404);
      }
      
      // Then, try to populate customer data if available
      try {
        const customer = await Customer.findById(sale.customerId);
        if (customer) {
          // If customer exists, add the customer data to the sale
          const saleObj = sale.toObject();
          saleObj.customerId = {
            _id: customer._id,
            name: customer.name,
            email: customer.email
          };
          return saleObj;
        }
      } catch (error) {
        console.error('Error populating customer:', error);
      }
      
      return sale.toObject();
    } catch (error) {
      console.error('Error in getSaleById:', error);
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
        if (endDate) filter.createdAt.$lle = new Date(endDate);
      }

      // First, get the sales without population
      const sales = await Sale.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      // Then, try to populate customer data if available
      const populatedSales = await Promise.all(sales.map(async (sale) => {
        try {
          // Try to find the customer
          const customer = await Customer.findById(sale.customerId);
          if (customer) {
            // If customer exists, add the customer data to the sale
            const saleObj = sale.toObject();
            saleObj.customerId = {
              _id: customer._id,
              name: customer.name,
              email: customer.email
            };
            return saleObj;
          }
          return sale.toObject();
        } catch (error) {
          console.error('Error populating customer:', error);
          return sale.toObject();
        }
      }));

      const total = await Sale.countDocuments(filter);

      return {
        sales: populatedSales,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error in getSales:', error);
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