import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { PageSpinner } from './ui/PageSpinner';
import { getProductById } from '../services/api';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      selectedSize: 'M',
      heightCm: '',
      weightKg: '',
      suggestedSize: '',
      loading: true,
      adding: false,
    };
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  suggestSize() {
    const h = Number(this.state.heightCm);
    const w = Number(this.state.weightKg);
    if (!h || !w) return '';
    if (h < 165 && w < 55) return 'S';
    if (h <= 175 && w <= 70) return 'M';
    if (h <= 182 && w <= 82) return 'L';
    return 'XL';
  }

  btnSuggestSizeClick(e) {
    e.preventDefault();
    const suggestedSize = this.suggestSize();
    if (!suggestedSize) {
      alert('Please enter valid height and weight.');
      return;
    }
    this.setState({ suggestedSize, selectedSize: suggestedSize });
  }

  btnAdd2CartClick(e) {
    e.preventDefault();

    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity, 10);
    const selectedSize = this.state.selectedSize;

    if (quantity && selectedSize) {
      this.setState({ adding: true });
      const mycart = [...this.context.mycart];

      const index = mycart.findIndex((x) => x.product._id === product._id && x.size === selectedSize);

      if (index === -1) {
        const newItem = { product: product, quantity: quantity, size: selectedSize };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += quantity;
      }

      this.context.setMycart(mycart);
      this.setState({ adding: false });
    } else {
      alert('Please enter a valid quantity');
    }
  }

  async apiGetProduct(id) {
    this.setState({ loading: true });
    try {
      const product = await getProductById(id);
      this.setState({ product: product, loading: false });
    } catch (error) {
      this.setState({ product: null, loading: false });
    }
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
              <Select
                label="Size"
                value={this.state.selectedSize}
                onChange={(e) => this.setState({ selectedSize: e.target.value })}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </Select>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Height (cm)"
                  type="number"
                  min={120}
                  max={220}
                  value={this.state.heightCm}
                  onChange={(e) => this.setState({ heightCm: e.target.value })}
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  min={30}
                  max={150}
                  value={this.state.weightKg}
                  onChange={(e) => this.setState({ weightKg: e.target.value })}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" type="button" onClick={(e) => this.btnSuggestSizeClick(e)}>
                  Suggest size
                </Button>
                {this.state.suggestedSize && (
                  <p className="text-sm text-neutral-600">
                    Suggested: <span className="font-semibold text-black">{this.state.suggestedSize}</span>
                  </p>
                )}
              </div>
              <Input
                label="Quantity"
                type="number"
                min={1}
                max={99}
                value={this.state.txtQuantity}
                onChange={(e) => this.setState({ txtQuantity: e.target.value })}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={this.state.adding}
                className="w-full sm:w-auto"
              >
                {this.state.adding ? 'Adding...' : 'Add to bag'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProductDetail);
