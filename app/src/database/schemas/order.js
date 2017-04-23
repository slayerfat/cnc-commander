export default {
  singular: 'order',
  plural: 'orders',
  relations: {
    purchase: {belongsTo: 'purchase'},
    material: {belongsTo: 'material'},
    implements: {hasMany: 'implement_order'}
  }
};
