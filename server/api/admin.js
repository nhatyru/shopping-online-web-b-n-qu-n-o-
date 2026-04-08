const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil'); // ✅ thêm

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');
const Models = require('../models/Models');

// ======================= STATS (DASHBOARD) =======================

router.get('/stats', JwtUtil.checkToken, async function (req, res) {
  const [products, categories, orders, customers] = await Promise.all([
    ProductDAO.selectByCount(),
    Models.Category.countDocuments({}).exec(),
    Models.Order.countDocuments({}).exec(),
    Models.Customer.countDocuments({}).exec(),
  ]);
  res.json({ products, categories, orders, customers });
});

// ======================= PRODUCT =======================

router.get('/products', JwtUtil.checkToken, async function (req, res) {
  const noProducts = await ProductDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(noProducts / sizePage);

  let curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);

  const skip = (curPage - 1) * sizePage;
  const products = await ProductDAO.selectBySkipLimit(skip, sizePage);

  res.json({ products, noPages, curPage });
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const { name, price, category: cid, image } = req.body;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);
  const product = { name, price, image, cdate: now, category };

  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const { name, price, category: cid, image } = req.body;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);
  const product = { _id, name, price, image, cdate: now, category };

  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// ======================= CATEGORY =======================

router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const result = await CategoryDAO.insert({ name: req.body.name });
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CategoryDAO.update({
    _id: req.params.id,
    name: req.body.name
  });
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CategoryDAO.delete(req.params.id);
  res.json(result);
});

// ======================= CUSTOMER =======================

router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// deactive
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CustomerDAO.active(
    req.params.id,
    req.body.token,
    0
  );
  res.json(result);
});

// ✅ send mail
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);

  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// ======================= ORDER =======================

router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectByCustID(req.params.cid);
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await OrderDAO.update(req.params.id, req.body.status);
  res.json(result);
});

// ======================= AUTH =======================

router.post('/login', async function (req, res) {
  const { username, password } = req.body;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({ success: true, message: 'Authentication successful', token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token });
});

module.exports = router;