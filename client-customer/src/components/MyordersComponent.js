import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { Card, CardHeader } from './ui/Card';
import { PageSpinner } from './ui/PageSpinner';
import { getCustomerOrders } from '../services/api';

class Myorders extends Component {
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
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    } else {
      this.setState({ loading: false });
    }
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  async apiGetOrdersByCustID(cid) {
    try {
      const orders = await getCustomerOrders(cid, this.context.token);
      this.setState({ orders, loading: false });
    } catch (error) {
      this.setState({ orders: [], loading: false });
    }
  }

  render() {
    if (this.context.token === '') {
      return <Navigate replace to="/login" />;
    }

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
          {new Date(item.createdAt || item.cdate).toLocaleString()}
        </td>
        <td className="px-4 py-3 text-sm">{item.customer.fullName || item.customer.name}</td>
        <td className="px-4 py-3 text-sm text-neutral-600">{item.customer.phone}</td>
        <td className="px-4 py-3 text-sm font-medium tabular-nums">{item.total}</td>
        <td className="px-4 py-3 text-sm">{item.paymentMethod || 'COD'}</td>
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
        <tr key={`${item.productId || item.product?._id || index}-${item.size || 'NA'}`} className="border-b border-neutral-100">
          <td className="px-4 py-3 text-sm">{index + 1}</td>
          <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item.productId || item.product?._id}</td>
          <td className="px-4 py-3 text-sm font-medium">{item.name || item.product?.name}</td>
          <td className="px-4 py-3">
            <img
              src={'data:image/jpg;base64,' + item.product?.image}
              alt=""
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-neutral-200"
            />
          </td>
          <td className="px-4 py-3 tabular-nums text-sm">{item.price || item.product?.price}</td>
          <td className="px-4 py-3 tabular-nums text-sm">{item.quantity}</td>
          <td className="px-4 py-3 tabular-nums text-sm">{item.size || '-'}</td>
          <td className="px-4 py-3 font-medium tabular-nums text-sm">
            {(item.price || item.product?.price || 0) * item.quantity}
          </td>
        </tr>
      ));
    }

    return (
      <div className="mx-auto max-w-6xl space-y-10 py-4">
        <Card>
          <CardHeader title="Your orders" subtitle="Select a row to view line items." />
          {this.state.orders.length === 0 ? (
            <p className="py-12 text-center text-sm text-neutral-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
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
                    <th className="px-4 py-3 font-medium">Size</th>
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

export default Myorders;
