(function () {
  /** @type {HTMLElement} */
  const outputElement = document.getElementById('output');
  /** @type {HTMLInputElement} */
  const inputElement = document.getElementById('prompt-input');
  const promptRow = document.getElementById('prompt');
  const completionEl = document.getElementById('completion');

  /**
   * @param {string} html
   */
  function printLine(html) {
    const line = document.createElement('div');
    line.className = 'whitespace-pre-wrap break-words';
    line.innerHTML = html;
    outputElement.appendChild(line);
    outputElement.scrollTop = outputElement.scrollHeight;
  }

  function printPrompt(commandText) {
    const safe = escapeHtml(commandText);
    printLine(
      `<span class="text-green-400">guest@Arad</span><span class="mx-2 text-secondary">:</span><span class="text-blue-400">${escapeHtml(cwd)}</span><span class="mx-2 text-secondary">$</span> ${safe}`
    );
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const bullet = (text) => `• ${escapeHtml(text)}`;
  const link = (label, href) => `<a class="text-primary hover:underline" href="${href}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;

  const commands = {
    help() {
      printLine('<span class="text-primary">Available commands:</span>');
      const list = [
        'help - Show this help',
        'about - Show personal summary',
        'projects - List selected projects',

        'skills - Show skills',
        'contact - Show contact links',
        'clear - Clear the terminal',
      ];
      list.forEach((l) => printLine(escapeHtml(l)));
    },

    about() {
      const p = window.SITE_CONFIG.profile;
      printLine(`<span class="text-primary font-semibold">${escapeHtml(p.name)}</span> — ${escapeHtml(p.title)}`);
      if (p.location) printLine(escapeHtml(`Location: ${p.location}`));
      if (p.email) printLine(`Email: ${link(p.email, `mailto:${p.email}`)}`);
      if (p.website) printLine(`Website: ${link(p.website, p.website)}`);
      if (p.summary) {
        printLine('');
        printLine(escapeHtml(p.summary));
      }
    },

    async projects() {
      const config = window.SITE_CONFIG;
      const username = config.github?.username || config.contact?.github?.split('/').pop()?.replace('/', '');

      if (!username) {
        printLine('<span class="text-red-400">Error:</span> GitHub username not configured.');
        printLine('Add "github": {"username": "yourname"} to config.js');
        return;
      }

      printLine(`<span class="text-primary">Fetching repositories for</span> <span class="text-accent">${escapeHtml(username)}</span>...`);

      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const repos = await response.json();

        if (!repos.length) {
          printLine('No public repositories found.');
          return;
        }

        printLine(`<span class="text-primary">Recent repositories:</span>`);
        printLine('');

        repos.forEach((repo) => {
          const name = link(repo.name, repo.html_url);
          const desc = repo.description ? ` — <span class="text-secondary">${escapeHtml(repo.description)}</span>` : '';
          const lang = repo.language ? ` <span class="text-accent">[${escapeHtml(repo.language)}]</span>` : '';
          const stars = repo.stargazers_count > 0 ? ` <span class="text-yellow-400">★${repo.stargazers_count}</span>` : '';
          const updated = new Date(repo.updated_at).toLocaleDateString();
          const fork = repo.fork ? ` <span class="text-gray-400">[FORK]</span>` : '';

          printLine(`${name}${desc}${lang}${stars}${fork}`);
          printLine(`<span class="text-secondary">Updated:</span> ${escapeHtml(updated)}`);
          printLine('');
        });

      } catch (error) {
        printLine(`<span class="text-red-400">Error fetching repositories:</span> ${escapeHtml(error.message)}`);
        printLine('Make sure the username is correct and the repository is public.');
      }
    },

    dick(){
      printLine("26 kir")
    },

    fart(){
      printLine("FART!")
    },

    pussy(){
      printLine("bibit!")
    },


    skills() {
      const s = window.SITE_CONFIG.skills || {};
      const categories = Object.keys(s);
      if (!categories.length) {
        printLine('No skills configured.');
        return;
      }
      categories.forEach((cat) => {
        printLine(`<span class="text-accent">${escapeHtml(cat)}:</span> ${escapeHtml((s[cat] || []).join(', '))}`);
      });
    },

    contact() {
      const c = window.SITE_CONFIG.contact || {};
      const entries = [
        c.email && `Email: ${link(c.email, `mailto:${c.email}`)}`,
        c.github && `GitHub: ${link(c.github, c.github)}`,
        c.discord && `Discord: ${escapeHtml(c.discord)}`,
        c.telegram && `Telegram: ${link(c.telegram, `https://t.me/${c.telegram.replace('@', '')}`)}`,
      ].filter(Boolean);
      if (!entries.length) {
        printLine('No contact methods configured.');
        return;
      }
      entries.forEach((e) => printLine(e));
    },

    clear() {
      outputElement.innerHTML = '';
    },
  };

  function handleCommand(raw) {
    const command = raw.trim();
    if (!command) return;
    printPrompt(command);

    const [name, ...args] = command.split(/\s+/);
    const cmd = name.toLowerCase();

    if (commands[cmd]) {
      try {
        commands[cmd](...args);
      } catch (e) {
        printLine(`<span class="text-red-400">Error:</span> ${escapeHtml(String(e))}`);
      }
    } else if(cmd === "کیر"){
      try {
        command.dick();
      } catch (e) {
        printLine(`<span class="text-red-400">Error:</span> ${escapeHtml(String(e))}`);
      }
    }else if(cmd === "گوز"){
      try {
        command.fart();
      } catch (e) {
        printLine(`<span class="text-red-400">Error:</span> ${escapeHtml(String(e))}`);
      }
    }else if(cmd === "کص"){
      try {
        command.pussy();
      } catch (e) {
        printLine(`<span class="text-red-400">Error:</span> ${escapeHtml(String(e))}`);
      }
    } else {
      printLine(`Command not found: <span class="text-red-400">${escapeHtml(cmd)}</span>. Type <span class="text-primary">help</span>.`);
    }
  }

  async function typeText(text, speedMs) {
    return new Promise((resolve) => {
      const container = document.createElement('div');
      container.className = 'whitespace-pre-wrap break-words font-mono';
      outputElement.appendChild(container);
      let i = 0;
      const interval = setInterval(() => {
        container.textContent = text.slice(0, i);
        i += 1;
        if (i > text.length) {
          clearInterval(interval);
          resolve();
        }
        outputElement.scrollTop = outputElement.scrollHeight;
      }, Math.max(10, speedMs || 20));
    });
  }

  async function typeAndRun(command) {
    printLine(
      `<span class="text-green-400">guest@Arad.wtf</span><span class="mx-2 text-secondary">:</span><span class="text-blue-400">~</span><span class="mx-2 text-secondary">$</span> <span id="typing"></span>`
    );
    const typingEl = outputElement.querySelector('#typing');
    let i = 0;
    await new Promise((resolve) => {
      const iv = setInterval(() => {
        typingEl.textContent = command.slice(0, i);
        i += 1;
        if (i > command.length) {
          clearInterval(iv);
          resolve();
        }
        outputElement.scrollTop = outputElement.scrollHeight;
      }, 30);
    });
    const [name, ...args] = command.split(/\s+/);
    const cmd = name.toLowerCase();
    if (commands[cmd]) commands[cmd](...args);
  }

  const history = [];
  let historyIndex = -1;
  let suggestions = [];
  let cwd = '~';
  let completionActive = false;
  let lastTabTime = 0;
  let lastTabPrefix = '';
  let suggestionIndex = 0;
  let completionCols = 1;

  function setInputText(text) {
    inputElement.textContent = text;
    placeCaretAtEnd(inputElement);
  }

  function getInputText() {
    return inputElement.textContent || '';
  }

  function placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function clearSuggestions() {
    suggestions = [];
    completionEl.textContent = '';
    completionActive = false;
  }

  function buildSuggestions(prefix) {
    const cmds = Object.keys(commands);
    return cmds.filter((c) => c.startsWith(prefix.toLowerCase()));
  }

  function getCharWidthPx() {
    const probe = document.createElement('span');
    probe.textContent = 'M';
    probe.style.visibility = 'hidden';
    probe.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace';
    document.body.appendChild(probe);
    const w = probe.getBoundingClientRect().width;
    probe.remove();
    return w || 8;
  }

  function renderCompletion(items) {
    if (!items || !items.length) { completionEl.textContent = ''; return; }
    const container = document.getElementById('output');
    const maxLen = items.reduce((m, s) => Math.max(m, s.length), 0);
    const padding = 2; // ch
    const charW = getCharWidthPx();
    const outputWidthPx = container.getBoundingClientRect().width - 24;
    const colWidthCh = maxLen + padding;
    const cols = Math.max(1, Math.floor(outputWidthPx / (colWidthCh * charW)));
    completionCols = cols;
    const rows = Math.ceil(items.length / cols);

    const order = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const idx = r + c * rows;
        if (idx < items.length) order.push(idx);
      }
    }

    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = `repeat(${cols}, max-content)`;
    wrapper.style.columnGap = `${padding}ch`;
    wrapper.style.rowGap = '2px';

    order.forEach((idx) => {
      const s = items[idx];
      const cell = document.createElement('div');
      cell.textContent = s;
      cell.className = 'cursor-pointer select-none';
      if (idx === suggestionIndex) cell.className += ' text-primary';
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        suggestionIndex = idx;
        setInputText(suggestions[suggestionIndex]);
        renderCompletion(suggestions);
      });
      wrapper.appendChild(cell);
    });

    completionEl.innerHTML = '';
    completionEl.appendChild(wrapper);
  }

  async function boot() {
    inputElement.setAttribute('contenteditable', 'false');

    const p = window.SITE_CONFIG.profile;
    await typeText(`Welcome to ${p.name}'s terminal`, 20);
    await typeText(`Type 'help' to see available commands`, 20);
    printLine('');

    printLine('');

    inputElement.setAttribute('contenteditable', 'true');
    inputElement.focus();
  }

  // Key handling for inline prompt
  inputElement.addEventListener('keydown', (e) => {
    // Prevent line breaks
    if (e.key === 'Enter') {
      e.preventDefault();
      if (completionActive) {
        if (suggestions.length) setInputText(suggestions[suggestionIndex] || getInputText());
        clearSuggestions();
        return;
      }
      clearSuggestions();
      const text = getInputText();
      if (text.trim()) {
        history.push(text);
        historyIndex = -1;
        handleCommand(text);
        setInputText('');
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const prefix = getInputText();
      const list = buildSuggestions(prefix);
      if (list.length === 1) {
        setInputText(list[0]);
        clearSuggestions();
      } else if (list.length > 1) {
        const now = Date.now();
        const doubleTap = now - lastTabTime < 500 && lastTabPrefix === prefix;
        lastTabTime = now;
        lastTabPrefix = prefix;

        const cp = (function commonPrefix(arr) {
          if (!arr.length) return '';
          let p = arr[0];
          for (let i = 1; i < arr.length; i += 1) {
            let j = 0; const s = arr[i];
            while (j < p.length && j < s.length && p[j] === s[j]) j += 1;
            p = p.slice(0, j);
            if (!p) break;
          }
          return p;
        })(list);
        if (cp && cp.length > prefix.length) setInputText(cp);

        suggestions = list;
        completionActive = true;
        suggestionIndex = 0;
        renderCompletion(suggestions);
        if (doubleTap) renderCompletion(list);
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      commands.clear();
      clearSuggestions();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const current = getInputText();
      if (current) {
        printLine('^C');
        setInputText('');
        clearSuggestions();
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (completionActive && suggestions.length) {
        suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length;
        setInputText(suggestions[suggestionIndex]);
        renderCompletion(suggestions);
      } else {
        if (history.length === 0) return;
        if (historyIndex === -1) historyIndex = history.length - 1; else historyIndex = Math.max(0, historyIndex - 1);
        setInputText(history[historyIndex]);
        clearSuggestions();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (completionActive && suggestions.length) {
        suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        setInputText(suggestions[suggestionIndex]);
        renderCompletion(suggestions);
      } else {
        if (history.length === 0) return;
        if (historyIndex === -1) return;
        historyIndex = Math.min(history.length - 1, historyIndex + 1);
        setInputText(history[historyIndex] || '');
        if (historyIndex === history.length - 1) historyIndex = -1;
        clearSuggestions();
      }
      return;
    }
    if (e.key === 'ArrowLeft' && completionActive && suggestions.length) {
      e.preventDefault();
      suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length;
      setInputText(suggestions[suggestionIndex]);
      renderCompletion(suggestions);
      return;
    }
    if (e.key === 'ArrowRight' && completionActive && suggestions.length) {
      e.preventDefault();
      suggestionIndex = (suggestionIndex + 1) % suggestions.length;
      setInputText(suggestions[suggestionIndex]);
      renderCompletion(suggestions);
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      return;
    }
    if (e.key === 'Escape') {
      clearSuggestions();
    }
  });

  window.addEventListener('click', () => inputElement.focus());

  boot();
})();


