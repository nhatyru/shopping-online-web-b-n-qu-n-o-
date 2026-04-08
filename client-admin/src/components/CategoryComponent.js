import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';
import { Card, CardHeader } from './ui/Card';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <tr
        key={item._id}
        className="cursor-pointer border-b border-neutral-100 transition-colors hover:bg-neutral-50"
        onClick={() => this.trItemClick(item)}
      >
        <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item._id}</td>
        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
      </tr>
    ));

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-black">Categories</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Organize products. Select a row to load it into the form.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card padding={false}>
            <div className="border-b border-neutral-100 p-6">
              <CardHeader title="All categories" />
            </div>
            {this.state.categories.length === 0 ? (
              <p className="p-8 text-center text-sm text-neutral-500">No categories yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                    </tr>
                  </thead>
                  <tbody>{cates}</tbody>
                </table>
              </div>
            )}
          </Card>

          <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
        </div>
      </div>
    );
  }
}

export default Category;
