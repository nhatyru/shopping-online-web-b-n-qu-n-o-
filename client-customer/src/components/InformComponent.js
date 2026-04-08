import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

const subtleLink =
  'text-sm text-neutral-600 transition-colors hover:text-black';

class Inform extends Component {
  static contextType = MyContext;

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }

  render() {
    const { token, customer, mycart } = this.context;

    return (
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {token === '' ? (
              <>
                <Link to="/login" className={subtleLink}>
                  Sign in
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/signup" className={subtleLink}>
                  Create account
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/active" className={subtleLink}>
                  Activate account
                </Link>
              </>
            ) : (
              <>
                <span className="text-neutral-500">
                  Hello,{' '}
                  <span className="font-medium text-black">{customer?.name}</span>
                </span>
                <span className="hidden text-neutral-300 sm:inline">|</span>
                <Link
                  to="/home"
                  className={subtleLink}
                  onClick={() => this.lnkLogoutClick()}
                >
                  Sign out
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/myprofile" className={subtleLink}>
                  Profile
                </Link>
                <span className="text-neutral-300">|</span>
                <Link to="/myorders" className={subtleLink}>
                  Orders
                </Link>
              </>
            )}
          </div>
          <div className="text-neutral-500">
            <Link to="/mycart" className="font-medium text-black hover:underline">
              Shopping bag
            </Link>
            <span className="mx-1.5 text-neutral-300">·</span>
            <span>
              {mycart.length} {mycart.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Inform;
