(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var escapeHtml = function (unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  };

  // ==================== SETTINGS ====================
  var DEFAULT_SETTINGS = {
    accentColor: 'purple',
    particlesEnabled: true,
    gridEnabled: true,
  };
  var userSettings = {};

  function loadSettings() {
    try {
      var saved = localStorage.getItem('a0os_settings');
      userSettings = saved ? JSON.parse(saved) : {};
      for (var k in DEFAULT_SETTINGS) {
        if (userSettings[k] === undefined) userSettings[k] = DEFAULT_SETTINGS[k];
      }
    } catch (e) {
      userSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  function saveSettings() {
    try { localStorage.setItem('a0os_settings', JSON.stringify(userSettings)); } catch (e) {}
  }

  function applySettings() {
    document.documentElement.dataset.accent = userSettings.accentColor;
    var canvas = $('particle-canvas');
    if (canvas && canvas.style) {
      canvas.style.display = userSettings.particlesEnabled ? 'block' : 'none';
    }
    var grid = $('grid-overlay');
    if (grid) {
      grid.style.display = userSettings.gridEnabled ? 'block' : 'none';
    }
  }

  // ==================== PARTICLE SYSTEM ====================
  function ParticleSystem(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;
    this.particles = [];
    this.mouse = { x: -10000, y: -10000, radius: 120 };
    this.animId = null;
    this.running = true;
    this.init();
  }
  ParticleSystem.prototype.init = function () {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  };
  ParticleSystem.prototype.resize = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };
  ParticleSystem.prototype.createParticles = function () {
    var count = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 20000));
    this.particles = [];
    for (var i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.2,
      });
    }
  };
  ParticleSystem.prototype.bindEvents = function () {
    var self = this;
    window.addEventListener('resize', function () { self.resize(); self.createParticles(); });
    document.addEventListener('mousemove', function (e) { self.mouse.x = e.clientX; self.mouse.y = e.clientY; });
    document.addEventListener('mouseleave', function () { self.mouse.x = -10000; self.mouse.y = -10000; });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { self.running = false; if (self.animId) cancelAnimationFrame(self.animId); }
      else if (!self.running) { self.running = true; self.animate(); }
    });
  };
  ParticleSystem.prototype.animate = function () {
    if (!this.running) return;
    var self = this, ctx = this.ctx, particles = this.particles, mouse = this.mouse;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = this.canvas.width; if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height; if (p.y > this.canvas.height) p.y = 0;
      var dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        var force = (mouse.radius - dist) / mouse.radius;
        p.x += (dx / dist) * force * 3; p.y += (dy / dist) * force * 3;
      }
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j], dx2 = p.x - p2.x, dy2 = p.y - p2.y, dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < 150) {
          var alpha = (1 - dist2 / 150) * 0.12;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(88,166,255,' + alpha + ')'; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168,85,247,' + p.opacity + ')'; ctx.fill();
    }
    this.animId = requestAnimationFrame(function () { self.animate(); });
  };

  // ==================== APPLICATION DEFINITIONS ====================
  var APP_DEFS = {
    terminal: { name: 'Terminal', icon: '\u276E\u005F\u276F', w: 780, h: 460 },
    files: { name: 'Files', icon: '\uD83D\uDCC1', w: 640, h: 400 },
    sysinfo: { name: 'System Info', icon: '\u24D8', w: 540, h: 400 },
    physknow: { name: 'Physics Knowledge', icon: '\u269B', w: 720, h: 480 },
    settings: { name: 'Settings', icon: '\u2699', w: 500, h: 380 },
    projects: { name: 'Projects', icon: '\uD83D\uDCC2', w: 720, h: 480 },
    browser: { name: 'Browser', icon: '\uD83C\uDF10', w: 900, h: 560 }
  };
  var APP_ORDER = ['terminal', 'files', 'projects', 'physknow', 'sysinfo', 'settings'];

  // ==================== WINDOW MANAGER ====================
  var windows = [];
  var winIdCounter = 0;
  var zIndexCounter = 10;
  var WINDOW_OFFSETS = { terminal: 0, files: 30, sysinfo: 60, physknow: 50, projects: 70, settings: 90 };
  var windowLifecycles = {}; // { winId: { cleanup: function } }

  function createWindow(appId, data) {
    var def = APP_DEFS[appId];
    if (!def) return null;
    if (appId !== 'browser') {
      for (var i = 0; i < windows.length; i++) {
        if (windows[i].appId === appId && !windows[i].closed) {
          focusWindow(windows[i].id);
          if (windows[i].minimized) toggleMinimize(windows[i].id);
          return windows[i];
        }
      }
    }
    var id = ++winIdCounter;
    var offset = WINDOW_OFFSETS[appId] || 0;
    var vw = window.innerWidth, vh = window.innerHeight - 36;
    var w = Math.min(def.w, vw - 60), h = Math.min(def.h, vh - 60);
    var x = Math.max(20, Math.min(offset + 40, vw - w - 20));
    var y = Math.max(20, Math.min(offset + 30, vh - h - 20));

    var el = document.createElement('div');
    el.className = 'window focused';
    el.style.width = w + 'px'; el.style.height = h + 'px';
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.zIndex = ++zIndexCounter;
    el.dataset.winId = id;

    el.innerHTML =
      '<div class="window-titlebar">' +
        '<div class="window-controls">' +
          '<span class="win-btn close" data-action="close" title="Close"></span>' +
          '<span class="win-btn maximize" data-action="maximize" title="Maximize"></span>' +
          '<span class="win-btn minimize" data-action="minimize" title="Minimize"></span>' +
        '</div>' +
        '<span class="window-title-text">' + escapeHtml(def.name) + '</span>' +
      '</div>' +
      '<div class="window-content"></div>';

    $('windows-container').appendChild(el);

    var winObj = {
      id: id, appId: appId, title: def.name, element: el,
      x: x, y: y, w: w, h: h, prevX: x, prevY: y, prevW: w, prevH: h,
      minimized: false, maximized: false, closed: false, zIndex: zIndexCounter
    };
    windows.push(winObj);
    focusWindow(id);
    setupWindowEvents(winObj);
    createAppContent(appId, el.querySelector('.window-content'), id, data);
    updateTaskbar();
    return winObj;
  }

  function setupWindowEvents(win) {
    var el = win.element, titlebar = el.querySelector('.window-titlebar');

    // Focus on click
    el.addEventListener('mousedown', function () { focusWindow(win.id); });

    // Control buttons
    el.querySelectorAll('.win-btn').forEach(function (btn) {
      btn.addEventListener('mousedown', function (e) { e.stopPropagation(); });
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var action = btn.dataset.action;
        if (action === 'close') closeWindow(win.id);
        else if (action === 'minimize') toggleMinimize(win.id);
        else if (action === 'maximize') toggleMaximize(win.id);
      });
    });

    // Drag
    titlebar.addEventListener('mousedown', function (e) {
      if (e.target.closest('.win-btn')) return;
      if (win.maximized) return;
      focusWindow(win.id);
      var startX = e.clientX, startY = e.clientY;
      var origX = win.x, origY = win.y;
      var maxX = window.innerWidth - 100, maxY = window.innerHeight - 36 - 40;

      function onMove(e) {
        var nx = origX + (e.clientX - startX), ny = origY + (e.clientY - startY);
        nx = Math.max(0, Math.min(nx, maxX)); ny = Math.max(0, Math.min(ny, maxY));
        win.x = nx; win.y = ny;
        el.style.left = nx + 'px'; el.style.top = ny + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function getWindow(id) {
    for (var i = 0; i < windows.length; i++) { if (windows[i].id === id) return windows[i]; }
    return null;
  }

  function focusWindow(id) {
    var win = getWindow(id);
    if (!win || win.closed) return;
    win.zIndex = ++zIndexCounter;
    win.element.style.zIndex = win.zIndex;
    win.element.classList.add('focused');
    for (var i = 0; i < windows.length; i++) {
      if (windows[i].id !== id && !windows[i].closed) {
        windows[i].element.classList.remove('focused');
      }
    }
    updateTaskbar();
  }

  function closeWindow(id) {
    var win = getWindow(id);
    if (!win || win.closed) return;
    win.closed = true;
    // Call lifecycle cleanup if registered
    if (windowLifecycles[id] && windowLifecycles[id].cleanup) {
      windowLifecycles[id].cleanup();
      delete windowLifecycles[id];
    }
    if (win.element && win.element.parentNode) {
      win.element.parentNode.removeChild(win.element);
    }
    updateTaskbar();
  }

  function toggleMinimize(id) {
    var win = getWindow(id);
    if (!win || win.closed) return;
    win.minimized = !win.minimized;
    win.element.classList.toggle('minimized', win.minimized);
    if (!win.minimized) {
      focusWindow(id);
      win.element.classList.add('focused');
    }
    updateTaskbar();
  }

  function toggleMaximize(id) {
    var win = getWindow(id);
    if (!win || win.closed) return;
    if (win.maximized) {
      win.maximized = false;
      win.x = win.prevX; win.y = win.prevY; win.w = win.prevW; win.h = win.prevH;
      win.element.style.left = win.x + 'px'; win.element.style.top = win.y + 'px';
      win.element.style.width = win.w + 'px'; win.element.style.height = win.h + 'px';
      win.element.classList.remove('maximized');
    } else {
      win.prevX = win.x; win.prevY = win.y; win.prevW = win.w; win.prevH = win.h;
      win.maximized = true;
      win.element.classList.add('maximized');
      win.element.style.left = '0px'; win.element.style.top = '0px';
      win.element.style.width = ''; win.element.style.height = '';
    }
    focusWindow(id);
  }

  function toggleWindowTaskbar(id) {
    var win = getWindow(id);
    if (!win || win.closed) return;
    if (win.minimized) { toggleMinimize(id); focusWindow(id); }
    else if (win.zIndex === zIndexCounter) { toggleMinimize(id); }
    else { focusWindow(id); }
  }

  // ==================== TASKBAR ====================
  function updateTaskbar() {
    var center = $('taskbar-center');
    center.innerHTML = '';
    for (var i = 0; i < windows.length; i++) {
      var win = windows[i];
      if (win.closed) continue;
      var btn = document.createElement('button');
      btn.className = 'taskbar-item';
      if (win.zIndex === zIndexCounter) btn.classList.add('active');
      if (win.minimized) btn.classList.add('minimized');
      btn.textContent = win.title;
      btn.dataset.winId = win.id;
      btn.addEventListener('click', function () {
        toggleWindowTaskbar(parseInt(this.dataset.winId));
      });
      center.appendChild(btn);
    }
  }

  var launcherOpen = false;

  function toggleLauncher() {
    launcherOpen = !launcherOpen;
    var menu = $('launcher-menu');
    if (launcherOpen) {
      menu.innerHTML = '';
      for (var i = 0; i < APP_ORDER.length; i++) {
        var appId = APP_ORDER[i], def = APP_DEFS[appId];
        var item = document.createElement('button');
        item.className = 'launcher-item';
        item.innerHTML = '<span class="launcher-icon">' + def.icon + '</span> ' + escapeHtml(def.name);
        (function (id) {
          item.addEventListener('click', function () {
            launcherOpen = false;
            $('launcher-menu').classList.add('hidden');
            createWindow(id);
          });
        })(appId);
        menu.appendChild(item);
      }
      menu.classList.remove('hidden');
    } else {
      menu.classList.add('hidden');
    }
  }

  // ==================== DESKTOP ICONS ====================
  function createDesktopIcons() {
    var container = $('desktop-icons');
    container.innerHTML = '';
    for (var i = 0; i < APP_ORDER.length; i++) {
      var appId = APP_ORDER[i], def = APP_DEFS[appId];
      var icon = document.createElement('button');
      icon.className = 'desktop-icon';
      icon.innerHTML = '<div class="desktop-icon-icon">' + def.icon + '</div><div class="desktop-icon-label">' + escapeHtml(def.name) + '</div>';
      (function (id) {
        icon.addEventListener('dblclick', function () { createWindow(id); });
        icon.addEventListener('click', function () {
          // Single click selects (visual feedback only)
        });
      })(appId);
      container.appendChild(icon);
    }
  }

  // ==================== APP CONTENT CREATION ====================
  function createAppContent(appId, contentEl, winId, data) {
    switch (appId) {
      case 'terminal': createTerminal(contentEl, winId); break;
      case 'files': createFileManager(contentEl, winId); break;
      case 'sysinfo': createSystemInfo(contentEl); break;
      case 'physknow': createPhysicsKnowledge(contentEl, winId); break;
      case 'projects': createProjects(contentEl, winId); break;
      case 'browser': createBrowser(contentEl, winId, data); break;
      case 'settings': createSettings(contentEl); break;
    }
  }

  // ==================== TERMINAL APP ====================
  function createTerminal(container, winId) {
    container.innerHTML =
      '<div class="term-wrapper">' +
        '<div class="term-output" id="tOut_' + winId + '" aria-live="polite"></div>' +
        '<div class="term-completion" id="tComp_' + winId + '"></div>' +
        '<div class="term-prompt" id="tPrompt_' + winId + '">' +
          '<span class="prompt-user" style="color:var(--green)">guest@Arad</span>' +
          '<span class="prompt-separator" style="color:var(--text-secondary);margin:0 2px">:</span>' +
          '<span class="prompt-path" style="color:var(--blue)">~</span>' +
          '<span class="prompt-symbol" style="color:var(--text-secondary);margin:0 6px 0 2px">$</span>' +
          '<span class="term-input" id="tInp_' + winId + '" contenteditable="true" spellcheck="false" role="textbox" aria-label="Terminal input"></span>' +
        '</div>' +
      '</div>';

    var outputEl = $('tOut_' + winId);
    var inputEl = $('tInp_' + winId);
    var completionEl = $('tComp_' + winId);

    function printLine(html) {
      var line = document.createElement('div');
      line.innerHTML = html;
      outputEl.appendChild(line);
      outputEl.scrollTop = outputEl.scrollHeight;
    }

    function printPrompt(text) {
      var safe = escapeHtml(text);
      printLine('<span style="color:var(--green)">guest@Arad</span><span style="color:var(--text-secondary);margin:0 8px">:</span><span style="color:var(--blue)">' + escapeHtml(cwd) + '</span><span style="color:var(--text-secondary);margin:0 8px">$</span> ' + safe);
    }

    var bullet = function (t) { return '\u2022 ' + escapeHtml(t); };
    var link = function (label, href) {
      return '<a style="color:var(--blue);text-decoration:none" href="' + href + '" target="_blank" rel="noreferrer">' + escapeHtml(label) + '</a>';
    };

    var commands = {
      help: function () {
        printLine('<span style="color:var(--text-primary)">Available commands:</span>');
        var list = ['help          - Show this help','about         - Show personal summary','projects/repos/github - Open Projects folder','skills        - Show skills','contact       - Show contact links','clear         - Clear the terminal','desktop       - Desktop environment commands'];
        list.forEach(function (l) { printLine(escapeHtml(l)); });
      },
      help2: function () {
        printLine('<span style="color:var(--text-primary)">Available commands:</span>');
        printLine('<span style="color:var(--text-primary)">Donbal Chi Migardi namosan ?</span>');
      },
      about: function () {
        var p = window.SITE_CONFIG.profile;
        printLine('<span style="color:var(--text-primary);font-weight:600">' + escapeHtml(p.name) + '</span> \u2014 ' + escapeHtml(p.title));
        if (p.location) printLine(escapeHtml('Location: ' + p.location));
        if (p.email) printLine('Email: ' + link(p.email, 'mailto:' + p.email));
        if (p.website) printLine('Website: ' + link(p.website, p.website));
        if (p.summary) { printLine(''); printLine(escapeHtml(p.summary)); }
      },
      projects: function () {
        createWindow('projects');
      },
      repos: function () {
        createWindow('projects');
      },
      github: function () {
        createWindow('projects');
      },
      skills: function () {
        var s = window.SITE_CONFIG.skills || {};
        var cats = Object.keys(s);
        if (!cats.length) { printLine('No skills configured.'); return; }
        cats.forEach(function (cat) {
          printLine('<span style="color:var(--accent)">' + escapeHtml(cat) + ':</span> ' + escapeHtml((s[cat] || []).join(', ')));
        });
      },
      contact: function () {
        var c = window.SITE_CONFIG.contact || {};
        var entries = [
          c.email && 'Email: ' + link(c.email, 'mailto:' + c.email),
          c.github && 'GitHub: ' + link(c.github, c.github),
          c.discord && 'Discord: ' + escapeHtml(c.discord),
          c.telegram && 'Telegram: ' + link(c.telegram, 'https://t.me/' + c.telegram.replace('@','')),
        ].filter(Boolean);
        if (!entries.length) { printLine('No contact methods configured.'); return; }
        entries.forEach(function (e) { printLine(e); });
      },
      clear: function () { outputEl.innerHTML = ''; },
      desktop: function () {
        printLine('<span style="color:var(--text-primary)">Desktop commands:</span>');
        printLine('  launch &lt;app&gt; - Open an application');
        printLine('  close &lt;app&gt;  - Close an application');
        printLine('  apps            - List available applications');
        printLine('  theme &lt;color&gt;  - Change accent (green/blue/purple/amber)');
        printLine('  projects/repos/github - Open Projects folder');
      },
      launch: function (app) {
        if (app && APP_DEFS[app]) { createWindow(app); }
        else { printLine('Unknown application. Type <span style="color:var(--blue)">apps</span> to list.'); }
      },
      close: function (app) {
        if (!app) { printLine('Usage: close &lt;app&gt;'); return; }
        for (var i = 0; i < windows.length; i++) {
          if (windows[i].appId === app && !windows[i].closed) { closeWindow(windows[i].id); return; }
        }
        printLine('No open window for: ' + escapeHtml(app));
      },
      apps: function () {
        printLine('<span style="color:var(--text-primary)">Available applications:</span>');
        for (var i = 0; i < APP_ORDER.length; i++) {
          var d = APP_DEFS[APP_ORDER[i]];
          printLine('  ' + d.icon + ' ' + d.name + ' <span style="color:var(--text-secondary)">(' + APP_ORDER[i] + ')</span>');
        }
      },
      theme: function (color) {
        var valid = { green: 1, blue: 1, purple: 1, amber: 1 };
        if (color && valid[color]) {
          userSettings.accentColor = color;
          saveSettings();
          applySettings();
          printLine('Theme changed to <span style="color:var(--accent)">' + escapeHtml(color) + '</span>');
        } else {
          printLine('Usage: theme &lt;green|blue|purple|amber&gt;');
        }
      }
    };

    var history = [], historyIndex = -1, suggestions = [], cwd = '~';
    var completionActive = false, lastTabTime = 0, lastTabPrefix = '', suggestionIndex = 0, completionCols = 1;

    function setInputText(text) { inputEl.textContent = text; placeCaretAtEnd(inputEl); }
    function getInputText() { return inputEl.textContent || ''; }

    function placeCaretAtEnd(el) {
      el.focus();
      var r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
    }

    function clearSuggestions() { suggestions = []; completionEl.innerHTML = ''; completionActive = false; }

    function buildSuggestions(prefix) {
      var cmds = Object.keys(commands);
      return cmds.filter(function (c) { return c.indexOf(prefix.toLowerCase()) === 0; });
    }

    function getCharWidthPx() {
      var probe = document.createElement('span');
      probe.textContent = 'M'; probe.style.visibility = 'hidden';
      probe.style.fontFamily = 'ui-monospace,SFMono-Regular,Menlo,Monaco,Courier New,monospace';
      document.body.appendChild(probe);
      var w = probe.getBoundingClientRect().width;
      probe.remove(); return w || 8;
    }

    function renderCompletion(items) {
      if (!items || !items.length) { completionEl.innerHTML = ''; return; }
      var maxLen = 0;
      for (var si = 0; si < items.length; si++) { if (items[si].length > maxLen) maxLen = items[si].length; }
      var padding = 2, charW = getCharWidthPx();
      var outputWidthPx = outputEl.getBoundingClientRect().width - 24;
      var cols = Math.max(1, Math.floor(outputWidthPx / ((maxLen + padding) * charW)));
      completionCols = cols;
      var rows = Math.ceil(items.length / cols), order = [];
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) { var idx = r + c * rows; if (idx < items.length) order.push(idx); }
      }
      var wrapper = document.createElement('div');
      wrapper.style.display = 'grid'; wrapper.style.gridTemplateColumns = 'repeat(' + cols + ',max-content)';
      wrapper.style.columnGap = padding + 'ch'; wrapper.style.rowGap = '2px';
      order.forEach(function (idx) {
        var s = items[idx], cell = document.createElement('div');
        cell.textContent = s; cell.style.cursor = 'pointer'; cell.style.userSelect = 'none';
        cell.style.padding = '2px 8px'; cell.style.borderRadius = '3px';
        if (idx === suggestionIndex) cell.style.color = 'var(--text-primary)';
        cell.addEventListener('mousedown', function (e) {
          e.preventDefault(); suggestionIndex = idx;
          setInputText(suggestions[suggestionIndex]); renderCompletion(suggestions);
        });
        wrapper.appendChild(cell);
      });
      completionEl.innerHTML = ''; completionEl.appendChild(wrapper);
    }

    function handleCommand(raw) {
      var command = raw.trim();
      if (!command) return;
      printPrompt(command);
      var parts = command.split(/\s+/);
      var name = parts[0].toLowerCase();
      var args = parts.slice(1);
      if (commands[name]) {
        try { commands[name].apply(null, args); } catch (e) { printLine('<span style="color:var(--red)">Error:</span> ' + escapeHtml(String(e))); }
      } else {
        printLine('Command not found: <span style="color:var(--red)">' + escapeHtml(name) + '</span>. Type <span style="color:var(--text-primary)">help</span>.');
      }
    }

    function typeText(text, speedMs) {
      return new Promise(function (resolve) {
        var c = document.createElement('div');
        outputEl.appendChild(c);
        var i = 0, iv = setInterval(function () {
          c.textContent = text.slice(0, i); i++;
          if (i > text.length) { clearInterval(iv); resolve(); }
          outputEl.scrollTop = outputEl.scrollHeight;
        }, Math.max(10, speedMs || 20));
      });
    }

    // Keyboard
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (completionActive) { if (suggestions.length) setInputText(suggestions[suggestionIndex] || getInputText()); clearSuggestions(); return; }
        clearSuggestions();
        var text = getInputText();
        if (text.trim()) { history.push(text); historyIndex = -1; handleCommand(text); setInputText(''); }
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        var prefix = getInputText(), list = buildSuggestions(prefix);
        if (list.length === 1) { setInputText(list[0]); clearSuggestions(); }
        else if (list.length > 1) {
          var now = Date.now(), doubleTap = (now - lastTabTime < 500 && lastTabPrefix === prefix);
          lastTabTime = now; lastTabPrefix = prefix;
          var cp = (function (arr) {
            if (!arr.length) return '';
            var p = arr[0];
            for (var i = 1; i < arr.length; i++) {
              var j = 0, s = arr[i];
              while (j < p.length && j < s.length && p[j] === s[j]) j++;
              p = p.slice(0, j); if (!p) break;
            }
            return p;
          })(list);
          if (cp && cp.length > prefix.length) setInputText(cp);
          suggestions = list; completionActive = true; suggestionIndex = 0;
          renderCompletion(suggestions);
          if (doubleTap) renderCompletion(list);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); outputEl.innerHTML = ''; clearSuggestions(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        var cur = getInputText();
        if (cur) { printLine('^C'); setInputText(''); clearSuggestions(); }
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (completionActive && suggestions.length) {
          suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length;
          setInputText(suggestions[suggestionIndex]); renderCompletion(suggestions);
        } else {
          if (!history.length) return;
          if (historyIndex === -1) historyIndex = history.length - 1; else historyIndex = Math.max(0, historyIndex - 1);
          setInputText(history[historyIndex]); clearSuggestions();
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (completionActive && suggestions.length) {
          suggestionIndex = (suggestionIndex + 1) % suggestions.length;
          setInputText(suggestions[suggestionIndex]); renderCompletion(suggestions);
        } else {
          if (!history.length || historyIndex === -1) return;
          historyIndex = Math.min(history.length - 1, historyIndex + 1);
          setInputText(history[historyIndex] || '');
          if (historyIndex === history.length - 1) historyIndex = -1;
          clearSuggestions();
        }
        return;
      }
      if (e.key === 'ArrowLeft' && completionActive && suggestions.length) { e.preventDefault(); suggestionIndex = (suggestionIndex - 1 + suggestions.length) % suggestions.length; setInputText(suggestions[suggestionIndex]); renderCompletion(suggestions); return; }
      if (e.key === 'ArrowRight' && completionActive && suggestions.length) { e.preventDefault(); suggestionIndex = (suggestionIndex + 1) % suggestions.length; setInputText(suggestions[suggestionIndex]); renderCompletion(suggestions); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') return;
      if (e.key === 'Escape') clearSuggestions();
    });

    // Focus input on click inside terminal
    container.addEventListener('click', function (e) {
      if (e.target.closest('.term-input')) return;
      inputEl.focus();
    });

    // Boot
    inputEl.setAttribute('contenteditable', 'false');
    setTimeout(function () {
      typeText('A0/OS Terminal v2.0', 15).then(function () {
        return typeText("Type 'help' for available commands", 15);
      }).then(function () {
        printLine(''); printLine('');
        inputEl.setAttribute('contenteditable', 'true');
        inputEl.focus();
      });
    }, 300);
  }

  // ==================== FILE MANAGER ====================
  var VIRTUAL_FS = {
    'home': { type: 'dir', children: {
      'user': { type: 'dir', children: {
        'about.txt': { type: 'file', size: '1.2K' },
        'skills.json': { type: 'file', size: '0.8K' },
        'contact.md': { type: 'file', size: '0.3K' },
        'projects': { type: 'dir', children: {
          'website-v2.0': { type: 'dir', children: {
            'index.html': { type: 'file', size: '2.1K' },
            'styles.css': { type: 'file', size: '8.7K' },
            'app.js': { type: 'file', size: '19K' },
          }},
        }},
      }},
    }},
    'etc': { type: 'dir', children: {
      'hostname': { type: 'file', size: '0.1K' },
      'version': { type: 'file', size: '0.1K' },
    }},
    'var': { type: 'dir', children: {
      'log': { type: 'dir', children: {
        'system.log': { type: 'file', size: '4.5K' },
      }},
    }},
  };

  var FILE_CONTENTS = {
    'about.txt': 'Name: A0Zero\nTitle: Jr Backend Developer\nLocation: Hell/Limbo\nEmail: contact@A0Zero.ir\nWebsite: https://A0Zero.ir/\nSummary: A gamer who codes (a beginner, really)',
    'skills.json': '{\n  "Languages": ["JavaScript", "TypeScript", "Go"],\n  "Frontend": ["HTML", "CSS", "Tailwind CSS"],\n  "Backend": ["Node.js", "Express.js", "Gin"],\n  "Databases": ["PostgreSQL", "MongoDB", "SQL"],\n  "Tools": ["Git", "npm", "docker"]\n}',
    'contact.md': '# Contact\n\n- Email: contact@A0Zero.ir\n- GitHub: https://github.com/1tzArad\n- Telegram: @sysrqtrigger',
    'index.html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>A0/OS</title>\n</head>\n<body>\n  <!-- Desktop Environment -->\n</body>\n</html>',
    'styles.css': '/* A0/OS Desktop Styles */\n:root {\n  --accent: #a855f7;\n  --bg-primary: #0a0a0a;\n}',
    'app.js': '// A0/OS Desktop Environment\n(function() {\n  "use strict";\n  // Complete desktop implementation\n})();',
    'hostname': 'a0os-desktop',
    'version': 'A0/OS v1.0\nKernel: JavaScript ES6\nBuild: 2024',
    'system.log': '[BOOT] A0/OS v1.0 starting...\n[BOOT] Kernel loaded\n[BOOT] Desktop environment initialized\n[BOOT] System ready\n[USER] Login: guest\n[DESKTOP] Session started',
  };

  function createFileManager(container) {
    container.innerHTML =
      '<div class="fm-wrapper">' +
        '<div class="fm-sidebar" id="fmSidebar"></div>' +
        '<div class="fm-main">' +
          '<div class="fm-list" id="fmList"></div>' +
          '<div class="fm-viewer" id="fmViewer" style="display:none"></div>' +
        '</div>' +
      '</div>';

    var sidebar = $('fmSidebar'), list = $('fmList'), viewer = $('fmViewer');
    var currentPath = '/home/user';

    function buildSidebar(path, node, depth) {
      var keys = Object.keys(node);
      for (var i = 0; i < keys.length; i++) {
        var name = keys[i], item = node[name];
        if (item.type !== 'dir') continue;
        var fullPath = path + '/' + name;
        var el = document.createElement('div');
        el.className = 'fm-sidebar-item depth-' + depth;
        el.textContent = '\uD83D\uDCC1 ' + name;
        el.dataset.path = fullPath;
        el.addEventListener('click', function () { navigateTo(this.dataset.path); });
        sidebar.appendChild(el);
        buildSidebar(fullPath, item.children, depth + 1);
      }
    }

    function navigateTo(path) {
      currentPath = path;
      viewer.style.display = 'none';
      list.style.display = 'block';
      sidebar.querySelectorAll('.fm-sidebar-item').forEach(function (el) { el.classList.remove('active'); });
      var match = sidebar.querySelector('[data-path="' + path + '"]');
      if (match) match.classList.add('active');

      list.innerHTML = '';
      var parts = path.split('/').filter(Boolean);
      var node = VIRTUAL_FS;
      for (var i = 0; i < parts.length; i++) { node = node[parts[i]] && node[parts[i]].children; if (!node) { list.innerHTML = '<div style="padding:12px;color:var(--text-secondary)">Path not found</div>'; return; } }

      var names = Object.keys(node);
      if (!names.length) { list.innerHTML = '<div style="padding:12px;color:var(--text-secondary)">Empty directory</div>'; return; }
      names.sort();
      for (var j = 0; j < names.length; j++) {
        var name = names[j], item = node[name];
        var row = document.createElement('div');
        row.className = 'fm-file';
        var icon = item.type === 'dir' ? '\uD83D\uDCC1' : '\uD83D\uDCC4';
        var size = item.size || '';
        row.innerHTML = '<span class="fm-icon">' + icon + '</span><span class="fm-name">' + escapeHtml(name) + '</span><span class="fm-size">' + size + '</span>';
        if (item.type === 'dir') {
          row.addEventListener('dblclick', function (dirName) { return function () { navigateTo(currentPath + '/' + dirName); }; }(name));
        } else {
          (function (fName) {
            row.addEventListener('dblclick', function () { openFile(currentPath + '/' + fName, fName); });
          })(name);
        }
        list.appendChild(row);
      }
    }

    function openFile(path, name) {
      var content = FILE_CONTENTS[name];
      if (!content) { content = 'Error: File content not available.'; }
      list.style.display = 'none';
      viewer.style.display = 'block';
      viewer.innerHTML = '<div class="fm-viewer-header">' + escapeHtml(path) + ' &mdash; ' + escapeHtml(name) + '</div>' + '<pre style="margin:0;font-family:inherit;font-size:12px">' + escapeHtml(content) + '</pre>';
      viewer.scrollTop = 0;
    }

    buildSidebar('', VIRTUAL_FS, 0);
    navigateTo('/home/user');
  }

  // ==================== SYSTEM INFO ====================
  function createSystemInfo(container) {
    var startTime = Date.now();
    function uptime() {
      var s = Math.floor((Date.now() - startTime) / 1000);
      var m = Math.floor(s / 60), h = Math.floor(m / 60);
      return h + 'h ' + (m % 60) + 'm ' + (s % 60) + 's';
    }

    var ascii =
      '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\n' +
      '\u2551 A0/OS \u2551\n' +
      '\u2551 v1.0  \u2551\n' +
      '\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D\n';

    container.innerHTML =
      '<div class="sysinfo-wrapper">' +
        '<div class="sysinfo-ascii">' + ascii + '</div>' +
        '<div class="sysinfo-details" id="sysinfoDetails">' +
          '<div class="sysinfo-row"><span class="sysinfo-label">OS:</span><span class="sysinfo-value">A0/OS v1.0</span></div>' +
          '<div class="sysinfo-row"><span class="sysinfo-label">Host:</span><span class="sysinfo-value">GitHub Pages</span></div>' +
          '<div class="sysinfo-row"><span class="sysinfo-label">Kernel:</span><span class="sysinfo-value">JavaScript ES6</span></div>' +
          '<div class="sysinfo-row"><span class="sysinfo-label">Uptime:</span><span class="sysinfo-value" id="uptimeVal">' + uptime() + '</span></div>' +
          '<div class="sysinfo-row"><span class="sysinfo-label">Shell:</span><span class="sysinfo-value">/bin/terminal</span></div>' +
          '<div class="sysinfo-row"><span class="sysinfo-label">Resolution:</span><span class="sysinfo-value">' + window.innerWidth + 'x' + (window.innerHeight - 36) + '</span></div>' +
          '<div class="sysinfo-row"><span class="sysinfo-label">Theme:</span><span class="sysinfo-value" id="themeVal">' + userSettings.accentColor + '</span></div>' +
          '<div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);font-size:12px;color:var(--text-secondary)">' +
            escapeHtml(window.SITE_CONFIG.profile.name) + ' \u2014 ' + escapeHtml(window.SITE_CONFIG.profile.title) +
          '</div>' +
        '</div>' +
      '</div>';

    setInterval(function () {
      var el = $('uptimeVal');
      if (el) el.textContent = uptime();
    }, 1000);
  }

  // ==================== PHYSICS KNOWLEDGE ====================
  var PHYSICS_DATA = [
    
  ];

  function createPhysicsKnowledge(container, winId) {
    var levelColors = { Advanced: 'var(--green)', Intermediate: 'var(--blue)', Basic: 'var(--amber)' };

    container.innerHTML =
      '<div class="pkw-wrapper">' +
        '<div class="pkw-sidebar" id="pkwSidebar_' + winId + '"></div>' +
        '<div class="pkw-main">' +
          '<div class="pkw-header" id="pkwHeader_' + winId + '">\u269B Physics Knowledge Base</div>' +
          '<div class="pkw-grid" id="pkwGrid_' + winId + '">' +
            '<div class="pkw-placeholder">Select a category to explore physics topics</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var sidebar = $('pkwSidebar_' + winId);
    var grid = $('pkwGrid_' + winId);

    function buildSidebar() {
      for (var i = 0; i < PHYSICS_DATA.length; i++) {
        var cat = PHYSICS_DATA[i];
        var el = document.createElement('button');
        el.className = 'pkw-cat' + (i === 0 ? ' active' : '');
        el.innerHTML = '<span class="pkw-cat-icon">' + cat.icon + '</span><span class="pkw-cat-name">' + cat.name + '</span>';
        el.dataset.catIndex = i;
        el.addEventListener('click', function () { selectCategory(parseInt(this.dataset.catIndex)); });
        sidebar.appendChild(el);
      }
    }

    function selectCategory(index) {
      var cat = PHYSICS_DATA[index];
      if (!cat) return;
      sidebar.querySelectorAll('.pkw-cat').forEach(function (e) { e.classList.remove('active'); });
      sidebar.children[index].classList.add('active');

      var header = $('pkwHeader_' + winId);
      if (header) header.textContent = cat.icon + '  ' + cat.name;

      grid.innerHTML = '';
      grid.style.display = 'grid';

      for (var i = 0; i < cat.topics.length; i++) {
        (function (topic, idx) {
          var card = document.createElement('div');
          card.className = 'pkw-card';
          card.style.animationDelay = (idx * 0.08) + 's';

          var formulasHtml = '';
          for (var f = 0; f < topic.formulas.length; f++) {
            formulasHtml += '<span class="pkw-formula">' + topic.formulas[f] + '</span>';
          }

          card.innerHTML =
            '<div class="pkw-card-title">' + escapeHtml(topic.name) + '</div>' +
            '<div class="pkw-card-desc">' + escapeHtml(topic.desc) + '</div>' +
            '<div class="pkw-card-footer">' +
              '<span class="pkw-card-level" style="color:' + (levelColors[topic.level] || 'var(--text-secondary)') + '">' + topic.level + '</span>' +
              '<span class="pkw-card-count">' + topic.formulas.length + ' formula(s)</span>' +
            '</div>' +
            '<div class="pkw-card-formulas">' + formulasHtml + '</div>';

          card.addEventListener('click', function () {
            var wasOpen = card.classList.contains('expanded');
            grid.querySelectorAll('.pkw-card.expanded').forEach(function (c) { c.classList.remove('expanded'); });
            if (!wasOpen) card.classList.add('expanded');
          });

          grid.appendChild(card);
        })(cat.topics[i], i);
      }
    }

    buildSidebar();
    selectCategory(0);
  }

  // ==================== PROJECTS ====================
  var LANG_COLORS = {
    'JavaScript': '#f7df1e', 'TypeScript': '#3178c6', 'HTML': '#e34c26', 'CSS': '#563d7c',
    'Go': '#00add8', 'Python': '#3572A5', 'Shell': '#89e051', 'Dockerfile': '#384d54',
    'Java': '#b07219', 'C': '#555555', 'C++': '#f34b7d', 'Ruby': '#701516',
    'PHP': '#4F5D95', 'Swift': '#ffac45', 'Kotlin': '#F18E33', 'Rust': '#dea584',
    'SCSS': '#c6538c', 'Less': '#1d365d', 'Makefile': '#427819', 'Perl': '#0298c3'
  };

  function createProjects(container, winId) {
    container.innerHTML =
      '<div class="prj-wrapper">' +
        '<div class="prj-toolbar">' +
          '<div class="prj-toolbar-left">' +
            '<span class="prj-toolbar-title">\uD83D\uDCC2  Projects</span>' +
            '<span class="prj-count" id="prjCount_' + winId + '">0 repos</span>' +
          '</div>' +
          '<div class="prj-toolbar-right">' +
            '<select class="prj-sort" id="prjSort_' + winId + '">' +
              '<option value="updated">Sort: Updated</option>' +
              '<option value="stars">Sort: Stars</option>' +
              '<option value="name">Sort: Name</option>' +
              '<option value="language">Sort: Language</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="prj-status" id="prjStatus_' + winId + '">' +
          '<span class="prj-spinner"></span> Fetching repositories...' +
        '</div>' +
        '<div class="prj-list" id="prjList_' + winId + '"></div>' +
      '</div>';

    var listEl = $('prjList_' + winId);
    var statusEl = $('prjStatus_' + winId);
    var countEl = $('prjCount_' + winId);
    var sortEl = $('prjSort_' + winId);

    var allRepos = [];
    var username = '';

    function getUsername() {
      var config = window.SITE_CONFIG;
      return config.github && config.github.username;
    }

    function langDot(lang) {
      if (!lang) return '';
      var color = LANG_COLORS[lang] || '#8b949e';
      return '<span class="prj-lang-dot" style="background:' + color + '"></span>';
    }

    function timeAgo(dateStr) {
      var now = new Date();
      var d = new Date(dateStr);
      var diff = Math.floor((now - d) / 1000);
      if (diff < 60) return 'just now';
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
      if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
      return d.toLocaleDateString();
    }

    function renderRepos(repos) {
      listEl.innerHTML = '';
      if (!repos.length) {
        listEl.innerHTML = '<div class="prj-empty">No repositories found</div>';
        countEl.textContent = '0 repos';
        return;
      }
      countEl.textContent = repos.length + ' ' + (repos.length === 1 ? 'repo' : 'repos');

      for (var i = 0; i < repos.length; i++) {
        (function (repo, idx) {
          var row = document.createElement('div');
          row.className = 'prj-row';
          row.style.animationDelay = (idx * 0.03) + 's';

          var desc = repo.description ? escapeHtml(repo.description) : '<span style="color:var(--text-secondary);font-style:italic">No description</span>';
          var langHtml = repo.language ? langDot(repo.language) + '<span class="prj-lang">' + escapeHtml(repo.language) + '</span>' : '';
          var starsHtml = repo.stargazers_count > 0 ? '<span class="prj-stars">\u2605 ' + repo.stargazers_count + '</span>' : '';
          var forkHtml = repo.fork ? '<span class="prj-fork">FORK</span>' : '';
          var updatedHtml = '<span class="prj-updated">' + timeAgo(repo.updated_at) + '</span>';
          var privacyIcon = repo.private ? '\uD83D\uDD12' : '\uD83D\uDCC2';

          row.innerHTML =
            '<div class="prj-row-icon">' + privacyIcon + '</div>' +
            '<div class="prj-row-body">' +
              '<div class="prj-row-name">' +
                '<a href="' + repo.html_url + '" target="_blank" rel="noreferrer">' + escapeHtml(repo.name) + '</a>' +
                forkHtml +
              '</div>' +
              '<div class="prj-row-desc">' + desc + '</div>' +
              '<div class="prj-row-meta">' +
                starsHtml +
                langHtml +
                updatedHtml +
              '</div>' +
            '</div>';

          row.addEventListener('click', function (e) {
            if (!e.target.closest('a')) {
              var targetUrl = repo.homepage || repo.html_url;
              createWindow('browser', { url: targetUrl, repoInfo: repo });
            }
          });

          listEl.appendChild(row);
        })(repos[i], i);
      }
    }

    function filterAndSort() {
      var mode = sortEl.value;
      var sorted = allRepos.slice();
      if (mode === 'updated') {
        sorted.sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
      } else if (mode === 'stars') {
        sorted.sort(function (a, b) { return (b.stargazers_count || 0) - (a.stargazers_count || 0); });
      } else if (mode === 'name') {
        sorted.sort(function (a, b) { return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1; });
      } else if (mode === 'language') {
        sorted.sort(function (a, b) {
          var la = (a.language || 'Z').toLowerCase(), lb = (b.language || 'Z').toLowerCase();
          return la < lb ? -1 : la > lb ? 1 : 0;
        });
      }
      renderRepos(sorted);
    }

    function fetchRepos() {
      username = getUsername();
      if (!username) {
        statusEl.innerHTML = '<span style="color:var(--red)">\u2716 Error:</span> GitHub username not configured. Set <code>github.username</code> in config.js';
        statusEl.className = 'prj-status prj-status-error';
        return;
      }

      statusEl.innerHTML = '<span class="prj-spinner"></span> Fetching repositories for <strong>' + escapeHtml(username) + '</strong>...';
      statusEl.className = 'prj-status';
      statusEl.style.display = 'flex';

      fetch('https://api.github.com/users/' + username + '/repos?sort=updated&per_page=100&type=all')
        .then(function (r) {
          if (!r.ok) throw new Error('GitHub API returned HTTP ' + r.status);
          return r.json();
        })
        .then(function (repos) {
          allRepos = repos;
          statusEl.style.display = 'none';
          filterAndSort();
        })
        .catch(function (err) {
          statusEl.innerHTML = '<span style="color:var(--red)">\u2716 Error:</span> ' + escapeHtml(err.message);
          statusEl.className = 'prj-status prj-status-error';
          statusEl.style.display = 'flex';
        });
    }

    sortEl.addEventListener('change', filterAndSort);
    fetchRepos();
  }

  // ==================== BROWSER ====================
  var IFRAME_BLOCKED_HOSTS = { 'github.com': 1, 'www.github.com': 1 };

  function createBrowser(container, winId, data) {
    var url = (data && data.url) || 'about:blank';
    var repo = (data && data.repoInfo) || null;

    container.innerHTML =
      '<div class="brw-wrapper">' +
        '<div class="brw-nav">' +
          '<button class="brw-btn" id="brwBack_' + winId + '" title="Back">\u25C0</button>' +
          '<button class="brw-btn" id="brwFwd_' + winId + '" title="Forward">\u25B6</button>' +
          '<button class="brw-btn" id="brwRef_' + winId + '" title="Refresh">\u21BB</button>' +
          '<div class="brw-url-bar">' +
            '<input class="brw-url-input" id="brwUrl_' + winId + '" value="' + escapeHtml(url) + '" readonly>' +
            '<span class="brw-loading" id="brwLoad_' + winId + '"></span>' +
          '</div>' +
          '<button class="brw-btn brw-ext" id="brwExt_' + winId + '" title="Open in external browser">\u2197</button>' +
        '</div>' +
        '<div class="brw-body" id="brwBody_' + winId + '">' +
          '<div class="brw-iframe-wrap" id="brwIframe_' + winId + '">' +
            '<iframe class="brw-iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style="display:none"></iframe>' +
          '</div>' +
        '</div>' +
      '</div>';

    var nav = container.querySelector('.brw-nav');
    var body = $('brwBody_' + winId);
    var iframeWrap = $('brwIframe_' + winId);
    var iframe = iframeWrap.querySelector('iframe');
    var urlInput = $('brwUrl_' + winId);
    var loadEl = $('brwLoad_' + winId);
    var extBtn = $('brwExt_' + winId);

    var history = [url];
    var historyIdx = 0;

    function setLoading(on) {
      loadEl.style.display = on ? 'inline-block' : 'none';
    }

    function showFallback() {
      iframe.style.display = 'none';
      setLoading(false);

      var fb = document.createElement('div');
      fb.className = 'brw-fallback';

      if (repo) {
        var langColor = LANG_COLORS[repo.language] || '#8b949e';
        fb.innerHTML =
          '<div class="brw-fb-icon">\uD83D\uDCC2</div>' +
          '<div class="brw-fb-title">' + escapeHtml(repo.name) + '</div>' +
          '<div class="brw-fb-desc">' + (repo.description ? escapeHtml(repo.description) : '<span style="color:var(--text-secondary);font-style:italic">No description</span>') + '</div>' +
          '<div class="brw-fb-meta">' +
            (repo.owner && repo.owner.login ? '<span class="brw-fb-meta-item"><span class="brw-fb-label">Owner</span>' + escapeHtml(repo.owner.login) + '</span>' : '') +
            (repo.language ? '<span class="brw-fb-meta-item"><span class="brw-fb-label">Language</span><span class="brw-lang-dot" style="background:' + langColor + '"></span>' + escapeHtml(repo.language) + '</span>' : '') +
            '<span class="brw-fb-meta-item"><span class="brw-fb-label">Stars</span>\u2605 ' + (repo.stargazers_count || 0) + '</span>' +
            '<span class="brw-fb-meta-item"><span class="brw-fb-label">Forks</span>\u2442 ' + (repo.forks_count || 0) + '</span>' +
            '<span class="brw-fb-meta-item"><span class="brw-fb-label">Updated</span>' + new Date(repo.updated_at).toLocaleDateString() + '</span>' +
          '</div>' +
          '<div class="brw-fb-note">\u26A0\uFE0F This site does not allow embedding in an iframe. Open it in your browser to view the full page.</div>' +
          '<button class="brw-fb-btn">\u2197 Open in Browser</button>';
      } else {
        fb.innerHTML =
          '<div class="brw-fb-icon">\uD83C\uDF10</div>' +
          '<div class="brw-fb-title">Cannot Embed Page</div>' +
          '<div class="brw-fb-desc">This website does not allow embedding in an iframe.</div>' +
          '<div class="brw-fb-note">\u26A0\uFE0F The site\'s security policy prevents it from being displayed here.</div>' +
          '<button class="brw-fb-btn">\u2197 Open in Browser</button>';
      }

      fb.querySelector('.brw-fb-btn').addEventListener('click', function () {
        window.open(url, '_blank');
      });

      body.appendChild(fb);
    }

    function navigateTo(targetUrl) {
      if (!targetUrl || targetUrl === 'about:blank') return;
      url = targetUrl;
      urlInput.value = targetUrl;

      // Remove any existing fallback
      var oldFb = body.querySelector('.brw-fallback');
      if (oldFb) oldFb.remove();

      var host;
      try { host = new URL(targetUrl).hostname.replace(/^www\./, ''); } catch (e) { host = ''; }

      if (IFRAME_BLOCKED_HOSTS[host] || IFRAME_BLOCKED_HOSTS['www.' + host]) {
        iframe.style.display = 'none';
        setLoading(false);
        showFallback();
      } else {
        iframe.style.display = 'block';
        setLoading(true);
        iframe.src = targetUrl;

        var loadTimedOut = false;
        var loadTimer = setTimeout(function () {
          loadTimedOut = true;
          iframe.style.display = 'none';
          setLoading(false);
          showFallback();
        }, 8000);

        iframe.onload = function () {
          clearTimeout(loadTimer);
          setLoading(false);
          if (!loadTimedOut) {
            try {
              var doc = iframe.contentDocument || iframe.contentWindow.document;
              if (!doc || !doc.body || doc.body.innerHTML.length < 50) {
                iframe.style.display = 'none';
                showFallback();
              }
            } catch (e) {
              iframe.style.display = 'none';
              showFallback();
            }
          }
        };

        iframe.onerror = function () {
          clearTimeout(loadTimer);
          iframe.style.display = 'none';
          setLoading(false);
          showFallback();
        };
      }
    }

    // Navigation buttons
    $('brwBack_' + winId).addEventListener('click', function () {
      if (historyIdx > 0) { historyIdx--; navigateTo(history[historyIdx]); }
    });
    $('brwFwd_' + winId).addEventListener('click', function () {
      if (historyIdx < history.length - 1) { historyIdx++; navigateTo(history[historyIdx]); }
    });
    $('brwRef_' + winId).addEventListener('click', function () {
      navigateTo(url);
    });
    extBtn.addEventListener('click', function () {
      window.open(url, '_blank');
    });

    // Navigate on Enter in URL bar
    urlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var val = urlInput.value.trim();
        if (val && val.indexOf('.') >= 0) {
          if (val.indexOf('://') < 0) val = 'https://' + val;
          history.push(val);
          historyIdx = history.length - 1;
          navigateTo(val);
        }
      }
    });

    // Initial load
    navigateTo(url);
  }

  // ==================== SETTINGS ====================
  function createSettings(container) {
    container.innerHTML =
      '<div class="settings-wrapper">' +
        '<div class="settings-title">\u2699 Settings</div>' +
        '<div class="settings-group">' +
          '<div class="settings-label">Accent Color</div>' +
          '<div class="settings-row" id="colorRow">' +
            '<span class="settings-swatch green" data-color="green"></span>' +
            '<span class="settings-swatch blue" data-color="blue"></span>' +
            '<span class="settings-swatch purple" data-color="purple"></span>' +
            '<span class="settings-swatch amber" data-color="amber"></span>' +
          '</div>' +
        '</div>' +
        '<div class="settings-group">' +
          '<div class="settings-label">Desktop</div>' +
          '<label class="settings-toggle"><input type="checkbox" id="toggleParticles"' + (userSettings.particlesEnabled ? ' checked' : '') + '> Particle System</label>' +
          '<label class="settings-toggle"><input type="checkbox" id="toggleGrid"' + (userSettings.gridEnabled ? ' checked' : '') + '> Grid Overlay</label>' +
        '</div>' +
        '<div class="settings-group" style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">' +
          '<div class="settings-label">About A0/OS</div>' +
          '<div class="settings-about">' +
            'Version: 1.0.0<br>' +
            'Engine: Browser Desktop Environment<br>' +
            'Author: ' + escapeHtml(window.SITE_CONFIG.profile.name) + '<br>' +
            'Stack: HTML, CSS, JavaScript<br>' +
            'Host: GitHub Pages' +
          '</div>' +
        '</div>' +
        '<div class="settings-group" style="margin-top:16px">' +
          '<button class="settings-btn" id="resetSettings">Reset to Defaults</button>' +
        '</div>' +
      '</div>';

    // Color swatches
    var colorRow = $('colorRow');
    colorRow.querySelectorAll('.settings-swatch').forEach(function (sw) {
      if (sw.dataset.color === userSettings.accentColor) sw.classList.add('active');
      sw.addEventListener('click', function () {
        colorRow.querySelectorAll('.settings-swatch').forEach(function (s) { s.classList.remove('active'); });
        sw.classList.add('active');
        userSettings.accentColor = sw.dataset.color;
        saveSettings();
        applySettings();
        var tv = $('themeVal');
        if (tv) tv.textContent = sw.dataset.color;
      });
    });

    // Toggles
    var partToggle = $('toggleParticles');
    if (partToggle) {
      partToggle.addEventListener('change', function () {
        userSettings.particlesEnabled = partToggle.checked;
        saveSettings();
        applySettings();
      });
    }
    var gridToggle = $('toggleGrid');
    if (gridToggle) {
      gridToggle.addEventListener('change', function () {
        userSettings.gridEnabled = gridToggle.checked;
        saveSettings();
        applySettings();
      });
    }

    // Reset
    var resetBtn = $('resetSettings');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        for (var k in DEFAULT_SETTINGS) userSettings[k] = DEFAULT_SETTINGS[k];
        saveSettings();
        applySettings();
        // Update UI
        colorRow.querySelectorAll('.settings-swatch').forEach(function (s) { s.classList.remove('active'); });
        var activeSw = colorRow.querySelector('.settings-swatch.' + userSettings.accentColor);
        if (activeSw) activeSw.classList.add('active');
        if (partToggle) partToggle.checked = userSettings.particlesEnabled;
        if (gridToggle) gridToggle.checked = userSettings.gridEnabled;
        var tv = $('themeVal');
        if (tv) tv.textContent = userSettings.accentColor;
      });
    }
  }

  // ==================== CLOCK ====================
  function updateClock() {
    var now = new Date();
    var h = now.getHours(), m = now.getMinutes(), ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    var timeStr = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    var el = $('taskbar-clock');
    if (el) el.textContent = timeStr;
  }

  // ==================== LAUNCHER CLOSE ON OUTSIDE CLICK ====================
  document.addEventListener('click', function (e) {
    var menu = $('launcher-menu');
    if (!menu.classList.contains('hidden') && !e.target.closest('#launcher-btn') && !e.target.closest('#launcher-menu')) {
      menu.classList.add('hidden');
      launcherOpen = false;
    }
  });

  // ==================== LAUNCHER BUTTON ====================
  $('launcher-btn').addEventListener('click', function () { toggleLauncher(); });

  // ==================== BOOT ====================
  function boot() {
    loadSettings();

    // Init particle system (desktop background)
    var canvas = $('particle-canvas');
    if (canvas && canvas.getContext && window.requestAnimationFrame) {
      new ParticleSystem(canvas);
    }

    applySettings();
    createDesktopIcons();
    updateClock();
    setInterval(updateClock, 10000);

    // Open terminal by default
    setTimeout(function () {
      createWindow('terminal');
    }, 500);
  }

  boot();
})();
