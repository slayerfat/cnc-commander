export default {
  singular: 'implement_order',
  plural: 'implement_orders',
  relations: {
    orders: {hasMany: 'order'},
    rate: {belongsTo: 'rate'}
  }
};
