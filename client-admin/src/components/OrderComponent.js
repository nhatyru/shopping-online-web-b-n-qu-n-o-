import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Card, CardHeader } from './ui/Card';
import { PageSpinner } from './ui/PageSpinner';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      this.setState({ orders: res.data, loading: false });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetOrders();
      } else {
        alert('Could not update order');
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <PageSpinner label="Loading orders…" />;
    }

    const orders = this.state.orders.map((item) => (
      <tr
        key={item._id}
        className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50"
        onClick={() => this.trItemClick(item)}
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
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          {item.status === 'PENDING' ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => this.lnkApproveClick(item._id)}
                className="text-xs font-semibold uppercase tracking-wider text-black underline-offset-4 hover:underline"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => this.lnkCancelClick(item._id)}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500 underline-offset-4 hover:text-black hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <span className="text-xs text-neutral-400">—</span>
          )}
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
          <h1 className="text-3xl font-semibold tracking-tight text-black">Orders</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Review and update fulfillment status. Select a row for line items.
          </p>
        </div>

        <Card>
          <CardHeader title="All orders" />
          {this.state.orders.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          )}
        </Card>

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

export default Order;
