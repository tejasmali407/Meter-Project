/* ============================================================
   analytics.js — Smart Analytics Module
   Meter Electricity Bill Tracker
   Features: F1–F9 (History, Chart, Insights, Daily Cost,
             Tips, Consumption Bar, PDF Export, Auto Lang, App-like UX)
   ============================================================ */

'use strict';

const HISTORY_KEY = 'meter:history';
const MAX_HISTORY = 10;

// ============================================================
// F1 — USAGE HISTORY
// ============================================================

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveHistoryEntry(entry) {
    let history = getHistory();
    history.unshift(entry); // newest first
    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
}

function formatHistoryDate(dateStr) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function renderHistory() {
    const grid = document.getElementById('historyGrid');
    const emptyEl = document.getElementById('historyEmptyState');
    if (!grid) return;

    const history = getHistory();

    // Remove all existing history entry cards (but not the empty state)
    Array.from(grid.querySelectorAll('.historyEntry')).forEach(el => el.remove());

    if (history.length === 0) {
        if (emptyEl) emptyEl.hidden = false;
        return;
    }
    if (emptyEl) emptyEl.hidden = true;

    history.forEach((entry, i) => {
        const card = document.createElement('div');
        card.className = 'historyEntry';
        card.innerHTML = `
      <div class="historyEntryDate">${formatHistoryDate(entry.date)}</div>
      <div class="historyEntryRow">
        <div class="historyEntryStat">
          <div class="historyEntryLabel">Units</div>
          <div class="historyEntryValue">${Number(entry.unitsUsed).toFixed(1)}</div>
        </div>
        <div class="historyEntryStat">
          <div class="historyEntryLabel">Bill</div>
          <div class="historyEntryValue historyEntryBill">₹${Number(entry.estimatedBill).toFixed(0)}</div>
        </div>
        <div class="historyEntryStat">
          <div class="historyEntryLabel">District</div>
          <div class="historyEntryValue historyEntryDistrict">${entry.district}</div>
        </div>
      </div>
    `;
        grid.appendChild(card);
    });
}

// ============================================================
// F2 — BILL TREND CHART (Chart.js)
// ============================================================

let trendChartInstance = null;

