import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { PageSpinner } from './ui/PageSpinner';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      loading: true,
    };
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  btnAdd2CartClick(e) {
    e.preventDefault();

    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity, 10);

    if (quantity) {
      const mycart = this.context.mycart;

      const index = mycart.findIndex((x) => x.product._id === product._id);

      if (index === -1) {
        const newItem = { product: product, quantity: quantity };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += quantity;
      }

      this.context.setMycart(mycart);
    } else {
      alert('Please enter a valid quantity');
    }
  }

  apiGetProduct(id) {
    this.setState({ loading: true });
    axios
      .get('/api/customer/products/' + id)
      .then((res) => {
        this.setState({ product: res.data, loading: false });
      })
      .catch(() => {
        this.setState({ product: null, loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return <PageSpinner />;
    }

    const prod = this.state.product;
    if (!prod) {
      return (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-8 py-20 text-center">
          <p className="text-sm text-neutral-600">Product not found.</p>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-soft">
            <img
              src={'data:image/jpg;base64,' + prod.image}
              alt={prod.name}
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                {prod.category?.name || 'Collection'}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                {prod.name}
              </h1>
              <p className="mt-6 text-2xl font-medium tabular-nums text-black">
                {prod.price.toLocaleString()}{' '}
                <span className="text-base font-normal text-neutral-400">VND</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => this.btnAdd2CartClick(e)}>
              <Input
                label="Quantity"
                type="number"
                min={1}
                max={99}
                value={this.state.txtQuantity}
                onChange={(e) => this.setState({ txtQuantity: e.target.value })}
              />
              <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
                Add to bag
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductDetail);
