import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';

class Myprofile extends Component {
  static contextType = MyContext;

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

  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email,
      });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();

    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;

    if (username && password && name && phone && email) {
      const customer = {
        username: username,
        password: password,
        name: name,
        phone: phone,
        email: email,
      };

      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Please complete all fields');
    }
  }

  apiPutCustomer(id, customer) {
    const config = {
      headers: { 'x-access-token': this.context.token },
    };

    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;

      if (result) {
        this.context.setCustomer(result);
      } else {
        alert('Update failed.');
      }
    });
  }

  render() {
    if (this.context.token === '') {
      return <Navigate replace to="/login" />;
    }

    return (
      <div className="mx-auto max-w-lg py-12">
        <Card>
          <CardHeader title="Profile" subtitle="Keep your details up to date." />
          <form className="space-y-5" onSubmit={(e) => this.btnUpdateClick(e)}>
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
              Save changes
            </Button>
          </form>
        </Card>
      </div>
    );
  }
}

export default Myprofile;
