require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const ProductDAO = {

  // ✅ COUNT PRODUCTS
  async selectByCount() {
    const query = {};
    const noProducts = await Models.Product.countDocuments(query).exec();
    return noProducts;
  },

  // ✅ PAGINATION
  async selectBySkipLimit(skip, limit) {
    const products = await Models.Product.find({})
      .skip(skip)
      .limit(limit)
      .exec();
    return products;
  },

  // ✅ SELECT BY ID
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  // ✅ INSERT PRODUCT
  async insert(product) {
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  // ✅ UPDATE PRODUCT
  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };

    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true }
    );

    return result;
  },

  // ✅ DELETE PRODUCT
  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  },

  // ✅ SELECT TOP NEW PRODUCTS
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 };
    const products = await Models.Product.find(query)
      .sort(mysort)
      .limit(top)
      .exec();
    return products;
  },

  // ✅ SELECT TOP HOT PRODUCTS
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product._id',
          sum: { $sum: '$items.quantity' }
        }
      },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]).exec();

    const products = [];
    for (const item of items) {
      const product = await this.selectByID(item._id);
      if (product) products.push(product);
    }

    return products;
  },

  // ✅ SELECT PRODUCTS BY CATEGORY ID
  async selectByCatID(_cid) {
    const query = { 'category._id': _cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // ✅ SEARCH BY KEYWORD
  async selectByKeyword(keyword) {
    const query = {
      name: { $regex: new RegExp(keyword, 'i') }
    };
    const products = await Models.Product.find(query).exec();
    return products;
  }

};

module.exports = ProductDAO;