const mongoose = require('mongoose');

const SaleStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const saleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit_card', 'bank_transfer']
  },
  status: {
    type: String,
    enum: Object.values(SaleStatus),
    default: SaleStatus.PENDING
  }
}, {
  timestamps: true
});

// Indexes for better query performance
saleSchema.index({ customerId: 1, createdAt: -1 });
saleSchema.index({ userId: 1, createdAt: -1 });
saleSchema.index({ status: 1 });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = { Sale, SaleStatus }; 