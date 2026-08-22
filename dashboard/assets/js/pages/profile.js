(function () {
    Shell.init({ active: 'profile' });

    var profile = Store.get('profile');
    var hero = Store.get('hero');

    document.getElementById('pName').value = profile.name;
    document.getElementById('pRole').value = profile.designation;
    document.getElementById('pLocation').value = profile.location;
    document.getElementById('pAvailable').checked = !!profile.available;

    var socialLinks = (Array.isArray(profile.social) ? profile.social : []).slice();
    var socialLinksList = document.getElementById('socialLinksList');
    function renderSocialLinks() {
        socialLinksList.innerHTML = socialLinks.map(function (s, i) {
            return '<div class="db-list-item">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove social link"><i class="fa fa-trash"></i></button>' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Icon (Font Awesome class)</label><input class="db-input" data-social="' + i + '" data-field="icon" value="' + s.icon + '"></div>' +
                    '<div class="db-form-group"><label>Title</label><input class="db-input" data-social="' + i + '" data-field="title" value="' + s.title + '"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Link</label><input class="db-input" data-social="' + i + '" data-field="link" value="' + s.link + '"></div>' +
            '</div>';
        }).join('');
        socialLinksList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { socialLinks.splice(Number(btn.dataset.remove), 1); renderSocialLinks(); });
        });
    }
    renderSocialLinks();
    document.getElementById('addSocialLink').addEventListener('click', function () {
        socialLinks.push({ icon: 'fa-link', title: 'New Link', link: '' });
        renderSocialLinks();
    });

    document.getElementById('hLine1').value = hero.typedLine1;
    document.getElementById('hLine2').value = hero.typedLine2;
    document.getElementById('hIntro').value = hero.introText;
    document.getElementById('hCta1').value = hero.ctaPrimaryLabel;
    document.getElementById('hCta2').value = hero.ctaSecondaryLabel;

    var avatarUploader = Uploader.mount(document.getElementById('avatarUploader'), { accept: 'image/*', onChange: function () {} });
    // Stored path is dashboard-root-relative; DB_BASE resolves it from this
    // page's actual depth (see Task 8) before it's used as an <img src>.
    avatarUploader.setValue(DB_BASE + profile.avatar, 'avatar');

    function updatePreview() {
        document.getElementById('previewLine1').textContent = document.getElementById('hLine1').value;
        document.getElementById('previewLine2').textContent = document.getElementById('hLine2').value;
        document.getElementById('previewIntro').textContent = document.getElementById('hIntro').value;
    }
    ['hLine1', 'hLine2', 'hIntro'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', updatePreview);
    });
    updatePreview();

    document.getElementById('saveBtn').addEventListener('click', function () {
        socialLinksList.querySelectorAll('input').forEach(function (input) {
            socialLinks[Number(input.dataset.social)][input.dataset.field] = input.value;
        });
        Store.save('profile', {
            avatar: profile.avatar,
            name: document.getElementById('pName').value,
            designation: document.getElementById('pRole').value,
            location: document.getElementById('pLocation').value,
            available: document.getElementById('pAvailable').checked,
            social: socialLinks
        });
        Store.save('hero', {
            typedLine1: document.getElementById('hLine1').value,
            typedLine2: document.getElementById('hLine2').value,
            introText: document.getElementById('hIntro').value,
            ctaPrimaryLabel: document.getElementById('hCta1').value,
            ctaSecondaryLabel: document.getElementById('hCta2').value
        });
        Toast.show('Profile & hero content saved.', 'success');
    });
})();
