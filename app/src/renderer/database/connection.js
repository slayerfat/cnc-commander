import PouchDB from 'pouchdb';
import relationalPouch from 'relational-pouch';
import iDbAdapter from 'pouchdb-adapter-idb';
import inMemoryAdapter from 'pouchdb-adapter-memory';
import findAdapter from 'pouchdb-find';
import schemas from './schemas/index';

/**
 * Creates a new Database connection using pouchDB driver.
 *
 * @param name
 * @param adapter
 * @returns {PouchDB}
 */
export default (name = 'test', adapter = 'idb') => {
  // sets the relational Pouch as a plugin
  PouchDB.plugin(relationalPouch);

  // The primary adapter used by PouchDB in the browser, using IndexedDB.
  PouchDB.plugin(iDbAdapter);

  // optional in-memory adapter, used for tests.
  PouchDB.plugin(inMemoryAdapter);

  // structured query API
  PouchDB.plugin(findAdapter);

  // starts the database
  const db = PouchDB({name, adapter});

  // set the relational schema
  db.setSchema(schemas);

  db.createIndex({
    index: {fields: ['data.name', 'data.email']}
  });

  return db;
};
