(function () {
    Shell.init({ active: 'messages' });

    var messages = Store.get('messages');
    var listEl = document.getElementById('messagesList');
    var emptyEl = document.getElementById('emptyState');

    function initials(name) {
        return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
    }

    function formatDate(iso) {
        var d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }

    function render() {
        emptyEl.style.display = messages.length ? 'none' : 'block';
        messages.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

        listEl.innerHTML = messages.map(function (m, i) {
            return '<div class="db-message-card' + (m.read ? '' : ' unread') + '" data-open="' + i + '">' +
                '<div class="db-message-card-head">' +
                    '<div class="db-message-avatar">' + initials(m.name) + '</div>' +
                    '<div class="db-message-meta">' +
                        '<div class="name-row">' + (m.read ? '' : '<span class="db-unread-dot"></span>') + '<span class="name">' + m.name + '</span></div>' +
                        '<div class="subject">' + m.subject + '</div>' +
                    '</div>' +
                    '<div class="db-message-date">' + formatDate(m.date) + '</div>' +
                '</div>' +
                '<div class="db-message-body">' +
                    '<p>' + m.message + '</p>' +
                    '<div class="db-message-actions">' +
                        '<a class="db-pill-btn accent" href="mailto:' + m.email + '?subject=' + encodeURIComponent('Re: ' + m.subject) + '"><i class="fa fa-reply"></i> Reply via Email</a>' +
                        '<button type="button" class="db-pill-btn danger" data-delete="' + i + '"><i class="fa fa-trash"></i> Delete</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        listEl.querySelectorAll('.db-message-card').forEach(function (card) {
            card.addEventListener('click', function (e) {
                if (e.target.closest('[data-delete]') || e.target.closest('a')) return;
                var i = Number(card.dataset.open);
                card.classList.toggle('expanded');
                if (!messages[i].read) {
                    messages[i].read = true;
                    Store.save('messages', messages);
                    Shell.refreshBadges();
                    render();
                }
            });
        });

        listEl.querySelectorAll('[data-delete]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var i = Number(btn.dataset.delete);
                Modal.confirm({ title: 'Delete this message?', message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        messages.splice(i, 1);
                        Store.save('messages', messages);
                        Shell.refreshBadges();
                        Toast.show('Message deleted.', 'success');
                        render();
                    });
            });
        });
    }

    render();
})();
