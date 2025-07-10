// 取得水費資料(可帶日期查詢)
async function fetchPrices(date) {
    let url = '/api/prices';
    if (date) url += '?date=' + encodeURIComponent(date);
    const res = await fetch(url);
    return await res.json();
}

// 將日期格式統一為 YYYY-MM
function formatDate(dateStr) {
    return dateStr.replace(/-(M)(\d{1,2})$/, (m, mTag, num) => '-' + num.padStart(2, '0'));
}

// 渲染資料表格內容（同時控制表格顯示）
function renderTable(data) {
    const tableWrapper = document.querySelector('.table-wrapper');
    const table = document.getElementById('resultTable');
    // 顯示表格外層
    tableWrapper.style.display = 'flex';

    // 動態生成表頭
    const thead = table.querySelector('thead');
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>日期</th>
        <th>商品名稱</th>
        <th>價格指數</th>
      </tr>
    `;

    // 依照日期排序（YYYY-MM）
    data.sort((a, b) => {
        const dateA = formatDate(a.date);
        const dateB = formatDate(b.date);
        return dateA.localeCompare(dateB);
    });
<<<<<<< HEAD
    // 直接顯示所有資料（不過濾重複年月）
=======
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" class="empty-row">查無資料</td>`;
        tbody.appendChild(tr);
        return;
    }
    data.forEach((row, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${idx + 1}</td><td>${formatDate(row.date)}</td><td>${row.name}</td><td>${parseFloat(row.price).toFixed(2)}</td>`;
        tbody.appendChild(tr);
    });
}

// 隱藏表格（包含表頭及內容）
function hideTable() {
    const tableWrapper = document.querySelector('.table-wrapper');
    tableWrapper.style.display = 'none';
    // 清空表頭與內容
    const table = document.getElementById('resultTable');
    table.querySelector('thead').innerHTML = '';
    table.querySelector('tbody').innerHTML = '';
}

// 取得所有可選的月份（YYYY-MM）
function getMonthOptions(data) {
    const months = new Set();
    data.forEach(row => {
        const match = row.date.match(/^(\d{4})-M(\d{1,2})$/);
        if (match) {
            months.add(match[1] + '-' + match[2].padStart(2, '0'));
        }
    });
    return Array.from(months).sort();
}

// 設定查詢下拉選單（起始、結束年月）
<<<<<<< HEAD
// 新增: 可選擇預設值，並保留目前選擇
function setMonthSelects(data, keepSelected = true) {
    const months = getMonthOptions(data);
    const startSel = document.getElementById('startMonthInput');
    const endSel = document.getElementById('endMonthInput');
    // 保留原本選擇
    const prevStart = startSel.value;
    const prevEnd = endSel.value;
    startSel.innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
    endSel.innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
    if (keepSelected) {
        if (months.includes(prevStart)) startSel.value = prevStart;
        if (months.includes(prevEnd)) endSel.value = prevEnd;
    }
}

// 查詢區塊：起始/結束月份聯動（僅做合理性檢查，不縮減選項）
document.getElementById('startMonthInput').onchange = function () {
    const start = this.value;
    const endSel = document.getElementById('endMonthInput');
    if (endSel.value && start && start > endSel.value) {
        endSel.value = '';
    }
};
document.getElementById('endMonthInput').onchange = function () {
    const end = this.value;
    const startSel = document.getElementById('startMonthInput');
    if (startSel.value && end && end < startSel.value) {
        startSel.value = '';
    }
};

// 查詢按鈕事件：依區間過濾資料並顯示
// 同步更新圖表
document.getElementById('searchBtn').onclick = async function () {
    const start = document.getElementById('startMonthInput').value;
    const end = document.getElementById('endMonthInput').value;
    if (!start || !end) {
        Swal.fire({
            icon: "error",
            title: "請選擇完整區間",
            text: "請選擇起始與結束年月"
        });
        return;
    }
    if (start > end) {
=======
function setMonthSelects(data) {
    const months = getMonthOptions(data);
    const startSel = document.getElementById('startMonthInput');
    const endSel = document.getElementById('endMonthInput');
    startSel.innerHTML = '<option value="">全部</option>' + months.map(m => `<option value="${m}">${m}</option>`).join('');
    endSel.innerHTML = '<option value="">全部</option>' + months.map(m => `<option value="${m}">${m}</option>`).join('');
}

// 查詢按鈕事件：依區間過濾資料並顯示
document.getElementById('searchBtn').onclick = async function () {
    const start = document.getElementById('startMonthInput').value;
    const end = document.getElementById('endMonthInput').value;
    if (start && end && start > end) {
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
        Swal.fire({
            icon: "error",
            title: "區間錯誤",
            text: "起始月份不可大於結束月份"
        });
        return;
    }
    const data = await fetchPrices();
<<<<<<< HEAD
    let filtered = data.filter(row => {
        const m = row.date.match(/^(\d{4})-M(\d{1,2})$/);
        if (!m) return false;
        const yyyymm = m[1] + '-' + m[2].padStart(2, '0');
        return yyyymm >= start && yyyymm <= end;
    });
    renderTable(filtered);
    renderPriceChart(filtered);
    setMonthSelects(data, true);
};

// 顯示全部按鈕事件：清空篩選並顯示所有資料
// 同步更新圖表
document.getElementById('resetBtn').onclick = async function () {
    const data = await fetchPrices();
    renderTable(data);
    renderPriceChart(data);
    setMonthSelects(data, true);
    // 預設選擇最早到最晚
    const months = getMonthOptions(data);
    if (months.length > 0) {
        document.getElementById('startMonthInput').value = months[0];
        document.getElementById('endMonthInput').value = months[months.length - 1];
    }
=======
    let filtered = data;
    if (start || end) {
        filtered = data.filter(row => {
            const m = row.date.match(/^(\d{4})-M(\d{1,2})$/);
            if (!m) return false;
            const yyyymm = m[1] + '-' + m[2].padStart(2, '0');
            if (start && end) return yyyymm >= start && yyyymm <= end;
            if (start) return yyyymm >= start;
            if (end) return yyyymm <= end;
            return true;
        });
    }
    renderTable(filtered);
};

// 顯示全部按鈕事件：清空篩選並顯示所有資料
document.getElementById('resetBtn').onclick = async function () {
    document.getElementById('startMonthInput').value = '';
    document.getElementById('endMonthInput').value = '';
    const data = await fetchPrices();
    renderTable(data);
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
};

// 初始化新增年份、月份下拉
function setAddYearMonthSelect() {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1;
    const yearSel = document.getElementById('addYearInput');
    const monthSel = document.getElementById('addMonthInput');
    let yearOpts = '';
    for (let y = thisYear; y >= 2000; y--) {
        yearOpts += `<option value="${y}">${y}</option>`;
    }
    yearSel.innerHTML = yearOpts;
<<<<<<< HEAD
    setAddMonthOptions(thisYear, thisMonth, true); // 新增 true 參數，代表初始化時要排除當月
    yearSel.onchange = function () {
        const selectedYear = parseInt(yearSel.value, 10);
        setAddMonthOptions(selectedYear, thisMonth, true);
=======
    setAddMonthOptions(thisYear, thisMonth);
    yearSel.onchange = function () {
        const selectedYear = parseInt(yearSel.value, 10);
        setAddMonthOptions(selectedYear, thisMonth);
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
    };
}

// 設定可新增的月份選項
<<<<<<< HEAD
// excludeCurrentMonth: true 時，當年排除當月
function setAddMonthOptions(selectedYear, thisMonth, excludeCurrentMonth = false) {
    const now = new Date();
    const thisYear = now.getFullYear();
    let maxMonth = 12;
    if (selectedYear === thisYear) {
        maxMonth = thisMonth - (excludeCurrentMonth ? 1 : 0);
    }
=======
function setAddMonthOptions(selectedYear, thisMonth) {
    const now = new Date();
    const thisYear = now.getFullYear();
    let maxMonth = 12;
    if (selectedYear === thisYear) maxMonth = thisMonth;
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
    let monthOpts = '';
    for (let m = 1; m <= maxMonth; m++) {
        monthOpts += `<option value="${String(m).padStart(2, '0')}">${String(m).padStart(2, '0')}</option>`;
    }
    document.getElementById('addMonthInput').innerHTML = monthOpts;
}

<<<<<<< HEAD
// 新增水費資料按鈕事件
// 新增成功後自動刷新 table、圖表與下拉選單
// 若查詢區塊有選擇範圍，則依照目前查詢條件自動查詢
// 否則顯示全部
=======
// 查詢區塊：起始/結束月份聯動（保留原本選擇）
document.getElementById('startMonthInput').onchange = function () {
    const start = this.value;
    const endSel = document.getElementById('endMonthInput');
    const prevEnd = endSel.value;
    // 取所有選項（排除"全部"）
    const allOpts = Array.from(endSel.options)
        .map(opt => opt.value)
        .filter(opt => opt); // 不為空即有效年月
    // 過濾掉比start小的選項
    let filteredOpts = allOpts.filter(opt => opt >= start);
    // 重新組合 options
    endSel.innerHTML = '<option value="">全部</option>' + filteredOpts.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    // 如果原本的 end 還在新選項中就還原，否則設為""
    if (prevEnd && filteredOpts.includes(prevEnd)) {
        endSel.value = prevEnd;
    } else {
        endSel.value = '';
    }
};

document.getElementById('endMonthInput').onchange = function () {
    const end = this.value;
    const startSel = document.getElementById('startMonthInput');
    const prevStart = startSel.value;
    // 取所有選項（排除"全部"）
    const allOpts = Array.from(startSel.options)
        .map(opt => opt.value)
        .filter(opt => opt); // 不為空即有效年月
    // 過濾掉比end大的選項
    let filteredOpts = allOpts.filter(opt => opt <= end);
    startSel.innerHTML = '<option value="">全部</option>' + filteredOpts.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    // 如果原本的 start 還在新選項中就還原，否則設為""
    if (prevStart && filteredOpts.includes(prevStart)) {
        startSel.value = prevStart;
    } else {
        startSel.value = '';
    }
};

// 新增水費資料按鈕事件
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
document.getElementById('addBtn').onclick = async function (e) {
    e.preventDefault();
    const yearVal = document.getElementById('addYearInput').value;
    const monthVal = document.getElementById('addMonthInput').value;
    const priceVal = document.getElementById('addPriceInput').value;
    if (!yearVal || !monthVal || !priceVal) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "請輸入完整資料"
        });
        return;
    }
    if (parseFloat(priceVal) <= 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "價格指數必須大於0"
        });
        return;
    }
    const date = `${yearVal}-M${parseInt(monthVal, 10)}`;
    const price = parseFloat(priceVal);
    // 先檢查是否已存在該年月
    const data = await fetchPrices();
    if (data.some(row => row.date === date)) {
        Swal.fire({
            title: '',
            html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <img src="/images/ShakingHeadDrop.gif" style="width:350px;max-width:90vw;box-shadow:none;border-radius:32px;border:none;outline:none;">
          <div style="font-size:2.2rem;font-weight:bold;margin-top:15px;color:#e53935;letter-spacing:2px;">新增失敗</div>
          <div style="font-size:1.1rem;color:#555;margin-top:15px;">該歷史資料已存在，水滴寶寶不給建立</div>
        </div>
      `,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'swal2-waterdrop'
            }
        });
        return;
    }
    // 呼叫 API 新增
    const res = await fetch('/api/prices', {
        method: 'POST',
<<<<<<< HEAD
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date, name: '水費', price})
    });
    if (res.ok) {
        await Swal.fire({
=======
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, name: '水費', price })
    });
    if (res.ok) {
        Swal.fire({
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
            title: '',
            html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <img src="/images/JumpDrop.gif" style="width:350px;max-width:90vw;box-shadow:none;border-radius:32px;border:none;outline:none;">
          <div style="font-size:2.2rem;font-weight:bold;margin-top:15px;color:#1e88e5;letter-spacing:2px;">新增成功</div>
          <div style="font-size:1.1rem;color:#555;margin-top:15px;">您該才輸入的資料，水滴寶寶完成建立</div>
        </div>
      `,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'swal2-waterdrop'
            }
        });
        document.getElementById('addPriceInput').value = '';
        // 新增後預設回到當前年月
        setAddYearMonthSelect();
<<<<<<< HEAD
        // 重新查詢並刷新下拉選單
        const data2 = await fetchPrices();
        setMonthSelects(data2, true); // 新增後重設下拉選單，保留選擇
        // 取得目前查詢條件
        const start = document.getElementById('startMonthInput').value;
        const end = document.getElementById('endMonthInput').value;
        let filtered = data2;
        if (start || end) {
            filtered = data2.filter(row => {
                const m = row.date.match(/^(\d{4})-M(\d{1,2})$/);
                if (!m) return false;
                const yyyymm = m[1] + '-' + m[2].padStart(2, '0');
                if (start && end) return yyyymm >= start && yyyymm <= end;
                if (start) return yyyymm >= start;
                if (end) return yyyymm <= end;
                return true;
            });
        }
        renderTable(filtered);
        renderPriceChart(filtered);
=======
        // 重新查詢並刷新下拉選單與表格
        const data2 = await fetchPrices();
        setMonthSelects(data2);
        // 不主動刷新表格
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
    } else {
        Swal.fire({
            title: '',
            html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <img src="/images/ShakingHeadDrop.gif" style="width:260px;max-width:90vw;box-shadow:none;border-radius:32px;border:none;outline:none;">
          <div style="font-size:2.2rem;font-weight:bold;margin-top:18px;color:#e53935;letter-spacing:2px;">新增失敗</div>
          <div style="font-size:1.1rem;color:#555;margin-top:8px;">新增失敗，請稍後再試</div>
        </div>
      `,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            customClass: {
                popup: 'swal2-waterdrop'
            }
        });
    }
};

