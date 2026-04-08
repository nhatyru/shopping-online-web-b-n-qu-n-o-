import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Card, CardHeader } from './ui/Card';
import { PageSpinner } from './ui/PageSpinner';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      this.setState({ customers: res.data, loading: false });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = {
      headers: { 'x-access-token': this.context.token },
    };

    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      } else {
        alert('Could not deactivate');
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = {
      headers: { 'x-access-token': this.context.token },
    };

    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      alert(res.data.message);
    });
  }

  render() {
    if (this.state.loading) {
      return <PageSpinner label="Loading customers…" />;
    }

    const customers = this.state.customers.map((item) => (
      <tr
        key={item._id}
        className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50"
        onClick={() => this.trCustomerClick(item)}
      >
        <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item._id}</td>
        <td className="px-4 py-3 text-sm">{item.username}</td>
        <td className="px-4 py-3 text-sm text-neutral-500">{item.password}</td>
        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
        <td className="px-4 py-3 text-sm text-neutral-600">{item.phone}</td>
        <td className="px-4 py-3 text-sm text-neutral-600">{item.email}</td>
        <td className="px-4 py-3 text-sm tabular-nums">{item.active}</td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          {item.active === 0 ? (
            <button
              type="button"
              onClick={() => this.lnkEmailClick(item)}
              className="text-xs font-semibold uppercase tracking-wider text-black underline-offset-4 hover:underline"
            >
              Email
            </button>
          ) : (
            <button
              type="button"
              onClick={() => this.lnkDeactiveClick(item)}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 underline-offset-4 hover:text-black hover:underline"
            >
              Deactivate
            </button>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr
        key={item._id}
        className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50"
        onClick={() => this.trOrderClick(item)}
      >
        <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item._id}</td>
        <td className="px-4 py-3 text-sm text-neutral-700">
          {new Date(item.cdate).toLocaleString()}
        </td>
        <td className="px-4 py-3 text-sm">{item.customer.name}</td>
        <td className="px-4 py-3 text-sm text-neutral-600">{item.customer.phone}</td>
        <td className="px-4 py-3 text-sm font-medium tabular-nums">{item.total}</td>
        <td className="px-4 py-3">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-neutral-700">
            {item.status}
          </span>
        </td>
      </tr>
    ));

    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => (
        <tr key={item.product._id} className="border-b border-neutral-100">
          <td className="px-4 py-3 text-sm">{index + 1}</td>
          <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item.product._id}</td>
          <td className="px-4 py-3 text-sm font-medium">{item.product.name}</td>
          <td className="px-4 py-3">
            <img
              src={'data:image/jpg;base64,' + item.product.image}
              alt=""
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-neutral-200"
            />
          </td>
          <td className="px-4 py-3 tabular-nums text-sm">{item.product.price}</td>
          <td className="px-4 py-3 tabular-nums text-sm">{item.quantity}</td>
          <td className="px-4 py-3 font-medium tabular-nums text-sm">
            {item.product.price * item.quantity}
          </td>
        </tr>
      ));
    }

    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Customers</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Select a customer to load their orders. Use actions without propagating row selection.
          </p>
        </div>

        <Card>
          <CardHeader title="Customer directory" />
          {this.state.customers.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">No customers yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Username</th>
                    <th className="px-4 py-3 font-medium">Password</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Active</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>{customers}</tbody>
              </table>
            </div>
          )}
        </Card>

        {this.state.orders.length > 0 && (
          <Card>
            <CardHeader title="Customer orders" />
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          </Card>
        )}

        {this.state.order && (
          <Card>
            <CardHeader title="Order detail" />
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Product ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Image</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    );
  }
}

export default Customer;
