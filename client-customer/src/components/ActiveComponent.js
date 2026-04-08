import axios from 'axios';
import React, { Component } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: '',
    };
  }

  btnActiveClick(e) {
    e.preventDefault();

    const id = this.state.txtID;
    const token = this.state.txtToken;

    if (id && token) {
      this.apiActive(id, token);
    } else {
      alert('Please enter ID and token');
    }
  }

  apiActive(id, token) {
    const body = { id: id, token: token };

    axios.post('/api/customer/active', body).then((res) => {
      const result = res.data;

      if (result) {
        alert('Account activated.');
      } else {
        alert('Activation failed. Check your details.');
      }
    });
  }

  render() {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center py-12">
        <Card className="w-full">
          <CardHeader
            title="Activate account"
            subtitle="Enter the details from your confirmation email."
          />
          <form className="space-y-5" onSubmit={(e) => this.btnActiveClick(e)}>
            <Input
              label="Customer ID"
              type="text"
              value={this.state.txtID}
              onChange={(e) => this.setState({ txtID: e.target.value })}
            />
            <Input
              label="Token"
              type="text"
              value={this.state.txtToken}
              onChange={(e) => this.setState({ txtToken: e.target.value })}
            />
            <Button type="submit" variant="primary" className="w-full" size="lg">
              Activate
            </Button>
          </form>
        </Card>
      </div>
    );
  }
}

export default Active;
