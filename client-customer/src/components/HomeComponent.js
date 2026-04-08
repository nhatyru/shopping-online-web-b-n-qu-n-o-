import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageSpinner } from './ui/PageSpinner';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      loading: true,
    };
  }

  componentDidMount() {
    Promise.all([
      axios.get('/api/customer/products/new'),
      axios.get('/api/customer/products/hot'),
    ])
      .then(([newRes, hotRes]) => {
        const normalizeToArray = (data) => {
          if (Array.isArray(data)) return data;
          if (Array.isArray(data?.products)) return data.products;
          if (Array.isArray(data?.data)) return data.data;
          return [];
        };

        this.setState({
          newprods: normalizeToArray(newRes.data),
          hotprods: normalizeToArray(hotRes.data),
          loading: false,
        });
      })
      .catch((err) => {
        console.log('Home API error:', err);
        this.setState({ loading: false });
      });
  }

  renderProduct(item) {
    const price = Number(item?.price ?? 0);

    return (
      <article
        key={item._id}
        className="group overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
      >
        <Link to={'/product/' + item._id} className="block overflow-hidden bg-neutral-100">
          <img
            className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            src={item?.image ? 'data:image/jpg;base64,' + item.image : ''}
            alt={item?.name ?? ''}
          />
        </Link>

        <div className="space-y-2 p-5 text-center">
          <Link to={'/product/' + item._id}>
            <h3 className="text-sm font-semibold tracking-tight text-black transition-colors group-hover:underline">
              {item?.name}
            </h3>
          </Link>

          <p className="text-xs text-neutral-500">Sizes S · M · L · XL</p>

          <p className="text-sm font-medium tabular-nums text-black">
            {price.toLocaleString()} <span className="text-neutral-400">VND</span>
          </p>

          <Link
            to={'/product/' + item._id}
            className="inline-block w-full rounded-full border border-black bg-black py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-white hover:text-black"
          >
            View
          </Link>
        </div>
      </article>
    );
  }

  render() {
    if (this.state.loading) {
      return <PageSpinner label="Loading collection…" />;
    }

    const newprods = Array.isArray(this.state.newprods) ? this.state.newprods : [];
    const hotprods = Array.isArray(this.state.hotprods) ? this.state.hotprods : [];

    return (
      <div className="space-y-16 lg:space-y-24">
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-soft-lg">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center px-8 py-14 text-white lg:px-14 lg:py-20">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/50">
                New season
              </p>
              <h1 className="mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
                Quiet luxury, defined in black &amp; white.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65">
                Curated silhouettes and refined essentials. Explore the latest arrivals
                and enduring staples.
              </p>
              <Link
                to="/home#new-collection"
                className="mt-10 inline-flex w-fit items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Shop collection
              </Link>
            </div>

            <div className="relative min-h-[280px] bg-neutral-800 lg:min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-l" />
            </div>
          </div>
        </section>

        <section id="new-collection" className="scroll-mt-28">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                New arrivals
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Fresh pieces added to the studio edit.
              </p>
            </div>
          </div>

          {newprods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-8 py-16 text-center text-sm text-neutral-500">
              No products yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newprods.map((item) => this.renderProduct(item))}
            </div>
          )}
        </section>

        {hotprods.length > 0 && (
          <section>
            <div className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                Featured
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Most-loved styles this week.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hotprods.map((item) => this.renderProduct(item))}
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default Home;