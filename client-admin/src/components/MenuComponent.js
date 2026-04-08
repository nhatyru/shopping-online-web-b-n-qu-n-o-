import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { NavLink } from 'react-router-dom';

const navCls = ({ isActive }) =>
  [
    'block rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200',
    isActive
      ? 'bg-white text-black'
      : 'text-white/75 hover:bg-white/10 hover:text-white',
  ].join(' ');

const mNavCls = ({ isActive }) =>
  [
    'whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
    isActive ? 'bg-white text-black' : 'text-white/80 hover:text-white',
  ].join(' ');

class Menu extends Component {
  static contextType = MyContext;

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }

  render() {
    const { username } = this.context;

    const links = (
      <>
        <NavLink to="/admin/home" end className={navCls}>
          Overview
        </NavLink>
        <NavLink to="/admin/category" className={navCls}>
          Categories
        </NavLink>
        <NavLink to="/admin/product" className={navCls}>
          Products
        </NavLink>
        <NavLink to="/admin/order" className={navCls}>
          Orders
        </NavLink>
        <NavLink to="/admin/customer" className={navCls}>
          Customers
        </NavLink>
      </>
    );

    const mLinks = (
      <>
        <NavLink to="/admin/home" end className={mNavCls}>
          Home
        </NavLink>
        <NavLink to="/admin/category" className={mNavCls}>
          Categories
        </NavLink>
        <NavLink to="/admin/product" className={mNavCls}>
          Products
        </NavLink>
        <NavLink to="/admin/order" className={mNavCls}>
          Orders
        </NavLink>
        <NavLink to="/admin/customer" className={mNavCls}>
          Customers
        </NavLink>
      </>
    );

    return (
      <>
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-black text-white md:flex">
          <div className="px-6 pb-6 pt-10">
            <div className="font-light tracking-[0.28em] text-white">ATELIER</div>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">
              Studio / Admin
            </p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-3">{links}</nav>
          <div className="border-t border-white/10 p-4">
            <p className="truncate text-xs text-white/50">Signed in as</p>
            <p className="truncate text-sm font-medium text-white">{username}</p>
            <button
              type="button"
              onClick={() => this.lnkLogoutClick()}
              className="mt-4 w-full rounded-full border border-white/30 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              Sign out
            </button>
          </div>
        </aside>

        <header className="sticky top-0 z-30 border-b border-white/10 bg-black text-white md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <div className="font-light tracking-[0.28em]">ATELIER</div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Admin</p>
            </div>
            <button
              type="button"
              onClick={() => this.lnkLogoutClick()}
              className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Out
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4">{mLinks}</nav>
        </header>
      </>
    );
  }
}

export default Menu;
