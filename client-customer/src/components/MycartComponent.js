import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Modal } from './ui/Modal';
import { checkoutOrder, confirmBankTransfer } from '../services/api';

class Mycart extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      checkoutOpen: false,
      paymentMethod: 'COD',
      processing: false,
      checkoutError: '',
      checkoutSuccess: '',
      bankOrder: null,
      secondsLeft: 0,
      confirmingTransfer: false,
    };
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
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
    this.setState({ checkoutOpen: true, checkoutError: '', checkoutSuccess: '' });
  }

  async confirmCheckout() {
    if (this.context.mycart.length > 0) {
      const total = CartUtil.getTotal(this.context.mycart);
      const items = this.context.mycart;
      const customer = this.context.customer;

      if (customer) {
        await this.apiCheckout(total, items, customer);
      } else {
        this.props.navigate('/login');
      }
    } else {
      this.setState({ checkoutError: 'Your cart is empty.' });
    }
  }

  startCountdown(expiredAt) {
    if (this.timer) clearInterval(this.timer);
    const tick = () => {
      const secondsLeft = Math.max(0, Math.floor((expiredAt - Date.now()) / 1000));
      this.setState({ secondsLeft });
      if (secondsLeft <= 0 && this.timer) {
        clearInterval(this.timer);
      }
    };
    tick();
    this.timer = setInterval(tick, 1000);
  }

  formatRemaining(secondsLeft) {
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  async apiCheckout(total, items, customer) {
    this.setState({ processing: true, checkoutError: '', checkoutSuccess: '' });
    try {
      const body = {
        total,
        items,
        customer,
        paymentMethod: this.state.paymentMethod,
      };
      const result = await checkoutOrder(body, this.context.token);

      if (!result?.success || !result.order) {
        this.setState({ checkoutError: 'Checkout failed. Please try again.' });
        return;
      }

      if (result.order.paymentMethod === 'COD') {
        this.context.setMycart([]);
        this.setState({
          checkoutOpen: false,
          checkoutSuccess: 'Order placed successfully. Status is Pending.',
          bankOrder: null,
        });
      } else {
        this.setState({
          checkoutOpen: false,
          bankOrder: result.order,
          checkoutSuccess: 'Please transfer using the QR below, then confirm payment.',
        });
        this.startCountdown(result.order.expiredAt);
      }
    } catch (error) {
      this.setState({
        checkoutError: error?.response?.data?.message || 'Checkout failed. Please try again.',
      });
    } finally {
      this.setState({ processing: false });
    }
  }

  async handleConfirmTransfer() {
    const orderId = this.state.bankOrder?._id;
    if (!orderId) return;
    this.setState({ confirmingTransfer: true, checkoutError: '' });
    try {
      const result = await confirmBankTransfer(orderId, this.context.token);
      if (result?.success) {
        this.context.setMycart([]);
        this.setState({
          bankOrder: result.order,
          checkoutSuccess: 'Bank transfer confirmed. Your order is now Paid.',
        });
        if (this.timer) clearInterval(this.timer);
      }
    } catch (error) {
      this.setState({
        checkoutError: error?.response?.data?.message || 'Payment confirmation failed.',
      });
    } finally {
      this.setState({ confirmingTransfer: false });
    }
  }

  render() {
    const mycart = this.context.mycart;
    const bankOrder = this.state.bankOrder;
    const isBankExpired = bankOrder?.expiredAt ? Date.now() >= bankOrder.expiredAt : false;

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
              <Button
                variant="primary"
                size="sm"
                type="button"
                disabled={this.state.processing}
                onClick={() => this.confirmCheckout()}
              >
                {this.state.processing ? 'Processing...' : 'Confirm'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Choose a payment method to place this order.
            </p>
            <div className="grid gap-3">
              <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                <input
                  type="radio"
                  name="payment-method"
                  checked={this.state.paymentMethod === 'COD'}
                  onChange={() => this.setState({ paymentMethod: 'COD' })}
                />
                <span className="text-sm">Cash on Delivery (status: Pending)</span>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                <input
                  type="radio"
                  name="payment-method"
                  checked={this.state.paymentMethod === 'BANK'}
                  onChange={() => this.setState({ paymentMethod: 'BANK' })}
                />
                <span className="text-sm">Bank Transfer via VietQR (expires in 10 minutes)</span>
              </label>
            </div>
          </div>
        </Modal>
        {this.state.checkoutError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {this.state.checkoutError}
          </div>
        )}
        {this.state.checkoutSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {this.state.checkoutSuccess}
          </div>
        )}

        {bankOrder && (
          <Card>
            <CardHeader
              title="Bank transfer payment"
              subtitle={`Order ${bankOrder._id} • Amount: ${Number(bankOrder.total).toLocaleString()} VND`}
            />
            <div className="space-y-4">
              {bankOrder.paymentMeta?.qrUrl && (
                <img
                  src={bankOrder.paymentMeta.qrUrl}
                  alt="VietQR"
                  className="mx-auto w-full max-w-xs rounded-xl border border-neutral-200"
                />
              )}
              <p className="text-sm text-neutral-600">
                Vietcombank - 1020369856 - Nguyen Hoang Nhat
              </p>
              <p className="text-sm text-neutral-600">
                Transfer content: <span className="font-medium text-black">{bankOrder.paymentMeta?.transferContent}</span>
              </p>
              <p className={`text-sm font-medium ${isBankExpired ? 'text-red-600' : 'text-black'}`}>
                Time left: {this.formatRemaining(this.state.secondsLeft)}
              </p>
              <Button
                type="button"
                variant="primary"
                disabled={this.state.confirmingTransfer || isBankExpired || bankOrder.status !== 'Pending'}
                onClick={() => this.handleConfirmTransfer()}
              >
                {this.state.confirmingTransfer ? 'Confirming...' : 'I have transferred'}
              </Button>
            </div>
          </Card>
        )}

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
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">Subtotal</th>
                      <th className="px-4 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {mycart.map((item, index) => (
                      <tr key={`${item.product._id}-${item.size || 'NA'}-${index}`} className="transition-colors hover:bg-neutral-50/80">
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
                        <td className="px-4 py-4 tabular-nums">{item.size}</td>
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
