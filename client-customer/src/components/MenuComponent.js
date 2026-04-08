import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

const linkClass =
  'whitespace-nowrap text-sm font-medium text-white/85 transition-colors duration-200 hover:text-white';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: '',
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories() {
    axios
      .get('/api/customer/categories')
      .then((res) => {
        this.setState({ categories: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  btnSearchClick(e) {
    e.preventDefault();
    const keyword = this.state.txtKeyword.trim();

    if (keyword !== '') {
      this.props.navigate('/product/search/' + encodeURIComponent(keyword));
      this.setState({ txtKeyword: '' });
    }
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id}>
        <Link to={'/product/category/' + item._id} className={linkClass}>
          {item.name}
        </Link>
      </li>
    ));

    return (
      <header className="border-b border-white/10 bg-black text-white shadow-soft">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex flex-shrink-0 items-center gap-8">
            <Link
              to="/home"
              className="font-light tracking-[0.28em] text-white transition-opacity hover:opacity-80"
            >
              ATELIER
            </Link>
            <nav className="hidden md:block">
              <ul className="flex flex-wrap items-center gap-6">{cates}</ul>
            </nav>
          </div>

          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <nav className="flex gap-4 overflow-x-auto pb-1 md:hidden">
              <Link to="/home" className={linkClass}>
                Home
              </Link>
              {cates}
            </nav>

            <form
              onSubmit={(e) => this.btnSearchClick(e)}
              className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur-sm transition-colors focus-within:border-white/40 sm:w-auto"
            >
              <input
                type="search"
                placeholder="Search"
                aria-label="Search products"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/45"
                value={this.state.txtKeyword}
                onChange={(e) => this.setState({ txtKeyword: e.target.value })}
              />
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition-transform hover:bg-neutral-100 active:scale-95"
              >
                Go
              </button>
            </form>

            <button
              type="button"
              onClick={() => this.props.navigate('/mycart')}
              className="rounded-full border border-white/30 bg-white px-5 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:border-white hover:bg-neutral-100 active:scale-[0.98]"
            >
              Cart
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Menu);
