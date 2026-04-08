import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Modal } from './ui/Modal';

class Mycart extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { checkoutOpen: false };
  }

  lnkRemoveClick(id) {
    const mycart = this.context.mycart;

    const index = mycart.findIndex((x) => x.product._id === id);

    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    this.setState({ checkoutOpen: true });
  }

  confirmCheckout() {
    this.setState({ checkoutOpen: false });

    if (this.context.mycart.length > 0) {
      const total = CartUtil.getTotal(this.context.mycart);
      const items = this.context.mycart;
      const customer = this.context.customer;

      if (customer) {
        this.apiCheckout(total, items, customer);
      } else {
        this.props.navigate('/login');
      }
    } else {
      alert('Your cart is empty');
    }
  }

  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };

    const config = {
      headers: { 'x-access-token': this.context.token },
    };

    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;

      if (result) {
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Checkout failed. Please try again.');
      }
    });
  }

  render() {
    const mycart = this.context.mycart;

    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <Modal
          open={this.state.checkoutOpen}
          onClose={() => this.setState({ checkoutOpen: false })}
          title="Complete order?"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => this.setState({ checkoutOpen: false })}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="button" onClick={() => this.confirmCheckout()}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-sm text-neutral-600">
            We will place your order with the items in your bag. You can still cancel from
            this dialog.
          </p>
        </Modal>

        <Card>
          <CardHeader
            title="Shopping bag"
            subtitle={mycart.length ? `${mycart.length} items` : 'Your bag is empty'}
          />

          {mycart.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-500">Add pieces you love — they will appear here.</p>
              <Button
                variant="primary"
                className="mt-8"
                type="button"
                onClick={() => this.props.navigate('/home')}
              >
                Continue shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-neutral-200">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Qty</th>
                      <th className="px-4 py-3 font-medium">Subtotal</th>
                      <th className="px-4 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {mycart.map((item, index) => (
                      <tr key={item.product._id} className="transition-colors hover:bg-neutral-50/80">
                        <td className="px-4 py-4 text-neutral-500">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={'data:image/jpg;base64,' + item.product.image}
                              alt=""
                              className="h-14 w-14 rounded-lg object-cover ring-1 ring-neutral-200"
                            />
                            <span className="font-medium text-black">{item.product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-neutral-600">
                          {item.product.category?.name}
                        </td>
                        <td className="px-4 py-4 tabular-nums text-neutral-700">
                          {item.product.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 tabular-nums">{item.quantity}</td>
                        <td className="px-4 py-4 font-medium tabular-nums text-black">
                          {(item.product.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => this.lnkRemoveClick(item.product._id)}
                            className="text-xs font-medium uppercase tracking-wider text-neutral-500 underline-offset-4 transition-colors hover:text-black hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 flex flex-col items-end gap-4 border-t border-neutral-100 pt-8 sm:flex-row sm:justify-end">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-neutral-500">Total</p>
                  <p className="text-2xl font-semibold tabular-nums text-black">
                    {CartUtil.getTotal(mycart).toLocaleString()}{' '}
                    <span className="text-sm font-normal text-neutral-400">VND</span>
                  </p>
                </div>
                <Button type="button" variant="primary" size="lg" onClick={() => this.lnkCheckoutClick()}>
                  Checkout
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }
}

export default withRouter(Mycart);
