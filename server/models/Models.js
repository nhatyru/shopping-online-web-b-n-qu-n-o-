const mongoose = require('mongoose');

// Schemas
const AdminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false }
);

const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  { versionKey: false }
);

const CustomerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    fullName: String,
    phone: String,
    email: String,
    address: {
      street: String,
      ward: String,
      district: String,
      city: String,
    },
    active: Number,
    token: String,
  },
  { versionKey: false }
);

const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    cdate: Number,
    category: CategorySchema,
  },
  { versionKey: false }
);

const ItemSchema = mongoose.Schema(
  {
    product: ProductSchema,
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    size: {
      type: String,
      enum: ['S', 'M', 'L', 'XL'],
    },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const OrderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    createdAt: Number,
    expiredAt: Number,
    total: Number,
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipping', 'Completed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'BANK'],
      default: 'COD',
    },
    paymentConfirmedAt: Number,
    paymentMeta: {
      qrUrl: String,
      transferContent: String,
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    customer: CustomerSchema,
    items: [ItemSchema],
  },
  { versionKey: false }
);

// Models
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = {
  Admin,
  Category,
  Customer,
  Product,
  Order,
};


 