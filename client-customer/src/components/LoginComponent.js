import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
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
      const account = { username: username, password: password };

      this.apiLogin(account);
    } else {
      alert('Please enter username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);

        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }

  render() {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center py-12">
        <Card className="w-full">
          <CardHeader title="Sign in" subtitle="Welcome back to ATELIER." />
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
          <p className="mt-8 text-center text-sm text-neutral-500">
            New here?{' '}
            <Link to="/signup" className="font-medium text-black underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    );
  }
}

export default withRouter(Login);
