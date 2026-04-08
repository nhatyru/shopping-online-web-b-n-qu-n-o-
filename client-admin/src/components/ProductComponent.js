import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';
import { Card, CardHeader } from './ui/Card';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
    };
  }

  updateProducts = (products, noPages, curPage) => {
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  };

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage,
      });
    });
  }

  render() {
    const prods = this.state.products.map((item) => (
      <tr
        key={item._id}
        className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50"
        onClick={() => this.trItemClick(item)}
      >
        <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item._id}</td>
        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
        <td className="px-4 py-3 tabular-nums text-sm">{item.price}</td>
        <td className="px-4 py-3 text-sm text-neutral-600">
          {new Date(item.cdate).toLocaleString()}
        </td>
        <td className="px-4 py-3 text-sm text-neutral-600">{item.category.name}</td>
        <td className="px-4 py-3">
          <img
            src={'data:image/jpg;base64,' + item.image}
            alt=""
            className="h-14 w-14 rounded-lg object-cover ring-1 ring-neutral-200"
          />
        </td>
      </tr>
    ));

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const n = index + 1;
      const isActive = n === this.state.curPage;
      return (
        <button
          key={index}
          type="button"
          onClick={() => !isActive && this.lnkPageClick(n)}
          className={[
            'min-w-[2.25rem] rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            isActive
              ? 'bg-black text-white'
              : 'text-neutral-600 hover:bg-neutral-100 hover:text-black',
          ].join(' ')}
        >
          {n}
        </button>
      );
    });

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Products</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Select a row to edit, or use the form to add a new product.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-5">
          <Card className="xl:col-span-3" padding={false}>
            <div className="border-b border-neutral-100 p-6">
              <CardHeader title="Catalog" subtitle="Paginated list" />
            </div>
            {this.state.products.length === 0 ? (
              <p className="p-8 text-center text-sm text-neutral-500">No products yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Image</th>
                    </tr>
                  </thead>
                  <tbody>{prods}</tbody>
                </table>
              </div>
            )}
            {this.state.noPages > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-neutral-100 p-4">
                {pagination}
              </div>
            )}
          </Card>

          <div className="xl:col-span-2">
            <ProductDetail
              item={this.state.itemSelected}
              curPage={this.state.curPage}
              updateProducts={this.updateProducts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