// 新增區塊支援 Enter 快捷鍵
document.getElementById('addPriceInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
});

// loading spinner 相關
let loadingDiv = null;
<<<<<<< HEAD

=======
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
function showLoading() {
    if (!loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.style.position = 'fixed';
        loadingDiv.style.left = '0';
        loadingDiv.style.top = '0';
        loadingDiv.style.width = '100vw';
        loadingDiv.style.height = '100vh';
        loadingDiv.style.background = 'rgba(255,255,255,0.5)';
        loadingDiv.style.display = 'flex';
        loadingDiv.style.alignItems = 'center';
        loadingDiv.style.justifyContent = 'center';
        loadingDiv.style.zIndex = '9999';
        loadingDiv.innerHTML = '<div style="font-size:2rem;">Loading...</div>';
        document.body.appendChild(loadingDiv);
    }
    loadingDiv.style.display = 'flex';
}
<<<<<<< HEAD

function hideLoading() {
    if (loadingDiv) loadingDiv.style.display = 'none';
}

=======
function hideLoading() {
    if (loadingDiv) loadingDiv.style.display = 'none';
}
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
// 包裝 fetchPrices 加入 loading 動畫
async function fetchPricesWithLoading(date) {
    showLoading();
    const data = await fetchPrices(date);
    hideLoading();
    return data;
}

