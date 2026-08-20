(function (global) {
    var NAV = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fa-th-large', href: 'index.html' },
        { id: 'profile', label: 'Profile & Hero', icon: 'fa-user-circle-o', href: 'pages/profile.html' },
        { id: 'about', label: 'About', icon: 'fa-info-circle', children: [
            { id: 'about-bio', label: 'Bio & Availability', href: 'pages/about.html?tab=bio' },
            { id: 'about-stats', label: 'Stats', href: 'pages/about.html?tab=stats' },
            { id: 'about-services', label: 'Services', href: 'pages/about.html?tab=services' },
            { id: 'about-toolbox', label: 'Toolbox', href: 'pages/about.html?tab=toolbox' },
            { id: 'about-testimonials', label: 'Testimonials', href: 'pages/about.html?tab=testimonials' }
        ]},
        { id: 'resume', label: 'Resume', icon: 'fa-file-text-o', children: [
            { id: 'resume-skills', label: 'Skills', href: 'pages/resume-skills.html' },
            { id: 'resume-experience', label: 'Experience', href: 'pages/resume-experience.html' },
            { id: 'resume-education', label: 'Education', href: 'pages/resume-education.html' }
        ]},
        { id: 'projects', label: 'Projects', icon: 'fa-folder-open-o', href: 'pages/projects.html' },
        { id: 'media', label: 'Media Library', icon: 'fa-picture-o', href: 'pages/media.html' },
        { id: 'messages', label: 'Messages', icon: 'fa-envelope-o', href: 'pages/messages.html', badge: 'messages' },
        { id: 'contact', label: 'Contact', icon: 'fa-map-marker', href: 'pages/contact.html' }
    ];

    var NAV_BOTTOM = [
        { id: 'settings', label: 'Settings', icon: 'fa-cog', children: [
            { id: 'settings-mail', label: 'Mail Configuration', href: 'pages/settings.html?tab=mail' },
            { id: 'settings-ai', label: 'AI Assistant Configuration', href: 'pages/settings.html?tab=ai' }
        ]}
    ];

    function itemContainsActive(item, active) {
        if (item.id === active) return true;
        if (item.children) return item.children.some(function (c) { return c.id === active; });
        return false;
    }

    function badgeHtml(item) {
        if (!item.badge) return '';
        var records = (global.Store && global.Store.get(item.badge)) || [];
        var count = records.filter(function (r) { return r.read === false; }).length;
        return count > 0 ? '<span class="db-nav-badge">' + count + '</span>' : '';
    }

    function renderItem(item, active) {
        var isActive = itemContainsActive(item, active);
        if (item.children) {
            var subHtml = item.children.map(function (c) {
                var childActive = c.id === active;
                return '<li><a class="db-nav-link' + (childActive ? ' active' : '') + '" href="' + global.DB_BASE + c.href + '">' + c.label + '</a></li>';
            }).join('');
            return (
                '<li class="db-nav-item has-children' + (isActive ? ' active open' : '') + '">' +
                    '<button type="button" class="db-nav-toggle">' +
                        '<span class="db-nav-icon"><i class="fa ' + item.icon + '"></i></span>' +
                        '<span class="db-nav-text">' + item.label + '</span>' +
                        '<span class="db-nav-chevron"><i class="fa fa-chevron-right"></i></span>' +
                    '</button>' +
                    '<ul class="db-nav-sub" data-parent-label="' + item.label + '">' + subHtml + '</ul>' +
                '</li>'
            );
        }
        return (
            '<li class="db-nav-item' + (isActive ? ' active' : '') + '">' +
                '<a class="db-nav-link" href="' + global.DB_BASE + item.href + '">' +
                    '<span class="db-nav-icon"><i class="fa ' + item.icon + '"></i></span>' +
                    '<span class="db-nav-text">' + item.label + '</span>' +
                    badgeHtml(item) +
                '</a>' +
            '</li>'
        );
    }

    function sidebarHtml(active, profile) {
        return (
            '<aside class="db-sidebar" id="dbSidebar">' +
                '<div class="db-sidebar-profile">' +
                    '<div class="db-sidebar-avatar"><img src="' + global.DB_BASE + profile.avatar + '" alt="' + profile.name + '"></div>' +
                    '<h2 class="db-sidebar-name">' + profile.name + '</h2>' +
                    '<p class="db-sidebar-role">' + profile.designation + '</p>' +
                '</div>' +
                '<div class="db-nav-label">Navigation</div>' +
                '<ul class="db-nav">' + NAV.map(function (i) { return renderItem(i, active); }).join('') + '</ul>' +
                '<div class="db-sidebar-bottom">' +
                    '<ul class="db-nav">' + NAV_BOTTOM.map(function (i) { return renderItem(i, active); }).join('') + '</ul>' +
                    '<button type="button" class="db-sidebar-collapse-btn" id="dbSidebarCollapseBtn"><i class="fa fa-angle-double-left"></i></button>' +
                '</div>' +
            '</aside>' +
            '<div class="db-sidebar-backdrop" id="dbSidebarBackdrop"></div>'
        );
    }

    function headerHtml() {
        return (
            '<header class="db-header">' +
                '<div class="db-header-left">' +
                    '<button type="button" class="db-sidebar-drawer-toggle" id="dbDrawerToggle" aria-label="Open menu"><i class="fa fa-bars"></i></button>' +
                '</div>' +
                '<div class="db-header-actions">' +
                    '<button type="button" class="db-icon-btn" id="dbThemeBtn" aria-label="Toggle dark mode"><i class="fa fa-moon-o"></i></button>' +
                    '<button type="button" class="db-icon-btn" id="dbFullscreenBtn" aria-label="Toggle fullscreen"><i class="fa fa-expand"></i></button>' +
                    '<button type="button" class="db-icon-btn db-logout-btn" id="dbLogoutBtn" aria-label="Log out"><i class="fa fa-sign-out"></i></button>' +
                '</div>' +
            '</header>'
        );
    }

    function bindBehavior() {
        var sidebar = document.getElementById('dbSidebar');
        var mainWrap = document.querySelector('.db-main-wrap');
        var collapseBtn = document.getElementById('dbSidebarCollapseBtn');
        var drawerToggle = document.getElementById('dbDrawerToggle');
        var backdrop = document.getElementById('dbSidebarBackdrop');
        var COLLAPSE_KEY = 'maxdev-dashboard-sidebar-collapsed';

        if (localStorage.getItem(COLLAPSE_KEY) === '1') {
            sidebar.classList.add('collapsed');
            if (mainWrap) mainWrap.classList.add('sidebar-collapsed');
        }

        collapseBtn.addEventListener('click', function () {
            var collapsed = sidebar.classList.toggle('collapsed');
            if (mainWrap) mainWrap.classList.toggle('sidebar-collapsed', collapsed);
            localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
        });

        drawerToggle.addEventListener('click', function () {
            sidebar.classList.add('drawer-open');
            backdrop.classList.add('visible');
        });

        backdrop.addEventListener('click', function () {
            sidebar.classList.remove('drawer-open');
            backdrop.classList.remove('visible');
        });

        sidebar.querySelectorAll('.db-nav-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                btn.closest('.db-nav-item').classList.toggle('open');
            });
        });

        document.getElementById('dbThemeBtn') && ThemeToggle.bind(document.getElementById('dbThemeBtn'));
        document.getElementById('dbFullscreenBtn') && FullscreenToggle.bind(document.getElementById('dbFullscreenBtn'));

        document.getElementById('dbLogoutBtn').addEventListener('click', function () {
            Modal.confirm({ title: 'Log out?', message: 'You will need to sign in again to access the dashboard.', confirmLabel: 'Log Out', danger: true })
                .then(function (ok) {
                    if (ok) {
                        Auth.logout();
                        window.location.href = global.DB_BASE + 'login.html';
                    }
                });
        });
    }

    global.Shell = {
        init: function (options) {
            options = options || {};
            var profile = Store.get('profile') || { avatar: 'assets/images/avatar-placeholder.svg', name: 'Admin', designation: 'Administrator' };
            var sidebarMount = document.getElementById('shellSidebar');
            var headerMount = document.getElementById('shellHeader');
            if (sidebarMount) sidebarMount.outerHTML = sidebarHtml(options.active, profile);
            if (headerMount) headerMount.outerHTML = headerHtml();
            bindBehavior();
        },
        // Re-reads Store-backed badge counts (e.g. after a message is
        // marked read) without re-rendering/re-binding the whole sidebar.
        refreshBadges: function () {
            NAV.concat(NAV_BOTTOM).forEach(function (item) {
                if (!item.badge) return;
                var link = document.querySelector('.db-nav-item .db-nav-link[href$="' + item.href.split('?')[0] + '"]');
                if (!link) return;
                var existing = link.querySelector('.db-nav-badge');
                var html = badgeHtml(item);
                if (existing) existing.remove();
                if (html) link.insertAdjacentHTML('beforeend', html);
            });
        }
    };
})(window);
