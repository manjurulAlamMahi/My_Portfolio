(function () {
    Shell.init({ active: 'projects-list' });

    var params = new URLSearchParams(window.location.search);
    var editSlug = params.get('slug');
    var projects = Store.get('projects');
    var existing = editSlug ? projects.find(function (p) { return p.slug === editSlug; }) : null;

    var techStack = existing ? existing.techStack.slice() : [];
    var features = existing ? existing.features.slice() : [];
    var screenshotUploaders = [];

    if (existing) {
        document.getElementById('formTitle').textContent = 'Edit Project';
        document.getElementById('fTitle').value = existing.title;
        document.getElementById('fStatus').value = existing.status;
        document.getElementById('fShortDesc').value = existing.shortDescription;
        document.getElementById('fOverview').value = existing.overview || '';
        document.getElementById('fProblem').value = existing.problem || '';
        document.getElementById('fJourney').value = existing.journey || '';
        document.getElementById('fFunctionality').value = existing.functionality || '';
        document.getElementById('lGithub').value = (existing.links && existing.links.github) || '';
        document.getElementById('lLive').value = (existing.links && existing.links.live) || '';
        document.getElementById('lFigma').value = (existing.links && existing.links.figma) || '';
    }

    // ---- Category select (place to manage categories, not free-text) ----
    var ADD_NEW_CATEGORY = '__add_new__';
    var categories = Store.get('projectCategories') || [];
    if (existing && existing.category && categories.indexOf(existing.category) === -1) {
        categories = categories.concat([existing.category]);
    }
    var categorySelect = document.getElementById('fCategory');
    var categoryNewInput = document.getElementById('fCategoryNew');
    categorySelect.innerHTML = categories.map(function (c) {
        return '<option value="' + c + '">' + c + '</option>';
    }).join('') + '<option value="' + ADD_NEW_CATEGORY + '">+ Add new category…</option>';
    categorySelect.value = existing ? existing.category : categories[0];

    categorySelect.addEventListener('change', function () {
        var isNew = categorySelect.value === ADD_NEW_CATEGORY;
        categoryNewInput.style.display = isNew ? 'block' : 'none';
        if (isNew) categoryNewInput.focus();
    });

    // ---- Thumbnail / Banner uploaders ----
    var thumbUploader = Uploader.mount(document.getElementById('thumbUploader'), { accept: 'image/*', onChange: function () {} });
    var bannerUploader = Uploader.mount(document.getElementById('bannerUploader'), { accept: 'image/*', onChange: function () {} });
    if (existing) {
        thumbUploader.setValue(DB_BASE + existing.thumbnail, 'thumbnail');
        bannerUploader.setValue(DB_BASE + existing.banner, 'banner');
    }

    // ---- Screenshots (dynamic uploader slots) ----
    var screenshotsGrid = document.getElementById('screenshotsGrid');
    function addScreenshotSlot(initialUrl) {
        var index = screenshotUploaders.length;
        var wrap = document.createElement('div');
        wrap.className = 'db-screenshot-slot';
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'db-pill-btn danger remove-slot db-remove-x';
        removeBtn.innerHTML = '<i class="fa fa-times"></i>';
        var mount = document.createElement('div');
        wrap.appendChild(removeBtn);
        wrap.appendChild(mount);
        screenshotsGrid.appendChild(wrap);

        var uploader = Uploader.mount(mount, { accept: 'image/*', onChange: function () {} });
        if (initialUrl) uploader.setValue(initialUrl.indexOf('data:') === 0 ? initialUrl : DB_BASE + initialUrl, 'screenshot');
        screenshotUploaders.push(uploader);

        removeBtn.addEventListener('click', function () {
            wrap.remove();
            screenshotUploaders.splice(index, 1);
        });
    }
    (existing ? existing.screenshots : []).forEach(addScreenshotSlot);
    document.getElementById('addScreenshot').addEventListener('click', function () { addScreenshotSlot(null); });

    // ---- Tech stack tag input ----
    var techTagWrap = document.getElementById('techTagWrap');
    var techTagInput = document.getElementById('techTagInput');
    function renderTags() {
        techTagWrap.querySelectorAll('.db-tag-chip').forEach(function (chip) { chip.remove(); });
        techStack.forEach(function (tag, i) {
            var chip = document.createElement('span');
            chip.className = 'db-tag-chip';
            chip.innerHTML = tag + ' <button type="button" data-tag-remove="' + i + '">&times;</button>';
            techTagWrap.insertBefore(chip, techTagInput);
        });
        techTagWrap.querySelectorAll('[data-tag-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { techStack.splice(Number(btn.dataset.tagRemove), 1); renderTags(); });
        });
    }
    renderTags();
    techTagInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && techTagInput.value.trim()) {
            e.preventDefault();
            techStack.push(techTagInput.value.trim());
            techTagInput.value = '';
            renderTags();
        }
    });

    // ---- Features dynamic list ----
    var featuresList = document.getElementById('featuresList');
    function renderFeatures() {
        featuresList.innerHTML = features.map(function (f, i) {
            return '<div class="db-feature-row"><input class="db-input" data-feature="' + i + '" value="' + f + '"><button type="button" class="db-pill-btn danger" data-remove-feature="' + i + '"><i class="fa fa-trash"></i></button></div>';
        }).join('');
        featuresList.querySelectorAll('[data-remove-feature]').forEach(function (btn) {
            btn.addEventListener('click', function () { features.splice(Number(btn.dataset.removeFeature), 1); renderFeatures(); });
        });
        featuresList.querySelectorAll('[data-feature]').forEach(function (input) {
            input.addEventListener('input', function () { features[Number(input.dataset.feature)] = input.value; });
        });
    }
    renderFeatures();
    document.getElementById('addFeature').addEventListener('click', function () { features.push(''); renderFeatures(); });

    // ---- Save ----
    function slugify(text) {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    document.getElementById('saveProject').addEventListener('click', function () {
        var title = document.getElementById('fTitle').value.trim();
        if (!title) { Toast.show('Title is required.', 'error'); return; }

        var category = categorySelect.value;
        if (category === ADD_NEW_CATEGORY) {
            category = categoryNewInput.value.trim();
            if (!category) { Toast.show('Enter a name for the new category.', 'error'); return; }
            if (categories.indexOf(category) === -1) {
                categories = categories.concat([category]);
                Store.save('projectCategories', categories);
            }
        }

        var slug = existing ? existing.slug : slugify(title);
        var thumb = thumbUploader.getValue();
        var banner = bannerUploader.getValue();

        var record = {
            slug: slug,
            title: title,
            category: category,
            status: document.getElementById('fStatus').value,
            shortDescription: document.getElementById('fShortDesc').value,
            techStack: techStack,
            thumbnail: thumb.url || (existing ? existing.thumbnail : ''),
            banner: banner.url || (existing ? existing.banner : ''),
            overview: document.getElementById('fOverview').value,
            problem: document.getElementById('fProblem').value,
            journey: document.getElementById('fJourney').value,
            functionality: document.getElementById('fFunctionality').value,
            features: features.filter(function (f) { return f.trim(); }),
            screenshots: screenshotUploaders.map(function (u) { return u.getValue().url; }).filter(Boolean),
            links: {
                github: document.getElementById('lGithub').value,
                live: document.getElementById('lLive').value,
                figma: document.getElementById('lFigma').value
            }
        };

        var index = projects.findIndex(function (p) { return p.slug === slug; });
        if (index !== -1) {
            projects[index] = record;
        } else {
            projects.push(record);
        }
        Store.save('projects', projects);
        sessionStorage.setItem('db-flash', existing ? 'Project updated.' : 'Project added.');
        window.location.href = 'projects.html';
    });
})();
