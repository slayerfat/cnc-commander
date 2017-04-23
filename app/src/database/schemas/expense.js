export default {
  singular: 'expense',
  plural: 'expenses',
  relations: {
    purchases: {hasMany: 'purchase'},
    rate: {belongsTo: 'rate'},
    histories: {hasMany: 'expense_history'}
  }
};
