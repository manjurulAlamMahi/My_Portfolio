(function (global) {
    var KEY = 'maxdev-theme';

    function isDark() {
        var saved = localStorage.getItem(KEY);
        if (saved) return saved === 'dark';
        return global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    var ThemeToggle = {
        apply: function () {
            document.documentElement.classList.toggle('dark-mode', isDark());
        },
        bind: function (btn) {
            function syncIcon() {
                var icon = btn.querySelector('i');
                if (!icon) return;
                var dark = document.documentElement.classList.contains('dark-mode');
                icon.className = dark ? 'fa fa-sun-o' : 'fa fa-moon-o';
            }
            syncIcon();
            btn.addEventListener('click', function () {
                var dark = !document.documentElement.classList.contains('dark-mode');
                document.documentElement.classList.toggle('dark-mode', dark);
                localStorage.setItem(KEY, dark ? 'dark' : 'light');
                syncIcon();
            });
        }
    };

    global.ThemeToggle = ThemeToggle;
})(window);
