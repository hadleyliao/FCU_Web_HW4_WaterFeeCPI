const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 資料庫檔案路徑
const dbPath = path.resolve(__dirname, 'waterfee.db');

// 建立資料庫連線
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法連接到 SQLite 資料庫:', err.message);
  } else {
    console.log('已連接到 SQLite 資料庫');
  }
});

// 初始化資料表
const initDB = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('建立資料表失敗:', err.message);
    } else {
      console.log('資料表已初始化');
    }
  });
};

initDB();

module.exports = db;
