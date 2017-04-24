import PouchDB from 'pouchdb';
import relationalPouch from 'relational-pouch';
import iDbAdapter from 'pouchdb-adapter-idb';
import findAdapter from 'pouchdb-find';
import schemas from './schemas/index';

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
db.setSchema(schemas);

db.createIndex({
  index: {fields: ['data.email', 'data.name']}
});

export default db;
