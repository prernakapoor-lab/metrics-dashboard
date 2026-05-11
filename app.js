// ─── State ─────────────────────────────────────────────────────────────────
const state = {
  currentSignal: null,
  sentCustomers: new Set(),
  assignedCustomers: new Set(),
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function personalise(template, customer) {
  const firstName = customer.name.split(' ')[0];
  const frame = customer.frame && customer.frame !== '—' ? customer.frame : 'your selected frame';
  return template
    .replace(/\[Name\]/g, firstName)
    .replace(/\[Frame\]/g, frame)
    .replace(/\[Brand\]/g, frame.split(' ')[0]);
}

// ─── Zone summary bar ──────────────────────────────────────────────────────
function renderZoneBar() {
  const el = document.getElementById('zone-bar');
  el.innerHTML = ZONE_CARDS.map(card => `
    <div class="zone-card${card.highlight ? ' highlight' : ''}">
      <div class="zone-card-label">${escHtml(card.label)}</div>
      <div class="zone-card-value">${escHtml(card.value)}</div>
      <div class="zone-card-sub">${escHtml(card.sub)}</div>
      <div class="zone-card-delta ${card.deltaClass}">${escHtml(card.delta)}</div>
    </div>
  `).join('');
}

// ─── Buckets grid ──────────────────────────────────────────────────────────
function renderBuckets() {
  const grid = document.getElementById('buckets-grid');
  grid.innerHTML = BUCKETS.map(b => {
    const totalCount = b.signals.reduce((sum, s) => sum + s.count, 0);
    const signals = b.signals.map(s => `
      <div class="signal-row" onclick="openSignal('${b.id}','${s.id}')">
        <div class="signal-info">
          <div class="signal-name">${escHtml(s.name)}</div>
          <div class="signal-meta">${escHtml(s.meta)}</div>
        </div>
        <div class="signal-right">
          <div class="signal-count" style="color:${s.pri === 'high' ? 'var(--danger-text)' : s.pri === 'med' ? 'var(--warning-text)' : 'var(--success-text)'}">${s.count}</div>
          <div class="pri-badge pri-${s.pri === 'high' ? 'high' : s.pri === 'med' ? 'med' : 'low'}">${s.pri === 'high' ? 'High' : s.pri === 'med' ? 'Medium' : 'Low'}</div>
        </div>
      </div>
    `).join('');

    return `
      <div class="bucket">
        <div class="bucket-header">
          <div class="bucket-header-left">
            <div class="bucket-icon" style="background:${b.iconBg};color:${b.iconColor}">
              <i class="ti ${b.icon}"></i>
            </div>
            <div>
              <div class="bucket-title">${escHtml(b.title)}</div>
              <div class="bucket-count">${totalCount} customers · ${b.signals.length} signals</div>
            </div>
          </div>
          <div class="bucket-badge pri-badge pri-${b.todayPri === 'high' ? 'high' : b.todayPri === 'med' ? 'med' : 'low'}">${b.todayCount} today</div>
        </div>
        <div class="signal-list">${signals}</div>
      </div>
    `;
  }).join('');
}

// ─── Open signal panel ─────────────────────────────────────────────────────
function openSignal(bucketId, signalId) {
  const bucket = BUCKETS.find(b => b.id === bucketId);
  const signal = bucket.signals.find(s => s.id === signalId);
  const customers = CUSTOMERS[signalId] || [];

  state.currentSignal = { bucketId, signalId };

  document.getElementById('panel-title').textContent = signal.name;
  document.getElementById('panel-sub').textContent = `${customers.length} customer${customers.length !== 1 ? 's' : ''} in your zone · ${bucket.title}`;

  renderCustomerList(signalId, customers);
  document.getElementById('panel-overlay').classList.add('open');
}

// ─── Customer list ─────────────────────────────────────────────────────────
function renderCustomerList(signalId, customers) {
  const isReturnSignal = ['fit_issue', 'power_issue', 'quality_issue', 'changed_mind'].includes(signalId);
  const body = document.getElementById('panel-body');

  const cards = customers.map((c, i) => {
    const isSent = state.sentCustomers.has(c.phone);
    const isAssigned = state.assignedCustomers.has(c.phone);

    const tags = [
      c.gold ? '<span class="tag tag-gold">Gold</span>' : '',
      c.affluence === 'High' ? '<span class="tag tag-high">High affluence</span>' : '',
      c.returnFlag ? '<span class="tag tag-return">Return initiated</span>' : '',
      c.tags.includes('lapsed') ? '<span class="tag tag-lapsed">Lapsed</span>' : '',
      c.tags.includes('new') ? '<span class="tag tag-new">New member</span>' : '',
    ].filter(Boolean).join('');

    const frameDetail = c.frame && c.frame !== '—'
      ? `<div class="cust-detail wide"><div class="cust-detail-label">Frame / product</div><div class="cust-detail-val" style="font-size:11px">${escHtml(c.frame)}</div></div>`
      : '';

    const actionBar = (!isSent && !isAssigned) ? `
      <div class="action-bar" id="actions-${i}">
        ${isReturnSignal ? `<button class="act-btn warn" onclick="startWAFlow('${signalId}', ${i})"><i class="ti ti-phone"></i> Call first</button>` : ''}
        <button class="act-btn primary" onclick="startWAFlow('${signalId}', ${i})"><i class="ti ti-brand-whatsapp"></i> Send WA</button>
        <button class="act-btn secondary" onclick="startAssignFlow('${signalId}', ${i})"><i class="ti ti-user-plus"></i> Assign</button>
      </div>
    ` : '';

    const statusBanners = [
      isSent ? '<div class="success-banner"><i class="ti ti-check"></i> WA outreach sent — logged in outreach tracker</div>' : '',
      isAssigned ? '<div class="success-banner"><i class="ti ti-user-check"></i> Task assigned to associate</div>' : '',
    ].filter(Boolean).join('');

    return `
      <div class="customer-card" id="ccard-${i}">
        <div class="cust-row">
          <div class="cust-avatar">${escHtml(c.initials)}</div>
          <div style="flex:1;min-width:0">
            <div class="cust-name">${escHtml(c.name)}</div>
            <div class="cust-meta">${escHtml(c.phone)} · ${escHtml(c.signal)}</div>
          </div>
          <div class="cust-age">${escHtml(c.age)}</div>
        </div>
        ${tags ? `<div class="cust-tags">${tags}</div>` : ''}
        <div class="cust-details">
          <div class="cust-detail"><div class="cust-detail-label">Affluence</div><div class="cust-detail-val">${escHtml(c.affluence)}</div></div>
          <div class="cust-detail"><div class="cust-detail-label">LTV</div><div class="cust-detail-val">${escHtml(c.ltv)}</div></div>
          ${frameDetail}
        </div>
        ${actionBar}
        ${statusBanners}
        <div class="wa-flow" id="wa-flow-${i}"></div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <p class="panel-hint">${customers.length} customer${customers.length !== 1 ? 's' : ''} · tap an action to begin outreach</p>
    <div class="customer-list">${cards}</div>
  `;

  // Store customers for later access
  window._panelCustomers = customers;
  window._panelSignalId = signalId;
}

// ─── WA outreach flow ──────────────────────────────────────────────────────
function startWAFlow(signalId, custIdx) {
  closeAllFlows(custIdx);
  const templates = TEMPLATES[signalId] || [];
  const flowEl = document.getElementById(`wa-flow-${custIdx}`);
  flowEl.className = 'wa-flow open';

  const tplOptions = templates.map((t, ti) => `
    <div class="template-opt" id="topt-${custIdx}-${ti}" onclick="selectTemplate(${custIdx}, ${ti}, '${signalId}')">
      <div class="template-opt-name">${escHtml(t.name)}</div>
      <div class="template-opt-preview">${escHtml(t.preview)}</div>
    </div>
  `).join('');

  flowEl.innerHTML = `
    <div class="wa-step">
      <div class="wa-step-title"><i class="ti ti-template"></i> Select message template</div>
      <div class="template-options">${tplOptions}</div>
    </div>
    <div class="wa-preview-block" id="wa-preview-block-${custIdx}">
      <div class="wa-step">
        <div class="wa-step-title"><i class="ti ti-eye"></i> Message preview (personalised)</div>
        <div class="wa-preview" id="wa-preview-${custIdx}"></div>
      </div>
      <div class="wa-actions">
        <button class="wa-send-btn" onclick="confirmSendWA(${custIdx})"><i class="ti ti-brand-whatsapp"></i> Send via WhatsApp</button>
        <button class="cancel-btn" onclick="closeFlow(${custIdx})">Cancel</button>
      </div>
    </div>
  `;
}

function selectTemplate(custIdx, tplIdx, signalId) {
  // Highlight selected template
  document.querySelectorAll(`[id^="topt-${custIdx}-"]`).forEach(el => el.classList.remove('selected'));
  const selectedEl = document.getElementById(`topt-${custIdx}-${tplIdx}`);
  if (selectedEl) selectedEl.classList.add('selected');

  // Personalise and show preview
  const tpl = (TEMPLATES[signalId] || [])[tplIdx];
  const cust = window._panelCustomers[custIdx];
  if (!tpl || !cust) return;

  const personalised = personalise(tpl.full, cust);
  const previewEl = document.getElementById(`wa-preview-${custIdx}`);
  const previewBlock = document.getElementById(`wa-preview-block-${custIdx}`);
  if (previewEl) previewEl.textContent = personalised;
  if (previewBlock) previewBlock.classList.add('open');

  window[`_selTpl_${custIdx}`] = tplIdx;
}

function confirmSendWA(custIdx) {
  const cust = window._panelCustomers[custIdx];
  state.sentCustomers.add(cust.phone);

  const flowEl = document.getElementById(`wa-flow-${custIdx}`);
  flowEl.innerHTML = '<div class="success-banner"><i class="ti ti-check"></i> WA sent — logged in outreach tracker with timestamp</div>';

  const actionsEl = document.getElementById(`actions-${custIdx}`);
  if (actionsEl) actionsEl.remove();
}

// ─── Associate assignment flow ─────────────────────────────────────────────
function startAssignFlow(signalId, custIdx) {
  closeAllFlows(custIdx);
  const flowEl = document.getElementById(`wa-flow-${custIdx}`);
  flowEl.className = 'wa-flow open';

  const chips = ASSOCIATES.map((a, ai) => `
    <div class="assoc-chip" id="achip-${custIdx}-${ai}" onclick="selectAssociate(${custIdx}, ${ai})">${escHtml(a)}</div>
  `).join('');

  flowEl.innerHTML = `
    <div class="wa-step">
      <div class="wa-step-title"><i class="ti ti-user-plus"></i> Assign to associate</div>
      <div class="assign-options">${chips}</div>
      <div class="wa-actions">
        <button class="assign-confirm-btn" onclick="confirmAssign(${custIdx})"><i class="ti ti-check"></i> Confirm assignment</button>
        <button class="cancel-btn" onclick="closeFlow(${custIdx})">Cancel</button>
      </div>
    </div>
  `;
}

function selectAssociate(custIdx, assocIdx) {
  document.querySelectorAll(`[id^="achip-${custIdx}-"]`).forEach(el => el.classList.remove('selected'));
  const chip = document.getElementById(`achip-${custIdx}-${assocIdx}`);
  if (chip) chip.classList.add('selected');
  window[`_selAssoc_${custIdx}`] = assocIdx;
}

function confirmAssign(custIdx) {
  const assocIdx = window[`_selAssoc_${custIdx}`];
  if (assocIdx === undefined) {
    const flowEl = document.getElementById(`wa-flow-${custIdx}`);
    flowEl.insertAdjacentHTML('beforeend', '<div class="info-banner"><i class="ti ti-info-circle"></i> Please select an associate first.</div>');
    return;
  }
  const cust = window._panelCustomers[custIdx];
  state.assignedCustomers.add(cust.phone);

  const flowEl = document.getElementById(`wa-flow-${custIdx}`);
  flowEl.innerHTML = `<div class="success-banner"><i class="ti ti-user-check"></i> Task assigned to ${escHtml(ASSOCIATES[assocIdx])} — they'll see it in their task list</div>`;

  const actionsEl = document.getElementById(`actions-${custIdx}`);
  if (actionsEl) actionsEl.remove();
}

// ─── Utility ───────────────────────────────────────────────────────────────
function closeFlow(custIdx) {
  const flowEl = document.getElementById(`wa-flow-${custIdx}`);
  if (flowEl) { flowEl.className = 'wa-flow'; flowEl.innerHTML = ''; }
}

function closeAllFlows(exceptIdx) {
  document.querySelectorAll('.wa-flow.open').forEach(el => {
    const idParts = el.id.split('-');
    const idx = parseInt(idParts[idParts.length - 1]);
    if (idx !== exceptIdx) { el.className = 'wa-flow'; el.innerHTML = ''; }
  });
}

// ─── Panel close ───────────────────────────────────────────────────────────
document.getElementById('panel-scrim').addEventListener('click', () => {
  document.getElementById('panel-overlay').classList.remove('open');
});
document.getElementById('panel-close').addEventListener('click', () => {
  document.getElementById('panel-overlay').classList.remove('open');
});

// ─── Init ──────────────────────────────────────────────────────────────────
renderZoneBar();
renderBuckets();
