import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';

class Main extends Component {
  static contextType = MyContext;

  render() {
    const { token } = this.context;

    if (token !== '') {
      return (
        <div className="min-h-screen bg-neutral-100 text-black">
          <Menu />
          <main className="md:pl-64">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-10 lg:py-12">
              <Routes>
                <Route path="/admin/home" element={<Home />} />
                <Route path="/admin/category" element={<Category />} />
                <Route path="/admin/product" element={<Product />} />
                <Route path="/admin/order" element={<Order />} />
                <Route path="/admin/customer" element={<Customer />} />
                <Route path="/admin" element={<Navigate to="/admin/home" />} />
              </Routes>
            </div>
          </main>
        </div>
      );
    }

    return <div />;
  }
}

export default Main;
