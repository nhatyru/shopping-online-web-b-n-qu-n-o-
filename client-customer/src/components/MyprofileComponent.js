import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';
import { updateCustomerProfile } from '../services/api';

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
      txtStreet: '',
      txtWard: '',
      txtDistrict: '',
      txtCity: '',
      processing: false,
      error: '',
      success: '',
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
        txtStreet: this.context.customer.address?.street || '',
        txtWard: this.context.customer.address?.ward || '',
        txtDistrict: this.context.customer.address?.district || '',
        txtCity: this.context.customer.address?.city || '',
      });
    }
  }

  async btnUpdateClick(e) {
    e.preventDefault();

    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    const street = this.state.txtStreet;
    const ward = this.state.txtWard;
    const district = this.state.txtDistrict;
    const city = this.state.txtCity;

    if (username && password && name && phone && email && street && ward && district && city) {
      const customer = {
        username: username,
        password: password,
        name: name,
        fullName: name,
        phone: phone,
        email: email,
        address: { street, ward, district, city },
      };

      await this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      this.setState({ error: 'Please complete all fields.', success: '' });
    }
  }

  async apiPutCustomer(id, customer) {
    this.setState({ processing: true, error: '', success: '' });
    try {
      const result = await updateCustomerProfile(id, customer, this.context.token);
      if (result?._id) {
        this.context.setCustomer(result);
        this.setState({ success: 'Profile updated successfully.' });
      }
    } catch (error) {
      this.setState({
        error: error?.response?.data?.message || 'Update failed.',
      });
    } finally {
      this.setState({ processing: false });
    }
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
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Street"
                type="text"
                value={this.state.txtStreet}
                onChange={(e) => this.setState({ txtStreet: e.target.value })}
              />
              <Input
                label="Ward"
                type="text"
                value={this.state.txtWard}
                onChange={(e) => this.setState({ txtWard: e.target.value })}
              />
              <Input
                label="District"
                type="text"
                value={this.state.txtDistrict}
                onChange={(e) => this.setState({ txtDistrict: e.target.value })}
              />
              <Input
                label="City"
                type="text"
                value={this.state.txtCity}
                onChange={(e) => this.setState({ txtCity: e.target.value })}
              />
            </div>
            {this.state.error && <p className="text-sm text-red-600">{this.state.error}</p>}
            {this.state.success && <p className="text-sm text-emerald-600">{this.state.success}</p>}
            <Button type="submit" variant="primary" className="w-full" size="lg" disabled={this.state.processing}>
              {this.state.processing ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }
}

export default Myprofile;
