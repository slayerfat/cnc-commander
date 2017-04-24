export default {
  singular: 'expense_history',
  plural: 'expense_histories',
  relations: {
    expenses: {belongsTo: 'expense'}
  }
};
