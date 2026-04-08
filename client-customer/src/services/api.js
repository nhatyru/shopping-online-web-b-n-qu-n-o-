import axios from 'axios';

const api = axios.create({
  baseURL: '/api/customer',
});

function getAuthConfig(token) {
  return token ? { headers: { 'x-access-token': token } } : {};
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function getProductsByCategory(cid) {
  const res = await api.get(`/products/category/${cid}`);
  return res.data;
}

export async function getProductsByKeyword(keyword) {
  const res = await api.get(`/products/search/${encodeURIComponent(keyword)}`);
  return res.data;
}

export async function loginCustomer(account) {
  const res = await api.post('/login', account);
  return res.data;
}

export async function signupCustomer(account) {
  const res = await api.post('/signup', account);
  return res.data;
}

export async function updateCustomerProfile(id, customer, token) {
  const res = await api.put(`/customers/${id}`, customer, getAuthConfig(token));
  return res.data;
}

export async function getCustomerOrders(cid, token) {
  const res = await api.get(`/orders/customer/${cid}`, getAuthConfig(token));
  return res.data;
}

export async function checkoutOrder(payload, token) {
  const res = await api.post('/checkout', payload, getAuthConfig(token));
  return res.data;
}

export async function confirmBankTransfer(orderId, token) {
  const res = await api.post(`/orders/${orderId}/confirm-transfer`, {}, getAuthConfig(token));
  return res.data;
}
