(function () {
    Shell.init({ active: 'dashboard' });

    var projects = Store.get('projects') || [];
    var skills = Store.get('skills') || [];
    var skillCount = skills.reduce(function (sum, cat) { return sum + cat.items.length; }, 0);
    var contact = Store.get('contact') || {};
    var messages = Store.get('messages') || [];

    // ---- Today's Event Alert (static sample data, not Store-backed) ----
    function fmtDate(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    var todayDate = new Date();
    var sampleEvents = [
        { date: fmtDate(todayDate), title: 'Team Meeting', time: '3:00 PM' },
        { date: fmtDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 24)), title: 'Client Call', time: '11:00 AM' }
    ];
    var todaysEvent = sampleEvents.find(function (e) { return e.date === fmtDate(todayDate); });
    if (todaysEvent) {
        document.getElementById('eventAlert').innerHTML =
            '<div class="db-event-alert">' +
                '<span class="icon"><i class="fa fa-bell"></i></span>' +
                '<div>' +
                    '<div class="label">Today\'s Event</div>' +
                    '<div class="message">You have an event today: <strong>' + todaysEvent.title + '</strong> at ' + todaysEvent.time + '.</div>' +
                '</div>' +
            '</div>';
    }

    // ---- Stat tiles ----
    var unreadCount = messages.filter(function (m) { return !m.read; }).length;
    var stats = [
        { icon: 'fa-folder-open-o', value: projects.length, label: 'Projects' },
        { icon: 'fa-bar-chart', value: skillCount, label: 'Tracked Skills' },
        { icon: 'fa-envelope-o', value: unreadCount, label: 'Unread Messages' }
    ];
    document.getElementById('statTiles').innerHTML = stats.map(function (s) {
        return '<div class="db-stat-tile"><span class="icon"><i class="fa ' + s.icon + '"></i></span><div><div class="value">' + s.value + '</div><div class="label">' + s.label + '</div></div></div>';
    }).join('') +
        '<div class="db-stat-tile"><span class="icon"><i class="fa fa-clock-o"></i></span><div><div class="value" id="statClockValue" style="font-variant-numeric:tabular-nums;">--:--:--</div><div class="label">Live Clock</div></div></div>';

    // ---- Live clock (4th stat tile) ----
    function tickStatClock() {
        var now = new Date();
        document.getElementById('statClockValue').textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    tickStatClock();
    setInterval(tickStatClock, 1000);

    // ---- Calendar ----
    var today = new Date();
    var calView = { year: today.getFullYear(), month: today.getMonth() };
    var DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function renderCalendar() {
        document.getElementById('calendarMonthLabel').textContent = MONTHS[calView.month] + ' ' + calView.year;
        var firstDay = new Date(calView.year, calView.month, 1).getDay();
        var daysInMonth = new Date(calView.year, calView.month + 1, 0).getDate();
        var isCurrentMonth = calView.year === today.getFullYear() && calView.month === today.getMonth();

        var cells = DOW.map(function (d) { return '<div class="dow">' + d + '</div>'; });
        for (var e = 0; e < firstDay; e++) cells.push('<div class="day empty"></div>');
        for (var day = 1; day <= daysInMonth; day++) {
            var isToday = isCurrentMonth && day === today.getDate();
            var cellDateStr = fmtDate(new Date(calView.year, calView.month, day));
            var dayEvent = sampleEvents.find(function (ev) { return ev.date === cellDateStr; });
            cells.push(
                '<div class="day' + (isToday ? ' today' : '') + (dayEvent ? ' has-event' : '') + '">' +
                    day +
                    (dayEvent ? '<span class="event-dot"></span><span class="event-tooltip">' + dayEvent.title + ' — ' + dayEvent.time + '</span>' : '') +
                '</div>'
            );
        }
        document.getElementById('calendarWidget').innerHTML = '<div class="db-calendar-grid">' + cells.join('') + '</div>';
    }
    renderCalendar();
    document.getElementById('calPrev').addEventListener('click', function () {
        calView.month -= 1;
        if (calView.month < 0) { calView.month = 11; calView.year -= 1; }
        renderCalendar();
    });
    document.getElementById('calNext').addEventListener('click', function () {
        calView.month += 1;
        if (calView.month > 11) { calView.month = 0; calView.year += 1; }
        renderCalendar();
    });

    // ---- Projects published/draft split ----
    var published = projects.filter(function (p) { return p.status === 'Published'; }).length;
    var draft = projects.length - published;
    var total = projects.length || 1;
    document.getElementById('splitBar').innerHTML =
        '<span class="published" style="width:' + (published / total * 100) + '%"></span>' +
        '<span class="draft" style="width:' + (draft / total * 100) + '%"></span>';
    document.getElementById('splitLegend').innerHTML =
        '<span><span class="dot published"></span> Published (' + published + ')</span>' +
        '<span><span class="dot draft"></span> Draft (' + draft + ')</span>';

    // ---- Projects by category ----
    var categoryCounts = {};
    projects.forEach(function (p) {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    var categories = Object.keys(categoryCounts);
    var maxCategoryCount = Math.max.apply(null, categories.map(function (c) { return categoryCounts[c]; }).concat([1]));
    document.getElementById('categoryBreakdown').innerHTML = categories.map(function (c) {
        var pct = categoryCounts[c] / maxCategoryCount * 100;
        return '<div class="db-category-row">' +
            '<div class="db-category-label"><span>' + c + '</span><span class="count">' + categoryCounts[c] + '</span></div>' +
            '<div class="db-category-track"><span class="db-category-fill" style="width:' + pct + '%"></span></div>' +
        '</div>';
    }).join('');

    // ---- To-Do list ----
    var todos = Store.get('todos') || [];
    var todoList = document.getElementById('todoList');
    function renderTodos() {
        if (!todos.length) {
            todoList.innerHTML = '<li class="db-todo-empty">No tasks yet. Add one above.</li>';
            return;
        }
        todoList.innerHTML = todos.map(function (t, i) {
            return '<li class="' + (t.done ? 'done' : '') + '">' +
                '<input type="checkbox" data-toggle="' + i + '"' + (t.done ? ' checked' : '') + '>' +
                '<span class="text">' + t.text + '</span>' +
                '<button type="button" data-remove="' + i + '" aria-label="Remove task"><i class="fa fa-times"></i></button>' +
            '</li>';
        }).join('');
        todoList.querySelectorAll('[data-toggle]').forEach(function (cb) {
            cb.addEventListener('change', function () {
                todos[Number(cb.dataset.toggle)].done = cb.checked;
                Store.save('todos', todos);
                renderTodos();
            });
        });
        todoList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                todos.splice(Number(btn.dataset.remove), 1);
                Store.save('todos', todos);
                renderTodos();
            });
        });
    }
    renderTodos();
    function addTodo() {
        var input = document.getElementById('todoInput');
        var text = input.value.trim();
        if (!text) return;
        todos.push({ id: 'todo-' + Date.now(), text: text, done: false });
        Store.save('todos', todos);
        input.value = '';
        renderTodos();
    }
    document.getElementById('addTodoBtn').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') addTodo(); });

    // ---- Quick Note ----
    var notes = Store.get('notes') || { text: '' };
    var noteEl = document.getElementById('quickNote');
    var noteHint = document.getElementById('noteSavedHint');
    noteEl.value = notes.text || '';
    var noteTimer = null;
    noteEl.addEventListener('input', function () {
        clearTimeout(noteTimer);
        noteTimer = setTimeout(function () {
            Store.save('notes', { text: noteEl.value });
            noteHint.textContent = 'Saved just now';
            setTimeout(function () { noteHint.textContent = ' '; }, 2000);
        }, 500);
    });

    // ---- Reminders ----
    var reminders = Store.get('reminders') || [];
    var reminderList = document.getElementById('reminderList');
    function renderReminders() {
        reminders.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
        if (!reminders.length) {
            reminderList.innerHTML = '<li class="db-todo-empty">No reminders set.</li>';
            return;
        }
        reminderList.innerHTML = reminders.map(function (r, i) {
            var dateLabel = r.date ? new Date(r.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
            return '<li>' +
                (dateLabel ? '<span class="rdate">' + dateLabel + '</span>' : '') +
                '<span class="text">' + r.text + '</span>' +
                '<button type="button" data-remove="' + i + '" aria-label="Remove reminder"><i class="fa fa-times"></i></button>' +
            '</li>';
        }).join('');
        reminderList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                reminders.splice(Number(btn.dataset.remove), 1);
                Store.save('reminders', reminders);
                renderReminders();
            });
        });
    }
    renderReminders();
    document.getElementById('addReminderBtn').addEventListener('click', function () {
        var textInput = document.getElementById('reminderText');
        var dateInput = document.getElementById('reminderDate');
        var text = textInput.value.trim();
        if (!text) { Toast.show('Enter a reminder first.', 'error'); return; }
        reminders.push({ id: 'rem-' + Date.now(), text: text, date: dateInput.value });
        Store.save('reminders', reminders);
        textInput.value = '';
        dateInput.value = '';
        renderReminders();
    });

    // ---- Recent Activity ----
    var activity = [
        'Dashboard session started',
        projects.length + ' project(s) currently tracked',
        skillCount + ' skill(s) across ' + skills.length + ' categories',
        unreadCount + ' unread message(s)'
    ];
    document.getElementById('activityList').innerHTML = activity.map(function (a) {
        return '<li style="padding:10px 0;border-bottom:1px solid var(--db-border);font-size:13px;color:var(--db-body);">' + a + '</li>';
    }).join('');

    // ---- Recent Messages preview ----
    var recentMessages = messages.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); }).slice(0, 3);
    var previewEl = document.getElementById('messagePreviewList');
    if (!recentMessages.length) {
        previewEl.innerHTML = '<li>No messages yet.</li>';
    } else {
        previewEl.innerHTML = recentMessages.map(function (m) {
            return '<li>' + (m.read ? '' : '<span class="db-unread-dot"></span>') + '<span class="name">' + m.name + '</span><span class="subject">' + m.subject + '</span></li>';
        }).join('');
    }

    // ---- Quick Jump ----
    var jumps = [
        { label: 'Add Project', href: 'pages/projects.html', icon: 'fa-plus' },
        { label: 'Messages', href: 'pages/messages.html', icon: 'fa-envelope-o' },
        { label: 'Settings', href: 'pages/settings.html', icon: 'fa-cog' }
    ];
    document.getElementById('quickJump').innerHTML = jumps.map(function (j) {
        return '<a class="db-card" style="text-align:center;padding:18px;" href="' + j.href + '"><i class="fa ' + j.icon + '" style="font-size:18px;color:var(--db-accent);"></i><div style="margin-top:8px;font-size:12.5px;color:var(--db-ink);">' + j.label + '</div></a>';
    }).join('');
})();
