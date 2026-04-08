import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import { PageSpinner } from './ui/PageSpinner';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.loadForParams(this.props.params);
  }

  componentDidUpdate(prevProps) {
    const p = this.props.params;
    const prev = prevProps.params;
    if (p.cid !== prev.cid || p.keyword !== prev.keyword) {
      this.setState({ loading: true });
      this.loadForParams(p);
    }
  }

  loadForParams(params) {
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    } else {
      this.setState({ products: [], loading: false });
    }
  }

  apiGetProductsByCatID(cid) {
    fetch('/api/customer/products/category/' + cid)
      .then((res) => res.json())
      .then((data) => this.setState({ products: data, loading: false }))
      .catch(() => this.setState({ products: [], loading: false }));
  }

  apiGetProductsByKeyword(keyword) {
    fetch('/api/customer/products/search/' + encodeURIComponent(keyword))
      .then((res) => res.json())
      .then((data) => this.setState({ products: data, loading: false }))
      .catch(() => this.setState({ products: [], loading: false }));
  }

  render() {
    if (this.state.loading) {
      return <PageSpinner label="Loading products…" />;
    }

    const { products } = this.state;
    const { cid, keyword } = this.props.params;

    return (
      <div className="space-y-10">
        <header className="border-b border-neutral-200 pb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
            {keyword ? `Search: “${decodeURIComponent(keyword)}”` : 'Collection'}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {cid
              ? 'Pieces in this category.'
              : keyword
                ? 'Results matching your search.'
                : 'Browse the edit.'}
          </p>
        </header>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-8 py-20 text-center">
            <p className="text-sm font-medium text-black">Nothing here yet</p>
            <p className="mt-2 text-sm text-neutral-500">
              Try another category or search term.
            </p>
            <Link
              to="/home"
              className="mt-6 inline-block rounded-full border border-black bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <Link
                  to={'/product/' + item._id}
                  className="block overflow-hidden bg-neutral-100"
                >
                  <img
                    src={'data:image/jpg;base64,' + item.image}
                    alt={item.name}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="p-5 text-center">
                  <Link to={'/product/' + item._id}>
                    <h2 className="text-sm font-semibold text-black transition-colors hover:underline">
                      {item.name}
                    </h2>
                  </Link>
                  <p className="mt-2 text-sm font-medium tabular-nums text-black">
                    {Number(item.price).toLocaleString()}{' '}
                    <span className="text-neutral-400">VND</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Product);
