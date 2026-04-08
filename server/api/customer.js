const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');

const VALID_SIZES = ['S', 'M', 'L', 'XL'];
const VALID_PAYMENT_METHODS = ['COD', 'BANK'];

function sanitizeText(value) {
  return (value || '').toString().trim();
}

function parsePositiveNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function buildVietQrUrl({ amount, content }) {
  const bankCode = '970436';
  const accountNumber = '1020369856';
  const accountName = 'Nguyen Hoang Nhat';
  const qrContent = encodeURIComponent(content);
  const qrAccountName = encodeURIComponent(accountName);
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${qrContent}&accountName=${qrAccountName}`;
}


// ================= CATEGORY =================

router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});


// ================= PRODUCT =================

// NEW PRODUCTS
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

// HOT PRODUCTS
router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

// PRODUCTS BY CATEGORY
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});

// SEARCH PRODUCTS
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

// PRODUCT DETAIL
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});


// ================= CUSTOMER =================

// SIGNUP
router.post('/signup', async function (req, res) {

  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  }
  else {

    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());

    const newCust = {
      username: username,
      password: password,
      name: name,
      fullName: name,
      phone: phone,
      email: email,
      address: {
        street: '',
        ward: '',
        district: '',
        city: ''
      },
      active: 0,
      token: token
    };

    const result = await CustomerDAO.insert(newCust);

    if (result) {

      const send = await EmailUtil.send(email, result._id, token);

      if (send)
        res.json({ success: true, message: 'Please check email' });
      else
        res.json({ success: false, message: 'Email failure' });

    }
    else {
      res.json({ success: false, message: 'Insert failure' });
    }

  }
});


// ACTIVE ACCOUNT
router.post('/active', async function (req, res) {

  const _id = req.body.id;
  const token = req.body.token;

  const result = await CustomerDAO.active(_id, token, 1);

  res.json(result);

});


// LOGIN
router.post('/login', async function (req, res) {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

    if (customer) {

      if (customer.active === 1) {

        const token = JwtUtil.genToken();

        res.json({
          success: true,
          message: "Authentication successful",
          token: token,
          customer: customer
        });

      }
      else {
        res.json({ success: false, message: "Account is deactive" });
      }

    }
    else {
      res.json({ success: false, message: "Incorrect username or password" });
    }

  }
  else {
    res.json({ success: false, message: "Please input username and password" });
  }

});


// CHECK TOKEN
router.get('/token', JwtUtil.checkToken, function (req, res) {

  const token = req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });

});


// ================= PROFILE =================

// UPDATE PROFILE
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {

  const _id = req.params.id;

  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const fullName = sanitizeText(req.body.fullName || req.body.name);
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address || {};

  if (!username || !password || !fullName || !phone || !email) {
    return res.status(400).json({ success: false, message: 'Please complete all required profile fields.' });
  }

  const customer = {
    _id: _id,
    username: username,
    password: password,
    name: fullName,
    fullName: fullName,
    phone: phone,
    email: email,
    address: {
      street: sanitizeText(address.street),
      ward: sanitizeText(address.ward),
      district: sanitizeText(address.district),
      city: sanitizeText(address.city),
    }
  };

  const result = await CustomerDAO.update(customer);

  res.json(result);

});


// ================= MY CART =================

// CHECKOUT
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const now = Date.now();
  const total = parsePositiveNumber(req.body.total);
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const customer = req.body.customer;
  const paymentMethod = sanitizeText(req.body.paymentMethod || 'COD').toUpperCase();

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: 'Invalid payment method.' });
  }
  if (!customer || !customer._id) {
    return res.status(400).json({ success: false, message: 'Invalid customer.' });
  }
  if (!items.length) {
    return res.status(400).json({ success: false, message: 'Cannot place order with empty cart.' });
  }
  if (!total) {
    return res.status(400).json({ success: false, message: 'Invalid total amount.' });
  }

  const normalizedItems = items.map((item) => {
    const product = item.product || {};
    const quantity = parsePositiveNumber(item.quantity);
    const productId = product._id || item.productId;
    const price = parsePositiveNumber(item.price || product.price);
    const name = sanitizeText(item.name || product.name);
    const size = sanitizeText(item.size).toUpperCase();

    if (!productId || !quantity || !price || !name || !VALID_SIZES.includes(size)) {
      return null;
    }

    return {
      product: product,
      productId: productId,
      name: name,
      price: price,
      quantity: quantity,
      size: size,
    };
  });

  if (normalizedItems.some((x) => x === null)) {
    return res.status(400).json({ success: false, message: 'Invalid cart items.' });
  }

  const totalFromItems = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (Math.abs(totalFromItems - total) > 1) {
    return res.status(400).json({ success: false, message: 'Total does not match cart items.' });
  }

  const normalizedCustomer = {
    _id: customer._id,
    username: customer.username,
    name: customer.fullName || customer.name,
    fullName: customer.fullName || customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address || {},
  };

  const order = {
    cdate: now,
    createdAt: now,
    total: totalFromItems,
    status: 'Pending',
    paymentMethod: paymentMethod,
    customer: normalizedCustomer,
    items: normalizedItems,
  };

  if (paymentMethod === 'BANK') {
    const expiredAt = now + 10 * 60 * 1000;
    order.expiredAt = expiredAt;
    order.paymentMeta = {
      bankName: 'Vietcombank',
      accountNumber: '1020369856',
      accountName: 'Nguyen Hoang Nhat',
    };
  }

  const result = await OrderDAO.insert(order);
  if (!result) {
    return res.status(500).json({ success: false, message: 'Checkout failed.' });
  }

  if (paymentMethod === 'BANK') {
    const transferContent = result._id.toString();
    const qrUrl = buildVietQrUrl({ amount: totalFromItems, content: transferContent });
    result.paymentMeta = {
      ...result.paymentMeta,
      transferContent,
      qrUrl,
    };
    await result.save();
  }

  return res.json({
    success: true,
    order: result,
  });

});

router.post('/orders/:id/confirm-transfer', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const now = Date.now();
  const order = await OrderDAO.selectByID(_id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  if (order.paymentMethod !== 'BANK') {
    return res.status(400).json({ success: false, message: 'Order does not use bank transfer.' });
  }
  if (order.status !== 'Pending') {
    return res.status(400).json({ success: false, message: 'Order is already processed.' });
  }
  if (!order.expiredAt || now >= order.expiredAt) {
    return res.status(400).json({ success: false, message: 'Payment QR has expired. Please place a new order.' });
  }

  const updated = await OrderDAO.markAsPaid(_id, now);
  if (!updated) {
    return res.status(400).json({ success: false, message: 'Unable to confirm payment. Please retry.' });
  }

  return res.json({ success: true, order: updated });
});

// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

module.exports = router;