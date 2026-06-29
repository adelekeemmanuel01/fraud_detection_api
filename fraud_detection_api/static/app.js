const API = 'http://127.0.0.1:5000';
let stats = { total: 0, fraud: 0, legit: 0 };
let history = [];

async function analyseTransaction() {
    const payload = {
        step: +document.getElementById('step').value,
        type: document.getElementById('type').value,
        amount: +document.getElementById('amount').value,
        oldbalanceOrg: +document.getElementById('oldbalanceOrg').value,
        newbalanceOrig: +document.getElementById('newbalanceOrig').value,
        oldbalanceDest: +document.getElementById('oldbalanceDest').value,
        newbalanceDest: +document.getElementById('newbalanceDest').value,
    };

    document.getElementById('spinner').style.display = 'block';
    document.getElementById('result-panel').style.display = 'none';

    try {
        const res = await fetch(`${API}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        showResult(data, payload);
        addToHistory(data, payload);
        updateStats(data);
    } catch (err) {
        alert('Could not reach the API. Make sure app.py is running on port 5000.');
    } finally {
        document.getElementById('spinner').style.display = 'none';
    }
}

function showResult(data, payload) {
    const panel = document.getElementById('result-panel');
    const isFraud = data.prediction === 1;
    const pct = (data.fraud_probability * 100).toFixed(2);

    panel.className = `result-panel ${isFraud ? 'fraud' : 'legitimate'}`;
    panel.style.display = 'block';

    document.getElementById('result-icon').innerHTML = isFraud
        ? '<span class="icon icon-lg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 4v5c0 4.2-2.8 7.8-7 9-4.2-1.2-7-4.8-7-9V7l7-4z"/><path d="M9.5 12.5l1.8 1.8 3.2-4"/></svg></span>'
        : '<span class="icon icon-lg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l4 4 10-10"/></svg></span>';

    document.getElementById('result-label').textContent = isFraud ? 'FRAUDULENT TRANSACTION' : 'LEGITIMATE TRANSACTION';
    document.getElementById('result-prob').textContent = `Fraud probability: ${pct}%`;

    const bar = document.getElementById('prob-bar');
    bar.style.width = `${pct}%`;
    bar.className = `prob-bar-fill ${data.risk_level === 'HIGH' ? 'high' : data.risk_level === 'MEDIUM' ? 'medium' : 'low'}`;
    document.getElementById('bar-pct').textContent = `${pct}%`;

    document.getElementById('d-risk').innerHTML = `<span class="risk-badge risk-${data.risk_level}">${data.risk_level}</span>`;
    document.getElementById('d-type').textContent = data.transaction_summary.type;
    document.getElementById('d-amount').textContent = `₦${data.transaction_summary.amount.toLocaleString()}`;
    document.getElementById('d-delta').textContent = `₦${data.transaction_summary.balance_delta.toLocaleString()}`;
}

function addToHistory(data, payload) {
    const isFraud = data.prediction === 1;
    const pct = (data.fraud_probability * 100).toFixed(1);
    const now = new Date().toLocaleTimeString();

    const item = { isFraud, pct, type: payload.type, amount: payload.amount, time: now };
    history.unshift(item);

    document.getElementById('empty-msg')?.remove();

    const list = document.getElementById('history-list');
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
    <div class="history-dot ${isFraud ? 'fraud' : 'legit'}"></div>
    <div class="history-info">
      <div class="h-type">${payload.type} · ₦${payload.amount.toLocaleString()}</div>
      <div class="h-time">${now} · Fraud prob: ${pct}%</div>
    </div>
    <span class="history-badge ${isFraud ? 'fraud' : 'legit'}">
      ${isFraud ? 'FRAUD' : 'LEGIT'}
    </span>
  `;
    list.prepend(div);
}

function updateStats(data) {
    stats.total++;
    data.prediction === 1 ? stats.fraud++ : stats.legit++;
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-fraud').textContent = stats.fraud;
    document.getElementById('stat-legit').textContent = stats.legit;
    document.getElementById('stat-rate').textContent = `${((stats.fraud / stats.total) * 100).toFixed(1)}%`;
}

function clearHistory() {
    document.getElementById('history-list').innerHTML = '<div class="empty-history" id="empty-msg">No transactions analysed yet.<br>Submit one to get started.</div>';
    stats = { total: 0, fraud: 0, legit: 0 };
    updateStats({ prediction: -1 });
    stats = { total: 0, fraud: 0, legit: 0 };
    ['stat-total', 'stat-fraud', 'stat-legit'].forEach(id => document.getElementById(id).textContent = '0');
    document.getElementById('stat-rate').textContent = '0%';
}

function clearForm() {
    ['step', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('result-panel').style.display = 'none';
}

function fillFraud() {
    document.getElementById('type').value = 'TRANSFER';
    document.getElementById('step').value = '1';
    document.getElementById('amount').value = '1338487';
    document.getElementById('oldbalanceOrg').value = '1338487';
    document.getElementById('newbalanceOrig').value = '0';
    document.getElementById('oldbalanceDest').value = '0';
    document.getElementById('newbalanceDest').value = '1338487';
}

function fillLegit() {
    document.getElementById('type').value = 'PAYMENT';
    document.getElementById('step').value = '5';
    document.getElementById('amount').value = '500';
    document.getElementById('oldbalanceOrg').value = '50000';
    document.getElementById('newbalanceOrig').value = '49500';
    document.getElementById('oldbalanceDest').value = '1000';
    document.getElementById('newbalanceDest').value = '1500';
}
