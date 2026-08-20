(function () {
    Shell.init({ active: 'projects' });

    var projects = Store.get('projects');
    var rowsEl = document.getElementById('projectsRows');
    var emptyEl = document.getElementById('emptyState');
    var searchInput = document.getElementById('searchInput');
    var categoryFiltersEl = document.getElementById('categoryFilters');
    var activeCategory = 'All';

    var knownCategories = Store.get('projectCategories') || [];
    var usedCategories = projects.map(function (p) { return p.category; }).filter(Boolean);
    var categories = ['All'].concat(knownCategories.concat(usedCategories).filter(function (c, i, arr) { return arr.indexOf(c) === i; }));
    categoryFiltersEl.innerHTML = categories.map(function (c) {
        return '<button type="button" class="db-filter-chip' + (c === activeCategory ? ' active' : '') + '" data-cat="' + c + '">' + c + '</button>';
    }).join('');
    categoryFiltersEl.querySelectorAll('[data-cat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            activeCategory = btn.dataset.cat;
            categoryFiltersEl.querySelectorAll('[data-cat]').forEach(function (b) { b.classList.toggle('active', b === btn); });
            render();
        });
    });

    function render() {
        var query = searchInput.value.trim().toLowerCase();
        var filtered = projects.filter(function (p) {
            var matchesQuery = !query || p.title.toLowerCase().indexOf(query) !== -1 || p.shortDescription.toLowerCase().indexOf(query) !== -1;
            var matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            return matchesQuery && matchesCategory;
        });

        emptyEl.style.display = filtered.length ? 'none' : 'block';
        rowsEl.innerHTML = filtered.map(function (p) {
            var techBadges = p.techStack.slice(0, 3).map(function (t) { return '<span class="db-badge">' + t + '</span>'; }).join('');
            return '<div class="db-row-card">' +
                '<div class="thumb"><img src="' + DB_BASE + p.thumbnail + '" alt=""></div>' +
                '<div><p class="title">' + p.title + '</p><p class="desc">' + p.shortDescription + '</p></div>' +
                '<div><span class="db-badge accent">' + p.category + '</span></div>' +
                '<div class="db-tech-badges">' + techBadges + '</div>' +
                '<div><span class="db-status-pill ' + p.status.toLowerCase() + '">' + p.status + '</span></div>' +
                '<div class="actions">' +
                    '<a class="db-icon-btn" href="project-form.html?slug=' + encodeURIComponent(p.slug) + '" aria-label="Edit"><i class="fa fa-pencil"></i></a>' +
                    '<button type="button" class="db-icon-btn" data-delete="' + p.slug + '" aria-label="Delete"><i class="fa fa-trash"></i></button>' +
                '</div>' +
            '</div>';
        }).join('');

        rowsEl.querySelectorAll('[data-delete]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var slug = btn.dataset.delete;
                var project = projects.find(function (p) { return p.slug === slug; });
                Modal.confirm({ title: 'Delete "' + project.title + '"?', message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        projects = projects.filter(function (p) { return p.slug !== slug; });
                        Store.save('projects', projects);
                        Toast.show('Project deleted.', 'success');
                        render();
                    });
            });
        });
    }

    searchInput.addEventListener('input', render);
    render();

    var flash = sessionStorage.getItem('db-flash');
    if (flash) {
        Toast.show(flash, 'success');
        sessionStorage.removeItem('db-flash');
    }
})();