function renderTrendChart() {
    const canvas = document.getElementById('usageTrendChart');
    const emptyState = document.getElementById('chartEmptyState');
    if (!canvas) return;

    const history = getHistory();
    const chartWrap = canvas.closest('.chartWrap');

    if (history.length === 0) {
        if (chartWrap) chartWrap.hidden = true;
        if (emptyState) emptyState.hidden = false;
        return;
    }

    if (chartWrap) chartWrap.hidden = false;
    if (emptyState) emptyState.hidden = true;

    // Chart.js data — reverse so oldest is left, newest is right
    const ordered = [...history].reverse();
    const labels = ordered.map(e => formatHistoryDate(e.date));
    const unitsData = ordered.map(e => Number(e.unitsUsed));
    const billData = ordered.map(e => Number(e.estimatedBill));

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Units Used',
                data: unitsData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.08)',
                borderWidth: 2.5,
                pointBackgroundColor: '#2563eb',
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: true,
                yAxisID: 'yUnits',
            },
            {
                label: 'Est. Bill (₹)',
                data: billData,
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22,163,74,0.06)',
                borderWidth: 2,
                pointBackgroundColor: '#16a34a',
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: false,
                borderDash: [5, 3],
                yAxisID: 'yBill',
            }
        ]
    };

    const cfg = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 600, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { font: { size: 12 }, usePointStyle: true, padding: 16 }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            if (ctx.datasetIndex === 0) return ` ${ctx.raw} units`;
                            return ` ₹${ctx.raw.toFixed(0)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, maxRotation: 30 }
                },
                yUnits: {
                    type: 'linear',
                    position: 'left',
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { font: { size: 11 } },
                    title: { display: true, text: 'Units', font: { size: 11 } }
                },
                yBill: {
                    type: 'linear',
                    position: 'right',
                    grid: { display: false },
                    ticks: { font: { size: 11 }, callback: v => `₹${v}` },
                    title: { display: true, text: '₹ Bill', font: { size: 11 } }
                }
            }
        }
    };

    if (trendChartInstance) {
        trendChartInstance.data = chartData;
        trendChartInstance.update('active');
    } else {
        trendChartInstance = new Chart(canvas, cfg);
    }
}

// ============================================================
// F3 — SMART USAGE INSIGHTS
// ============================================================

function renderInsight() {
    const card = document.getElementById('insightCard');
    const icon = document.getElementById('insightIcon');
    const text = document.getElementById('insightText');
    if (!card || !icon || !text) return;

    const history = getHistory();
    if (history.length < 2) {
        // Only one entry — show a neutral greeting
        if (history.length === 1) {
            card.hidden = false;
            card.className = 'analyticsCard insightCard insight-info';
            icon.textContent = 'ℹ️';
            text.textContent = 'First entry recorded. Calculate again next month to see usage trends.';
        } else {
            card.hidden = true;
        }
        return;
    }

    const latest = history[0];
    const previous = history[1];
    const latestUnits = Number(latest.unitsUsed);
    const prevUnits = Number(previous.unitsUsed);
    const pctChange = prevUnits > 0 ? ((latestUnits - prevUnits) / prevUnits) * 100 : 0;

    card.hidden = false;
    card.className = 'analyticsCard insightCard';

    if (pctChange > 20) {
        card.classList.add('insight-warning');
        icon.textContent = '⚠️';
        text.textContent = `Your electricity usage increased by ${pctChange.toFixed(0)}% compared to last reading. Check high-consumption appliances.`;
    } else if (pctChange < -5) {
        card.classList.add('insight-success');
        icon.textContent = '✅';
        text.textContent = `Good job! Your electricity usage reduced by ${Math.abs(pctChange).toFixed(0)}% compared to last reading.`;
    } else {
        card.classList.add('insight-info');
        icon.textContent = 'ℹ️';
        text.textContent = `Your usage pattern is stable (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(0)}% vs last reading).`;
    }
}

// ============================================================
// F4 — DAILY COST ESTIMATION
// ============================================================

function renderDailyCost(estimatedBill) {
    const card = document.getElementById('dailyCostCard');
    const valEl = document.getElementById('dailyCostValue');
    if (!card || !valEl) return;

    const daily = estimatedBill / 30;
    valEl.textContent = `₹ ${daily.toFixed(1)} / day`;
    card.hidden = false;
}

// ============================================================
// F5 — SMART SAVING TIPS
// ============================================================

const TIPS = {
    low: [
        '💡 You are maintaining efficient electricity usage. Keep it up!',
        '💡 Great job! Consider checking your meter monthly for continued savings.',
        '💡 Efficient usage detected. Try unplugging standby devices to save even more.',
    ],
    medium: [
        '💡 Consider switching to LED bulbs — they use 75% less energy.',
        '💡 Turn off fans and lights in empty rooms to reduce consumption.',
        '💡 A 5-star rated appliance can save significantly vs a 2-star model.',
    ],
    high: [
        '⚡ High usage detected. ACs and water heaters are often major contributors.',
        '⚡ Check if any old appliances are running inefficiently. Consider replacing them.',
        '⚡ Set your AC to 24°C — each degree lower increases consumption by ~6%.',
    ]
};

let tipInterval = null;
let tipIndex = 0;
let currentTipSet = [];

function getTipCategory(units) {
    if (units < 100) return 'low';
    if (units <= 300) return 'medium';
    return 'high';
}

function renderTip(units) {
    const card = document.getElementById('tipCard');
    const tipEl = document.getElementById('tipText');
    if (!card || !tipEl) return;

    const category = getTipCategory(units);
    currentTipSet = TIPS[category];
    tipIndex = 0;

    tipEl.textContent = currentTipSet[0];
    card.hidden = false;

    if (tipInterval) clearInterval(tipInterval);
    tipInterval = setInterval(() => {
        tipIndex = (tipIndex + 1) % currentTipSet.length;
        tipEl.style.opacity = '0';
        setTimeout(() => {
            tipEl.textContent = currentTipSet[tipIndex];
            tipEl.style.opacity = '1';
        }, 200);
    }, 5000);
}

// ============================================================
// F6 — CONSUMPTION LEVEL INDICATOR
// ============================================================

function renderConsumptionBar(units) {
    const card = document.getElementById('consumptionCard');
    const fill = document.getElementById('consumptionFill');
    const badge = document.getElementById('consumptionBadge');
    if (!card || !fill || !badge) return;

    card.hidden = false;

    // Scale: 0–100 units = 0–33%, 100–300 = 33–66%, 300+ = 66–100%
    let pct, level, color;
    if (units < 100) {
        pct = Math.min((units / 100) * 33, 33);
        level = 'LOW';
        color = '#16a34a'; // green
    } else if (units <= 300) {
        pct = 33 + (((units - 100) / 200) * 33);
        level = 'MEDIUM';
        color = '#d97706'; // orange
    } else {
        pct = 66 + Math.min(((units - 300) / 300) * 34, 34);
        level = 'HIGH';
        color = '#dc2626'; // red
    }

    // Animate width
    fill.style.width = '0%';
    fill.style.background = color;
    badge.textContent = level;
    badge.className = `consumptionBadge badge-${level.toLowerCase()}`;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fill.style.width = `${Math.min(pct, 100).toFixed(1)}%`;
        });
    });
}

// ============================================================
// F7 — EXPORT PDF REPORT
// ============================================================

function exportPDF() {
    if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
        alert('PDF library is loading. Please try again in a moment.');
        return;
    }
    const history = getHistory();
    if (history.length === 0) {
        alert('No usage records to export. Calculate your bill first.');
        return;
    }

    const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    const doc = new jsPDF();

    const latest = history[0];
    const pageW = doc.internal.pageSize.getWidth();

    // Header band
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageW, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Meter — Electricity Usage Report', 14, 17);

    // Date
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW - 14, 10, { align: 'right' });

    // Body
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Latest Reading Summary', 14, 42);

    const fields = [
        ['Date', formatHistoryDate(latest.date)],
        ['District', latest.district],
        ['Bill Mode', latest.billMode],
        ['Units Used', `${Number(latest.unitsUsed).toFixed(2)} kWh`],
        ['Estimated Bill', `Rs. ${Number(latest.estimatedBill).toFixed(2)}`],
        ['Daily Cost (est.)', `Rs. ${(Number(latest.estimatedBill) / 30).toFixed(2)} / day`],
    ];

    let y = 52;
    doc.setFontSize(11);
    fields.forEach(([label, value], i) => {
        if (i % 2 === 0) doc.setFillColor(245, 247, 250);
        else doc.setFillColor(255, 255, 255);
        doc.rect(12, y - 5, pageW - 24, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text(label, 16, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), 90, y);
        y += 12;
    });

    // Usage Insight
    y += 6;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Usage Insight', 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const insightText = document.getElementById('insightText')?.textContent || '—';
    const splitInsight = doc.splitTextToSize(insightText, pageW - 28);
    doc.text(splitInsight, 14, y);
    y += splitInsight.length * 6 + 8;

    // History table
    if (history.length > 1) {
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Usage History (last 10)', 14, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(37, 99, 235);
        doc.setTextColor(255, 255, 255);
        doc.rect(12, y - 5, pageW - 24, 9, 'F');
        doc.text('Date', 14, y);
        doc.text('Units', 75, y);
        doc.text('Est. Bill', 110, y);
        doc.text('District', 150, y);
        y += 8;
        doc.setTextColor(30, 30, 30);
        history.forEach((e, i) => {
            if (y > 270) return;
            if (i % 2 === 0) doc.setFillColor(245, 247, 250);
            else doc.setFillColor(255, 255, 255);
            doc.rect(12, y - 5, pageW - 24, 8, 'F');
            doc.setFont('helvetica', i === 0 ? 'bold' : 'normal');
            doc.text(formatHistoryDate(e.date), 14, y);
            doc.text(String(Number(e.unitsUsed).toFixed(1)), 75, y);
            doc.text(`Rs.${Number(e.estimatedBill).toFixed(0)}`, 110, y);
            doc.text(String(e.district || '—').substring(0, 20), 150, y);
            y += 9;
        });
    }

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, pageH - 18, pageW, 18, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('This is an estimated bill for tracking purposes only. Not an official MSEDCL document.', 14, pageH - 6);

    doc.save(`meter-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ============================================================
