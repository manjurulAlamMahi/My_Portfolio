(function () {
    var TABS = ['bio', 'stats', 'services', 'toolbox', 'testimonials'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'bio';

    Shell.init({ active: 'about-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { bio: 'Bio & Availability', stats: 'Stats', services: 'Services', toolbox: 'Toolbox', testimonials: 'Testimonials' };
        return '<a href="about.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');

    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
    });

    // ---- Bio ----
    var about = Store.get('about');
    document.getElementById('bioP1').value = about.bioParagraphs[0] || '';
    document.getElementById('bioP2').value = about.bioParagraphs[1] || '';
    document.getElementById('availText').value = about.availabilityText || '';
    document.getElementById('saveBio').addEventListener('click', function () {
        Store.save('about', {
            bioParagraphs: [document.getElementById('bioP1').value, document.getElementById('bioP2').value],
            availabilityText: document.getElementById('availText').value
        });
        Toast.show('Bio saved.', 'success');
    });

    // ---- Stats ----
    var stats = Store.get('stats');
    var statsField = document.getElementById('statsFields');
    function renderStats() {
        statsField.innerHTML = stats.map(function (s, i) {
            return '<div class="db-card">' +
                '<div class="db-form-group"><label>Label</label><input class="db-input" data-stat="' + i + '" data-field="label" value="' + s.label + '"></div>' +
                '<div class="db-form-group"><label>Value</label><input type="number" class="db-input" data-stat="' + i + '" data-field="value" value="' + s.value + '"></div>' +
                '<div class="db-form-group"><label>Suffix</label><input class="db-input" data-stat="' + i + '" data-field="suffix" value="' + s.suffix + '"></div>' +
            '</div>';
        }).join('');
    }
    renderStats();
    document.getElementById('saveStats').addEventListener('click', function () {
        statsField.querySelectorAll('input').forEach(function (input) {
            var i = Number(input.dataset.stat);
            var field = input.dataset.field;
            stats[i][field] = field === 'value' ? Number(input.value) : input.value;
        });
        Store.save('stats', stats);
        Toast.show('Stats saved.', 'success');
    });

    // ---- Services ----
    var services = Store.get('services');
    var servicesList = document.getElementById('servicesList');
    function serviceImageSrc(s) {
        var src = s.image || 'assets/images/tool-placeholder.svg';
        return src.indexOf('data:') === 0 ? src : DB_BASE + src;
    }
    function renderServices() {
        servicesList.innerHTML = services.map(function (s, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove service"><i class="fa fa-trash"></i></button>' +
                '<div style="display:flex;gap:16px;align-items:flex-start;">' +
                    '<div class="db-form-group" style="flex:0 0 auto;">' +
                        '<label>Icon Image</label>' +
                        '<label class="db-service-image">' +
                            '<img src="' + serviceImageSrc(s) + '" alt="">' +
                            '<input type="file" accept="image/*" data-service-image="' + i + '">' +
                        '</label>' +
                    '</div>' +
                    '<div class="db-form-group" style="flex:1;">' +
                        '<label>Title</label><input class="db-input" data-service="' + i + '" data-field="title" value="' + s.title + '">' +
                    '</div>' +
                '</div>' +
                '<div class="db-form-group"><label>Description</label><textarea class="db-textarea" data-service="' + i + '" data-field="description">' + s.description + '</textarea></div>' +
            '</div>';
        }).join('');
        servicesList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { services.splice(Number(btn.dataset.remove), 1); renderServices(); });
        });
        servicesList.querySelectorAll('[data-service-image]').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files[0];
                if (!file) return;
                var i = Number(input.dataset.serviceImage);
                var reader = new FileReader();
                reader.onload = function () {
                    services[i].image = reader.result;
                    input.previousElementSibling.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        });
    }
    renderServices();
    document.getElementById('addService').addEventListener('click', function () {
        services.push({ image: 'assets/images/tool-placeholder.svg', title: 'New Service', description: '' });
        renderServices();
    });
    document.getElementById('saveServices').addEventListener('click', function () {
        servicesList.querySelectorAll('input[data-field], textarea[data-field]').forEach(function (field) {
            var i = Number(field.dataset.service);
            services[i][field.dataset.field] = field.value;
        });
        Store.save('services', services);
        Toast.show('Services saved.', 'success');
    });

    // ---- Toolbox ----
    var toolbox = Store.get('toolbox');
    var toolboxGrid = document.getElementById('toolboxGrid');
    function toolboxImageSrc(t) {
        var src = t.image || 'assets/images/tool-placeholder.svg';
        return src.indexOf('data:') === 0 ? src : DB_BASE + src;
    }
    function renderToolbox() {
        toolboxGrid.innerHTML = toolbox.map(function (t, i) {
            return '<div class="db-toolbox-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove tool"><i class="fa fa-times"></i></button>' +
                '<label class="db-toolbox-image">' +
                    '<img src="' + toolboxImageSrc(t) + '" alt="">' +
                    '<input type="file" accept="image/*" data-tool-image="' + i + '">' +
                '</label>' +
                '<input class="db-input" style="margin-top:8px;text-align:center;" data-tool="' + i + '" data-field="label" value="' + t.label + '">' +
            '</div>';
        }).join('');
        toolboxGrid.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { toolbox.splice(Number(btn.dataset.remove), 1); renderToolbox(); });
        });
        toolboxGrid.querySelectorAll('[data-tool-image]').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files[0];
                if (!file) return;
                var i = Number(input.dataset.toolImage);
                var reader = new FileReader();
                reader.onload = function () {
                    toolbox[i].image = reader.result;
                    input.previousElementSibling.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        });
    }
    renderToolbox();
    document.getElementById('addTool').addEventListener('click', function () {
        toolbox.push({ image: 'assets/images/tool-placeholder.svg', label: 'New Tool' });
        renderToolbox();
    });
    document.getElementById('saveToolbox').addEventListener('click', function () {
        toolboxGrid.querySelectorAll('[data-field="label"]').forEach(function (input) {
            toolbox[Number(input.dataset.tool)].label = input.value;
        });
        Store.save('toolbox', toolbox);
        Toast.show('Toolbox saved.', 'success');
    });

    // ---- Testimonials ----
    var testimonials = Store.get('testimonials');
    var testimonialsList = document.getElementById('testimonialsList');
    function starsHtml(i, stars) {
        var out = '';
        for (var n = 1; n <= 5; n++) {
            out += '<i class="fa fa-star' + (n <= stars ? ' filled' : '') + '" data-testimonial="' + i + '" data-star="' + n + '"></i>';
        }
        return out;
    }
    function renderTestimonials() {
        testimonialsList.innerHTML = testimonials.map(function (t, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove testimonial"><i class="fa fa-trash"></i></button>' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Name</label><input class="db-input" data-testimonial="' + i + '" data-field="name" value="' + t.name + '"></div>' +
                    '<div class="db-form-group"><label>Role</label><input class="db-input" data-testimonial="' + i + '" data-field="role" value="' + t.role + '"></div>' +
                    '<div class="db-form-group"><label>Review Source</label><input class="db-input" data-testimonial="' + i + '" data-field="source" value="' + (t.source || '') + '" placeholder="e.g. Google Reviews, Upwork"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Quote</label><textarea class="db-textarea" data-testimonial="' + i + '" data-field="quote">' + t.quote + '</textarea></div>' +
                '<div class="db-form-group"><label>Rating</label><div class="db-stars-input">' + starsHtml(i, t.stars) + '</div></div>' +
            '</div>';
        }).join('');
        testimonialsList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { testimonials.splice(Number(btn.dataset.remove), 1); renderTestimonials(); });
        });
        testimonialsList.querySelectorAll('.db-stars-input i').forEach(function (star) {
            star.addEventListener('click', function () {
                testimonials[Number(star.dataset.testimonial)].stars = Number(star.dataset.star);
                renderTestimonials();
            });
        });
    }
    renderTestimonials();
    document.getElementById('addTestimonial').addEventListener('click', function () {
        testimonials.push({ name: 'New Client', role: '', quote: '', stars: 5, source: '' });
        renderTestimonials();
    });
    document.getElementById('saveTestimonials').addEventListener('click', function () {
        testimonialsList.querySelectorAll('input, textarea').forEach(function (field) {
            var i = Number(field.dataset.testimonial);
            if (field.dataset.field) testimonials[i][field.dataset.field] = field.value;
        });
        Store.save('testimonials', testimonials);
        Toast.show('Testimonials saved.', 'success');
    });
})();
