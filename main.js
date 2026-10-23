/**
 * Nova Explorer - Landing Page Interactivity
 * Built with vanilla JS for instant response, zero framework bloat, and full fidelity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Sync with localStorage)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  const mockupThemeBtn = document.getElementById('toggle-mockup-theme');
  const mockupWindow = document.getElementById('mockup-window');

  function getSavedTheme() {
    return localStorage.getItem('nova_landing_theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nova_landing_theme', theme);

    if (theme === 'light') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }

  // Initialize theme
  applyTheme(getSavedTheme());

  themeToggleBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // Mockup theme toggle allows toggling the preview's theme independently or synchronously
  mockupThemeBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });

  // 2. App-Based Modal System (Rule: No native alerts/prompts)
  const modalBackdrop = document.getElementById('app-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  function openAppModal(title, htmlContent) {
    if (!modalBackdrop) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAppModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeAppModal);
  modalConfirmBtn?.addEventListener('click', closeAppModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeAppModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeAppModal();
    }
  });

  // 3. Command Copy Buttons & Interactive Feedback
  const copyCmdBtn = document.getElementById('copy-cmd-btn');
  const cmdText = document.getElementById('install-cmd-text')?.textContent || 'winget install picwellwisher12pk.nova-explorer';
  const copyWingetBtn = document.getElementById('btn-copy-winget');

  function copyTextToClipboard(text, triggerEl) {
    navigator.clipboard.writeText(text).then(() => {
      // Visual button feedback
      const originalHtml = triggerEl.innerHTML;
      triggerEl.innerHTML = `<span style="color: var(--accent-emerald); font-size: 0.8rem; font-weight: 600;">✓ Copied</span>`;
      setTimeout(() => {
        triggerEl.innerHTML = originalHtml;
      }, 2000);
    }).catch(() => {
      openAppModal('Command Copied', `<p>Run the following command in PowerShell or Windows Terminal:</p><pre style="background: var(--bg-base); padding: 12px; border-radius: 6px; margin-top: 10px; font-family: var(--font-mono);">${text}</pre>`);
    });
  }

  copyCmdBtn?.addEventListener('click', () => copyTextToClipboard(cmdText, copyCmdBtn));
  copyWingetBtn?.addEventListener('click', () => copyTextToClipboard('winget install picwellwisher12pk.nova-explorer', copyWingetBtn));

  // 4. Interactive Hero Mockup View Switcher
  const modePills = document.querySelectorAll('.mode-pill');
  const panesContainer = document.getElementById('panes-container');
  const leftFileTable = document.getElementById('left-file-table');
  const activeFolderBreadcrumb = document.getElementById('mockup-active-folder');

  // Cache initial dual pane markup
  const initialPanesHtml = panesContainer ? panesContainer.innerHTML : '';

  function setMockupMode(mode) {
    modePills.forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');

    if (!panesContainer) return;

    if (mode === 'dual-pane') {
      panesContainer.className = 'mockup-panes-grid';
      panesContainer.innerHTML = initialPanesHtml;
      attachFileRowEvents();
    } else if (mode === 'miller') {
      panesContainer.className = 'mockup-panes-grid';
      panesContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
      panesContainer.innerHTML = `
        <div class="mockup-pane" style="border-right: 1px solid var(--border-subtle);">
          <div class="pane-header-strip"><span>Col 1: C:\\Projects</span></div>
          <table class="file-table">
            <tbody>
              <tr class="file-row"><td class="file-name-cell"><span style="color:var(--accent-cyan)">📁</span> <span>censor-flow</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span style="color:var(--accent-cyan)">📁</span> <span>mediamir</span></td></tr>
              <tr class="file-row selected"><td class="file-name-cell"><span style="color:var(--accent-cyan)">📁</span> <span>nova-explorer</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span style="color:var(--accent-cyan)">📁</span> <span>qaweet</span></td></tr>
            </tbody>
          </table>
        </div>
        <div class="mockup-pane" style="border-right: 1px solid var(--border-subtle);">
          <div class="pane-header-strip"><span>Col 2: nova-explorer</span></div>
          <table class="file-table">
            <tbody>
              <tr class="file-row selected"><td class="file-name-cell"><span style="color:var(--accent-cyan)">📁</span> <span>src-tauri</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span style="color:var(--accent-cyan)">📁</span> <span>src</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span>📄</span> <span>Cargo.toml</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span>📄</span> <span>package.json</span></td></tr>
            </tbody>
          </table>
        </div>
        <div class="mockup-pane">
          <div class="pane-header-strip"><span>Col 3: src-tauri\\src</span></div>
          <table class="file-table">
            <tbody>
              <tr class="file-row selected"><td class="file-name-cell"><span style="color:var(--accent-amber)">🦀</span> <span>lib.rs</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span style="color:var(--accent-amber)">🦀</span> <span>models.rs</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span style="color:var(--accent-amber)">🦀</span> <span>search.rs</span></td></tr>
              <tr class="file-row"><td class="file-name-cell"><span>⚙️</span> <span>tauri.conf.json</span></td></tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (mode === 'transfer') {
      panesContainer.className = 'mockup-panes-grid single-mode';
      panesContainer.style.gridTemplateColumns = '1fr';
      panesContainer.innerHTML = `
        <div class="mockup-pane" style="padding: 12px;">
          <div class="transfer-progress-card">
            <div class="transfer-header">
              <div class="transfer-title">
                <span style="color: var(--accent-cyan);">⚡</span>
                <span>Copying 1,482 items to D:\\Backups\\2026-Release</span>
              </div>
              <span class="transfer-speed">842.6 MB/s · ETA: 4s</span>
            </div>
            <div class="transfer-bar-track">
              <div class="transfer-bar-fill"></div>
            </div>
            <div class="transfer-stats-row">
              <span>Transferred: 3.42 GB / 4.80 GB (71%)</span>
              <span>Processing: src/components/operations/OperationsCenter.tsx</span>
            </div>
          </div>

          <div style="padding: 0 14px 14px 14px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">
              Active Conflict Resolution Policy
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">Auto-Resolve File Collisions</div>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">Rule: "Keep Newer" with automatic timestamp and hash verification.</div>
              </div>
              <span style="font-family: var(--font-mono); font-size: 0.76rem; background: var(--accent-emerald-bg); color: var(--accent-emerald); padding: 4px 10px; border-radius: var(--radius-full); font-weight: 600;">Active</span>
            </div>
          </div>
        </div>
      `;
    } else if (mode === 'quicklook') {
      panesContainer.className = 'mockup-panes-grid single-mode';
      panesContainer.style.gridTemplateColumns = '1fr';
      panesContainer.innerHTML = `
        <div class="mockup-pane" style="padding: 16px;">
          <div class="mockup-quicklook-overlay">
            <div class="quicklook-preview-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
            </div>
            <div class="quicklook-info">
              <h4 class="quicklook-title">Cargo.toml</h4>
              <div class="quicklook-badge">Rust Configuration · 1.4 KB · UTF-8</div>
              <pre class="quicklook-code-snippet"><code>[package]
name = "nova-explorer"
version = "0.14.0"
edition = "2021"

[dependencies]
tauri = { version = "2.0.0", features = ["tray-icon"] }
rayon = "1.10"
sysinfo = "0.33"</code></pre>
            </div>
          </div>
        </div>
      `;
    }
  }

  modePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.getAttribute('data-mode');
      if (mode) setMockupMode(mode);
    });
  });

  // 5. Interactive Mockup File Row Selection & QuickLook trigger
  function attachFileRowEvents() {
    const fileRows = document.querySelectorAll('#mockup-file-rows .file-row');
    fileRows.forEach(row => {
      row.addEventListener('click', () => {
        fileRows.forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');

        const fileName = row.getAttribute('data-name');
        const snippet = row.getAttribute('data-snippet');
        const statusSpan = document.querySelector('.mockup-statusbar span:first-child');
        if (statusSpan && fileName) {
          statusSpan.textContent = `Selected: ${fileName}`;
        }
      });

      row.addEventListener('dblclick', () => {
        setMockupMode('quicklook');
      });
    });
  }

  attachFileRowEvents();

  // 6. Live Mock Search Filter
  const mockSearchInput = document.getElementById('mock-search-input');
  mockSearchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#mockup-file-rows .file-row');
    rows.forEach(row => {
      const name = (row.getAttribute('data-name') || '').toLowerCase();
      if (!query || name.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  // 7. Interactive Keyboard Shortcut Category Filter
  const shortcutFilterBtns = document.querySelectorAll('.shortcut-filter-btn');
  const shortcutItems = document.querySelectorAll('.shortcut-item');

  shortcutFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shortcutFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      shortcutItems.forEach(item => {
        const itemCat = item.getAttribute('data-cat');
        if (cat === 'all' || itemCat === cat) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 8. Cheatsheet Modal Trigger
  const cheatsheetBtn = document.getElementById('hero-open-cheatsheet-btn');
  const footerCheatsheetBtn = document.getElementById('footer-cheatsheet-trigger');

  function openCheatsheetModal(e) {
    if (e) e.preventDefault();
    openAppModal('Nova Explorer — Keyboard Hotkeys', `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>Toggle Dual-Pane Explorer</span>
          <div><kbd>Ctrl</kbd> + <kbd>\\</kbd></div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>Instant QuickLook Preview</span>
          <div><kbd>Space</kbd></div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>Fast Search / Go to File</span>
          <div><kbd>Ctrl</kbd> + <kbd>P</kbd></div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>In-place Batch Rename</span>
          <div><kbd>F2</kbd></div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>Deep Properties & File Hashes</span>
          <div><kbd>Alt</kbd> + <kbd>Enter</kbd></div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0;">
          <span>Toggle Theme</span>
          <div><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd></div>
        </div>
      </div>
    `);
  }

  cheatsheetBtn?.addEventListener('click', openCheatsheetModal);
  footerCheatsheetBtn?.addEventListener('click', openCheatsheetModal);
});
