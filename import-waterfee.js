// 匯入 WaterFeeCPIfor10years.json 到資料庫，並清空舊有資料
const fs = require('fs');
const path = require('path');
const db = require('./db');

const jsonPath = path.join(__dirname, 'WaterFeeCPI.json');
const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

// 解析年份與月份
function parseYearMonth(rowLabel) {
<<<<<<< HEAD
    // 例如："104年1月" => 2015-M01
    const match = rowLabel.match(/(\d+)年(\d*)月?/);
    if (!match) return null;
    let year = parseInt(match[1], 10);
    let month = match[2] ? parseInt(match[2], 10) : null;
    // 民國年轉西元年
    year += 1911;
    if (month) {
        return `${year}-M${month.toString().padStart(2, '0')}`;
    } else {
        // 只寫年份時，預設1月
        return `${year}-M01`;
    }
}

async function importData() {
    // 1. 清空舊有資料，並重設id自增序號
    await new Promise((resolve, reject) => {
        db.run('DELETE FROM prices', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
    await new Promise((resolve, reject) => {
        db.run('DELETE FROM sqlite_sequence WHERE name = "prices"', (err) => {
            if (err) reject(err);
            else resolve();
        });
    });

    // 2. 逐筆寫入新資料
    const rows = data.row;
    const values = data.orgdata[0];
    let count = 0;
    for (let i = 0; i < rows.length; i++) {
        const rowLabel = rows[i][0];
        const date = parseYearMonth(rowLabel);
        const price = values[i];
        if (date && price) {
            await new Promise((resolve, reject) => {
                db.run('INSERT INTO prices (date, name, price) VALUES (?, ?, ?)', [date, '水費', price], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            count++;
        }
    }
    console.log(`已匯入 ${count} 筆資料`);
    process.exit(0);
}

importData().catch(err => {
    console.error('匯入失敗:', err);
    process.exit(1);
=======
  // 例如："104年1月" => 2015-M01
  const match = rowLabel.match(/(\d+)年(\d*)月?/);
  if (!match) return null;
  let year = parseInt(match[1], 10);
  let month = match[2] ? parseInt(match[2], 10) : null;
  // 民國年轉西元年
  year += 1911;
  if (month) {
    return `${year}-M${month.toString().padStart(2, '0')}`;
  } else {
    // 只寫年份時，預設1月
    return `${year}-M01`;
  }
}

async function importData() {
  // 1. 清空舊有資料，並重設id自增序號
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM prices', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  await new Promise((resolve, reject) => {
    db.run('DELETE FROM sqlite_sequence WHERE name = "prices"', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // 2. 逐筆寫入新資料
  const rows = data.row;
  const values = data.orgdata[0];
  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const rowLabel = rows[i][0];
    const date = parseYearMonth(rowLabel);
    const price = values[i];
    if (date && price) {
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO prices (date, name, price) VALUES (?, ?, ?)', [date, '水費', price], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      count++;
    }
  }
  console.log(`已匯入 ${count} 筆資料`);
  process.exit(0);
}

importData().catch(err => {
  console.error('匯入失敗:', err);
  process.exit(1);
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
});
