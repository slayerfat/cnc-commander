import PouchDB from 'pouchdb';
import relationalPouch from 'relational-pouch';
import iDbAdapter from 'pouchdb-adapter-idb';
import findAdapter from 'pouchdb-find';
import userSchema from './schemas/user';
import purchaseSchema from './schemas/purchase';

// sets the relational Pouch as a plugin
PouchDB.plugin(relationalPouch);

// The primary adapter used by PouchDB in the browser, using IndexedDB.
PouchDB.plugin(iDbAdapter);

// structured query API
PouchDB.plugin(findAdapter);

// starts the database
const db = PouchDB({
  name: 'test',
  adapter: 'idb'
});

// set the relational schema
db.setSchema([
  userSchema,
  purchaseSchema
]);

db.createIndex({
  index: {fields: ['data.email', 'data.name']}
});

export default db;
