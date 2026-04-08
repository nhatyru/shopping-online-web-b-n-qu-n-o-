import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      deleteOpen: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
      });
    }
    if (!this.props.item && prevProps.item) {
      this.setState({ txtID: '', txtName: '' });
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert('Please enter a name');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please enter id and name');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    this.setState({ deleteOpen: true });
  }

  confirmDelete() {
    this.setState({ deleteOpen: false });
    const id = this.state.txtID;
    if (id) {
      this.apiDeleteCategory(id);
    } else {
      alert('Select a category first');
    }
  }

  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      if (res.data) {
        this.apiGetCategories();
      } else {
        alert('Could not create category');
      }
    });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      if (res.data) {
        this.apiGetCategories();
      } else {
        alert('Could not update category');
      }
    });
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      if (res.data) {
        this.apiGetCategories();
      } else {
        alert('Could not delete category');
      }
    });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.props.updateCategories(res.data);
    });
  }

  render() {
    return (
      <Card>
        <Modal
          open={this.state.deleteOpen}
          onClose={() => this.setState({ deleteOpen: false })}
          title="Delete category?"
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => this.setState({ deleteOpen: false })}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="button" onClick={() => this.confirmDelete()}>
                Delete
              </Button>
            </>
          }
        >
          <p className="text-sm text-neutral-600">Products may reference this category.</p>
        </Modal>

        <CardHeader title="Category form" />

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input label="ID" type="text" value={this.state.txtID} readOnly inputClassName="bg-neutral-50" />
          <Input
            label="Name"
            type="text"
            value={this.state.txtName}
            onChange={(e) => this.setState({ txtName: e.target.value })}
          />
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" variant="secondary" size="md" onClick={(e) => this.btnAddClick(e)}>
              Add new
            </Button>
            <Button type="button" variant="primary" size="md" onClick={(e) => this.btnUpdateClick(e)}>
              Update
            </Button>
            <Button type="button" variant="outline" size="md" onClick={(e) => this.btnDeleteClick(e)}>
              Delete
            </Button>
          </div>
        </form>
      </Card>
    );
  }
}

export default CategoryDetail;
