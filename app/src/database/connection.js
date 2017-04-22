import PouchDB from 'pouchdb';
import relationalPouch from 'relational-pouch';
import iDbAdapter from 'pouchdb-adapter-idb';
import userSchema from './schemas/user';
import purchaseSchema from './schemas/purchase';

// sets the relational Pouch as a plugin
PouchDB.plugin(relationalPouch);

// The primary adapter used by PouchDB in the browser, using IndexedDB.
PouchDB.plugin(iDbAdapter);

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

export default db;
