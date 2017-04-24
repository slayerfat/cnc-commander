export default {
  singular: 'implement_purchase',
  plural: 'implement_purchases',
  relations: {
    purchases: {hasMany: 'purchase'},
    rate: {belongsTo: 'rate'}
  }
};