// F8 — AUTO LANGUAGE DETECTION (called from app.js main())
// ============================================================

function detectAndSetLanguage() {
    const stored = localStorage.getItem('meter:lang');
    if (stored) return; // User already chose — don't override

    const nav = navigator.language || navigator.userLanguage || 'en';
    const code = nav.toLowerCase();
    let lang = 'en';
    if (code.startsWith('mr')) lang = 'mr';
    else if (code.startsWith('hi')) lang = 'hi';

    const langSelect = document.getElementById('langSelect');
    if (langSelect && langSelect.value !== lang) {
        langSelect.value = lang;
        langSelect.dispatchEvent(new Event('change'));
    }
}

// ============================================================
// F9 — APP-LIKE EXPERIENCE
// ============================================================

function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    header.parentElement.insertBefore(sentinel, header);

    const obs = new IntersectionObserver(
        ([entry]) => header.classList.toggle('headerSticky', !entry.isIntersecting),
        { threshold: 0 }
    );
    obs.observe(sentinel);
}

function initSectionFadeIn() {
    const sections = document.querySelectorAll('.card, .analyticsCard, .analyticsSection');
    const obs = new IntersectionObserver(
        entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('fadeInVisible');
                    obs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.08 }
    );
    sections.forEach(s => {
        s.classList.add('fadeInHidden');
        obs.observe(s);
    });
}

