export default {
  singular: 'provider',
  plural: 'providers',
  relations: {
    materials: {hasMany: 'material'},
    bank: {belongsTo: 'bank'}
  }
};
