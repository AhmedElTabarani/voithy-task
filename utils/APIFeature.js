const AppError = require('./AppError');

class APIFeatures {
  constructor(query, queryOptions) {
    this.query = query;
    this.queryOptions = queryOptions;
  }
  filter() {
    const filter = this.queryOptions.filter;
    if (!filter) return this;
    this.query = this.query.find(filter);
    return this;
  }

  sort() {
    const sort = this.queryOptions.sort;
    if (!sort) return this;
    const sortBy = sort.replaceAll(',', ' ');
    this.query = this.query.sort(sortBy);
    return this;
  }

  select() {
    let select = this.queryOptions.select;
    if (!select) {
      this.query = this.query.select('-password -__v');
      return this;
    }
    select = select.replaceAll(',', ' ');
    if (select.includes('password'))
      throw new AppError('Invalid selected fields', 400);
    this.query = this.query.select(select);
    return this;
  }

  paginate() {
    const page = +this.queryOptions.page || 1;
    const limit = +this.queryOptions.limit || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  getQuery() {
    return this.query;
  }
}

module.exports = APIFeatures;
