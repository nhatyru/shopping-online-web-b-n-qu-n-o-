import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Button } from './ui/Button';
import { Card, CardHeader } from './ui/Card';
import { Input, Select } from './ui/Input';
import { Modal } from './ui/Modal';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      deleteOpen: false,
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image,
      });
    }
    if (!this.props.item && prevProps.item) {
      this.setState({
        txtID: '',
        txtName: '',
        txtPrice: 0,
        cmbCategory: '',
        imgProduct: '',
      });
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();

    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice, 10);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPostProduct(prod);
    } else {
      alert('Please enter name, price, category, and image');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();

    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice, 10);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

    if (id && name && price && category && image) {
      const prod = { name, price, category, image };
      this.apiPutProduct(id, prod);
    } else {
      alert('Please complete all fields including image');
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
      this.apiDeleteProduct(id);
    } else {
      alert('Select a product first');
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      if (res.data) {
        this.apiGetProducts();
      } else {
        alert('Could not create product');
      }
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      if (res.data) {
        this.apiGetProducts();
      } else {
        alert('Could not update product');
      }
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      if (res.data) {
        this.apiGetProducts();
      } else {
        alert('Could not delete product');
      }
    });
  }

  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages, result.curPage);
      } else {
        const curPage = this.props.curPage - 1;
        axios.get('/api/admin/products?page=' + curPage, config).then((res2) => {
          const r2 = res2.data;
          this.props.updateProducts(r2.products, r2.noPages, r2.curPage);
        });
      }
    });
  }

  render() {
    const cates = this.state.categories.map((cate) => (
      <option key={cate._id} value={cate._id}>
        {cate.name}
      </option>
    ));

    return (
      <Card>
        <Modal
          open={this.state.deleteOpen}
          onClose={() => this.setState({ deleteOpen: false })}
          title="Delete product?"
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
          <p className="text-sm text-neutral-600">This cannot be undone.</p>
        </Modal>

        <CardHeader title="Product form" subtitle="Add new or update selected row." />

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input label="ID" type="text" value={this.state.txtID} readOnly inputClassName="bg-neutral-50" />
          <Input
            label="Name"
            type="text"
            value={this.state.txtName}
            onChange={(e) => this.setState({ txtName: e.target.value })}
          />
          <Input
            label="Price"
            type="text"
            value={this.state.txtPrice}
            onChange={(e) => this.setState({ txtPrice: e.target.value })}
          />

          <div>
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
              Image
            </span>
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => this.previewImage(e)}
              className="block w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-800"
            />
          </div>

          <Select
            label="Category"
            value={this.state.cmbCategory}
            onChange={(e) => this.setState({ cmbCategory: e.target.value })}
          >
            <option value="">— Select —</option>
            {cates}
          </Select>

          {this.state.imgProduct && (
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
              <img src={this.state.imgProduct} alt="" className="mx-auto max-h-64 object-contain" />
            </div>
          )}

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

export default ProductDetail;
