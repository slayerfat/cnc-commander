export default {
  singular: 'rate',
  plural: 'rates',
  relations: {
    implementsOfOrder: {hasMany: 'implement_order'},
    implementsOfPurchase: {hasMany: 'implement_purchase'},
    expenses: {hasMany: 'expense'}
  }
};
