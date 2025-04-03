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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
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