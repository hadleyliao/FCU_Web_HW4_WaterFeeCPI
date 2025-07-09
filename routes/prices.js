const express = require('express');
const router = express.Router();
const db = require('../db');

// 新增物價資料
router.post('/', (req, res) => {
  const { date, name, price } = req.body;
  if (!date || !name || price === undefined) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }
  const sql = 'INSERT INTO prices (date, name, price) VALUES (?, ?, ?)';
  db.run(sql, [date, name, price], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, date, name, price });
  });
});

// 查詢物價資料（可依條件查詢）
router.get('/', (req, res) => {
  const { date, name } = req.query;
  let sql = 'SELECT * FROM prices WHERE 1=1';
  const params = [];
  if (date) {
    sql += ' AND date = ?';
    params.push(date);
  }
  if (name) {
    sql += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;

