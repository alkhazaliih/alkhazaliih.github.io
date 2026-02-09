const GITHUB_REPOS = {
  'ruhul-bypass': {
    api: 'https://api.github.com/repos/Alkhazalih/RuhulBYPASSBETA/releases/latest',
    releases: 'https://github.com/Alkhazalih/RuhulBYPASSBETA/releases'
  },
  'hubber-checker': {
    api: 'https://api.github.com/repos/Alkhazalih/Hubber-Checker-X/releases/latest',
    releases: 'https://github.com/Alkhazalih/Hubber-Checker-X/releases'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('changelog-modal');
  const overlay = modal?.querySelector('.changelog-overlay');
  const closeBtn = modal?.querySelector('.changelog-close');
  const contentEl = document.getElementById('changelog-content');
  const titleEl = document.getElementById('changelog-title');

  const titles = {
    'ruhul-bypass': 'Ruhul Bypass — Change Logs',
    'hubber-checker': 'Hubber-Checker-X — Change Logs',
    'quest-spoofer': 'QuestSpoofer — Change Logs'
  };

  async function fetchGitHubChangelog(repoId) {
    const repo = GITHUB_REPOS[repoId];
    if (!repo) return null;
    try {
      const res = await fetch(repo.api);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const tagName = data.tag_name || 'Latest';
      const body = data.body || 'No release notes available.';
      const html = typeof marked !== 'undefined' ? marked.parse(body) : body.replace(/\n/g, '<br>');
      return `
        <div class="changelog-github">
          <a href="${repo.releases}" target="_blank" rel="noopener" class="changelog-source">
            <i class="fa-brands fa-github"></i> View on GitHub
          </a>
          <span class="version-tag">${tagName}</span>
          <div class="changelog-markdown">${html}</div>
        </div>
      `;
    } catch (err) {
      return `
        <div class="changelog-error">
          <p>Could not load changelog from GitHub.</p>
          <a href="${repo.releases}" target="_blank" rel="noopener" class="changelog-link">
            View releases on GitHub
          </a>
        </div>
      `;
    }
  }

  async function openModal(id) {
    if (!contentEl) return;

    titleEl.textContent = titles[id] || 'Change Logs';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (GITHUB_REPOS[id]) {
      contentEl.innerHTML = '<div class="changelog-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading from GitHub...</div>';
      contentEl.innerHTML = await fetchGitHubChangelog(id);
    } else {
      const template = document.getElementById(`changelog-${id}`);
      contentEl.innerHTML = template ? template.innerHTML : '<p>No changelog available.</p>';
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.changelog-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-changelog');
      if (id) openModal(id);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal();
  });
});
