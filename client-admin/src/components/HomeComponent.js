import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Card } from './ui/Card';
import { PageSpinner } from './ui/PageSpinner';

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      loading: true,
    };
  }

  componentDidMount() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/stats', config)
      .then((res) => {
        this.setState({ stats: res.data, loading: false });
      })
      .catch(() => this.setState({ loading: false }));
  }

  render() {
    if (this.state.loading) {
      return <PageSpinner label="Loading dashboard…" />;
    }

    const s = this.state.stats || {
      products: 0,
      categories: 0,
      orders: 0,
      customers: 0,
    };

    const tiles = [
      { label: 'Products', value: s.products, hint: 'SKU count' },
      { label: 'Categories', value: s.categories, hint: 'Navigation groups' },
      { label: 'Orders', value: s.orders, hint: 'All time' },
      { label: 'Customers', value: s.customers, hint: 'Registered' },
    ];

    return (
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Overview</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Studio metrics at a glance — same visual language as the storefront.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {tiles.map((t) => (
            <Card key={t.label} className="!p-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                {t.label}
              </p>
              <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight text-black">
                {t.value}
              </p>
              <p className="mt-2 text-xs text-neutral-400">{t.hint}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="text-lg font-semibold tracking-tight text-black">Welcome</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
            Use the sidebar to manage categories, products, orders, and customers. This
            console shares typography, spacing, and components with the customer site
            for a single brand experience.
          </p>
        </Card>
      </div>
    );
  }
}

export default Home;
