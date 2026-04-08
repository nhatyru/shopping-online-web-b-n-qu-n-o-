require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {

  async insert(order) {
    const mongoose = require('mongoose');

    order._id = new mongoose.Types.ObjectId();

    const result = await Models.Order.create(order);

    return result;
  },

  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },

  async selectByID(_id) {
    const order = await Models.Order.findById(_id).exec();
    return order;
  },

  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // giảm dần theo ngày tạo
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(
      _id,
      newvalues,
      { new: true }
    );
    return result;
  },

  async markAsPaid(_id, now) {
    const query = {
      _id,
      paymentMethod: 'BANK',
      expiredAt: { $gt: now },
      status: 'Pending',
    };
    const update = {
      status: 'Paid',
      paymentConfirmedAt: now,
    };
    const result = await Models.Order.findOneAndUpdate(query, update, { new: true }).exec();
    return result;
  }

};

module.exports = OrderDAO;