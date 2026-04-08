require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CategoryDAO = {
  async selectAll() {
    return await Models.Category.find({}).exec();
  },

  
  async selectByID(_id) {
    const category = await Models.Category.findById(_id).exec();
    return category;
  },

  async insert(category) {
    category._id = new mongoose.Types.ObjectId();
    return await Models.Category.create(category);
  },

  async update(category) {
    const newvalues = { name: category.name };
    return await Models.Category.findByIdAndUpdate(
      category._id,
      newvalues,
      { new: true }
    );
  },

  async delete(_id) {
    return await Models.Category.findByIdAndDelete(_id);
  }
};

module.exports = CategoryDAO;
