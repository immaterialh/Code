const sqlite = require('sqlite3').verbose();

console.log('open database');
const db = new sqlite.Database('store.db', err => { if(err) throw err; });

console.log('define: get');
const get = (sql, params=[]) => new Promise((resolve, reject) =>
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));

console.log('define: exec');
const exec = (sql, params=[]) => new Promise((resolve, reject) =>
    db.run(sql, params, err => err ? reject(err) : resolve('Success')));

console.log('define: query');
const query = (sql, params=[]) => new Promise((resolve, reject) =>
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));

console.log('check: KV table');
get("select key,value from kvs")
.then(data => console.log('KV table success', data))
.catch(err => {
    if(err == 'Error: SQLITE_ERROR: no such table: kvs')
        exec('create table kvs (key, value)')
        .then(() => console.log(`create KV table success`))
        .catch(err => console.log(`create KV table error '${err}'`));
    else
        console.log(`check KV table err '${err}'`);
});

console.log('define: KV ops');
const getKV = key =>
    get("select * from kvs where key = ?", key)
    .then(row => row?.value);
const setKV = (key, value) =>
    exec('delete from kvs where key = ?', key)
    .then(() => exec('insert into kvs (key, value) values (?, ?)', [key, value]));

module.exports = {
    getKV,
    setKV,
    each: (sql, rowAction) => db.each(sql, (err, row) => {
        if(err) throw(err);
        rowAction(row);
    }),
    exec,
    query,
};