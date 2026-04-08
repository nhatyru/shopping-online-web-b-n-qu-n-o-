import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
    };
  }

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;

    if (username && password) {
      const account = { username, password };
      this.apiLogin(account);
    } else {
      alert('Please enter username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  }

  render() {
    if (this.context.token !== '') {
      return <div />;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50 px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-200/80 via-neutral-50 to-neutral-50" />
        <Card className="relative w-full max-w-md shadow-soft-lg">
          <CardHeader
            title="Studio sign in"
            subtitle="ATELIER administration — same design system as the store."
          />
          <form className="space-y-5" onSubmit={(e) => this.btnLoginClick(e)}>
            <Input
              label="Username"
              type="text"
              autoComplete="username"
              value={this.state.txtUsername}
              onChange={(e) => this.setState({ txtUsername: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={this.state.txtPassword}
              onChange={(e) => this.setState({ txtPassword: e.target.value })}
            />
            <Button type="submit" variant="primary" className="w-full" size="lg">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    );
  }
}

export default Login;
