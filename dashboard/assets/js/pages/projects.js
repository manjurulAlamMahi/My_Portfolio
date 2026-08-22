(function () {
    var TABS = ['list', 'categories'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'list';

    Shell.init({ active: 'projects-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { list: 'Projects', categories: 'Categories' };
        return '<a href="projects.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');

    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
    });

    // ---- Project list ----
    var projects = Store.get('projects');
    var rowsEl = document.getElementById('projectsRows');
    var emptyEl = document.getElementById('emptyState');
    var searchInput = document.getElementById('searchInput');
    var categoryFiltersEl = document.getElementById('categoryFilters');
    var activeCategory = 'All';

    var knownCategories = Store.get('projectCategories') || [];
    var usedCategories = projects.map(function (p) { return p.category; }).filter(Boolean);
    var filterCategories = ['All'].concat(knownCategories.concat(usedCategories).filter(function (c, i, arr) { return arr.indexOf(c) === i; }));
    categoryFiltersEl.innerHTML = filterCategories.map(function (c) {
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
                    '<label class="db-toggle" title="Toggle Published/Draft"><input type="checkbox" data-toggle-status="' + p.slug + '"' + (p.status === 'Published' ? ' checked' : '') + '><span class="track"></span></label>' +
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

        rowsEl.querySelectorAll('[data-toggle-status]').forEach(function (input) {
            input.addEventListener('change', function () {
                var slug = input.dataset.toggleStatus;
                var project = projects.find(function (p) { return p.slug === slug; });
                project.status = input.checked ? 'Published' : 'Draft';
                Store.save('projects', projects);
                Toast.show('Project ' + (project.status === 'Published' ? 'published' : 'unpublished') + '.', 'success');
                render();
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

    // ---- Categories management ----
    var manageCategories = Store.get('projectCategories') || [];
    var categoriesList = document.getElementById('categoriesList');

    function applyCategoryRenames(renamed) {
        if (!renamed.length) return;
        projects.forEach(function (p) {
            renamed.some(function (r) {
                if (p.category === r.from) { p.category = r.to; return true; }
                return false;
            });
        });
        Store.save('projects', projects);
    }

    function renderCategories() {
        if (!manageCategories.length) {
            categoriesList.innerHTML = '<p class="db-form-hint">No categories yet. Add one above.</p>';
            return;
        }
        categoriesList.innerHTML = manageCategories.map(function (c, i) {
            return '<div class="db-form-row" style="margin-bottom:12px;align-items:center;">' +
                '<input class="db-input" data-category="' + i + '" value="' + c + '">' +
                '<button type="button" class="db-pill-btn danger db-remove-x" data-remove-category="' + i + '" aria-label="Remove category" style="flex:0 0 auto;"><i class="fa fa-trash"></i></button>' +
            '</div>';
        }).join('');
        categoriesList.querySelectorAll('[data-remove-category]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var i = Number(btn.dataset.removeCategory);
                Modal.confirm({ title: 'Delete "' + manageCategories[i] + '"?', message: 'Projects already using this category will keep it as free text until reassigned.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        var renamed = [];
                        categoriesList.querySelectorAll('[data-category]').forEach(function (input) {
                            var idx = Number(input.dataset.category);
                            var oldName = manageCategories[idx];
                            var newName = input.value;
                            if (oldName !== newName) renamed.push({ from: oldName, to: newName });
                            manageCategories[idx] = newName;
                        });
                        applyCategoryRenames(renamed);
                        manageCategories.splice(i, 1);
                        Store.save('projectCategories', manageCategories);
                        renderCategories();
                        Toast.show('Category deleted.', 'success');
                    });
            });
        });
    }
    renderCategories();

    document.getElementById('addCategoryBtn').addEventListener('click', function () {
        var name = document.getElementById('newCategoryInput').value.trim();
        if (!name) { Toast.show('Enter a category name.', 'error'); return; }
        manageCategories.push(name);
        Store.save('projectCategories', manageCategories);
        document.getElementById('newCategoryInput').value = '';
        renderCategories();
        Toast.show('Category added.', 'success');
    });

    document.getElementById('saveCategories').addEventListener('click', function () {
        var renamed = [];
        categoriesList.querySelectorAll('[data-category]').forEach(function (input) {
            var i = Number(input.dataset.category);
            var oldName = manageCategories[i];
            var newName = input.value;
            if (oldName !== newName) renamed.push({ from: oldName, to: newName });
            manageCategories[i] = newName;
        });
        applyCategoryRenames(renamed);
        Store.save('projectCategories', manageCategories);
        Toast.show('Categories saved.', 'success');
    });
})();
