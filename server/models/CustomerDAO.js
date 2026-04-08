const mongoose = require('mongoose');
require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },

  // ✅ thêm
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  async insert(customer) {
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },

  async active(id, token, active) {
    const query = { _id: id, token: token };
    const update = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, update);
    return result;
  },

  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      fullName: customer.fullName || customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address || {
        street: '',
        ward: '',
        district: '',
        city: ''
      }
    };

    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      { new: true }
    );

    return result;
  }
};

module.exports = CustomerDAO;