import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
    };
  }

  btnSignupClick(e) {
    e.preventDefault();

    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;

    if (username && password && name && phone && email) {
      const account = { username, password, name, phone, email };
      this.apiSignup(account);
    } else {
      alert('Please complete all fields');
    }
  }

  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }

  render() {
    return (
      <div className="mx-auto max-w-lg py-12">
        <Card>
          <CardHeader title="Create account" subtitle="Join ATELIER for orders and updates." />
          <form className="space-y-5" onSubmit={(e) => this.btnSignupClick(e)}>
            <Input
              label="Username"
              type="text"
              value={this.state.txtUsername}
              onChange={(e) => this.setState({ txtUsername: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              value={this.state.txtPassword}
              onChange={(e) => this.setState({ txtPassword: e.target.value })}
            />
            <Input
              label="Full name"
              type="text"
              value={this.state.txtName}
              onChange={(e) => this.setState({ txtName: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              value={this.state.txtPhone}
              onChange={(e) => this.setState({ txtPhone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={this.state.txtEmail}
              onChange={(e) => this.setState({ txtEmail: e.target.value })}
            />
            <Button type="submit" variant="primary" className="w-full" size="lg">
              Register
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-black underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    );
  }
}

export default Signup;