// ============================================================
// MAIN ENTRY — updateAnalytics (called by app.js after calc)
// ============================================================

function updateAnalytics({ date, district, billMode, unitsUsed, estimatedBill }) {
    // F1 — save + render history
    saveHistoryEntry({ date, district, billMode, unitsUsed, estimatedBill });
    renderHistory();

    // F2 — update chart
    renderTrendChart();

    // F3 — insights
    renderInsight();

    // F4 — daily cost
    renderDailyCost(Number(estimatedBill));

    // F5 — tips
    renderTip(Number(unitsUsed));

    // F6 — consumption bar
    renderConsumptionBar(Number(unitsUsed));

    // Show the analytics section
    const section = document.getElementById('analyticsSection');
    if (section) {
        section.hidden = false;
        section.classList.add('fadeInVisible');
        section.classList.remove('fadeInHidden');
        // Smooth scroll to analytics section after a short delay
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
    }
}

// ============================================================
// INIT
// ============================================================

function initAnalytics() {
    // F7 — export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportPDF);

    // F1 — clear history button
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Clear all usage history? This cannot be undone.')) {
                clearHistory();
                renderHistory();
                renderTrendChart();
                // Hide analytics section if no history
                const section = document.getElementById('analyticsSection');
                const history = getHistory();
                if (section && history.length === 0) {
                    section.hidden = true;
                }
            }
        });
    }

    // F8 — auto language
    detectAndSetLanguage();

    // F9 — sticky header + fade-in
    initStickyHeader();
    initSectionFadeIn();

    // On load, render from existing history (e.g. after page refresh)
    const history = getHistory();
    if (history.length > 0) {
        const section = document.getElementById('analyticsSection');
        if (section) section.hidden = false;
        renderHistory();
        renderTrendChart();
        renderInsight();
        const latest = history[0];
        renderDailyCost(Number(latest.estimatedBill));
        renderTip(Number(latest.unitsUsed));
        renderConsumptionBar(Number(latest.unitsUsed));
    }
}

// Boot after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
    initAnalytics();
}
