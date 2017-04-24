export default {
  singular: 'material',
  plural: 'materials',
  relations: {
    orders: {hasMany: 'order'},
    histories: {hasMany: 'material_history'},
    provider: {belongsTo: 'provider'}
  }
};
