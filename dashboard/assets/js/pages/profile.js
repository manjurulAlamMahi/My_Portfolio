(function () {
    Shell.init({ active: 'profile' });

    var profile = Store.get('profile');
    var hero = Store.get('hero');

    document.getElementById('pName').value = profile.name;
    document.getElementById('pRole').value = profile.designation;
    document.getElementById('pLocation').value = profile.location;
    document.getElementById('pAvailable').checked = !!profile.available;
    document.getElementById('sFacebook').value = profile.social.facebook || '';
    document.getElementById('sTwitter').value = profile.social.twitter || '';
    document.getElementById('sLinkedin').value = profile.social.linkedin || '';
    document.getElementById('sInstagram').value = profile.social.instagram || '';

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
        Store.save('profile', {
            avatar: profile.avatar,
            name: document.getElementById('pName').value,
            designation: document.getElementById('pRole').value,
            location: document.getElementById('pLocation').value,
            available: document.getElementById('pAvailable').checked,
            social: {
                facebook: document.getElementById('sFacebook').value,
                twitter: document.getElementById('sTwitter').value,
                linkedin: document.getElementById('sLinkedin').value,
                instagram: document.getElementById('sInstagram').value
            }
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
