export default {
  singular: 'purchase',
  plural: 'purchases',
  relations: {
    user: {belongsTo: 'user'},
    client: {belongsTo: 'user'},
    orders: {hasMany: 'order'},
    expenses: {hasMany: 'expense'},
    implements: {hasMany: 'implement_purchase'}
  }
};