<<<<<<< HEAD
// ===== Chart.js 動態繪製水費價格指數折線圖 =====
let priceChart = null;

async function renderPriceChart(data) {
    if (!data) {
        data = await fetchPrices();
    }
    // 依日期排序
    data.sort((a, b) => {
        const dateA = formatDate(a.date);
        const dateB = formatDate(b.date);
        return dateA.localeCompare(dateB);
    });
    // 取得 x 軸（年月）與 y 軸（價格指數）
    const labels = data.map(row => formatDate(row.date));
    const prices = data.map(row => parseFloat(row.price));
    const ctx = document.getElementById('priceChart').getContext('2d');
    // 若已存在圖表則先銷毀
    if (priceChart) priceChart.destroy();
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '水費價格指數',
                data: prices,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {display: true},
                title: {
                    display: true,
                    text: '水費價格指數趨勢圖',
                    font: { size: 29, weight: 'bold' } // 與 section h2 字體大小一致
                }
            },
            scales: {
                x: {title: {display: true, text: '年月'}},
                y: {title: {display: true, text: '價格指數'}}
            }
        }
    });
}

// 頁面載入時自動繪製圖表
window.addEventListener('DOMContentLoaded', () => {
    renderPriceChart();
});

=======
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
// ========== 頁面載入時只初始化下拉選單，不顯示表格（連表頭都不留） ==========
window.onload = async function () {
    setAddYearMonthSelect();
    const data = await fetchPricesWithLoading();
<<<<<<< HEAD
    setMonthSelects(data, true);
    // 預設選擇最早到最晚
    const months = getMonthOptions(data);
    if (months.length > 0) {
        document.getElementById('startMonthInput').value = months[0];
        document.getElementById('endMonthInput').value = months[months.length - 1];
    }
    hideTable();
};
=======
    setMonthSelects(data);
    // 進來時直接隱藏表格（連表頭都不顯示）
    hideTable();
};
>>>>>>> 5c2e54f2386aec10f88b5a113da76b0ec52b40d5
