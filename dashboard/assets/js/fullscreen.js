(function (global) {
    global.FullscreenToggle = {
        bind: function (btn) {
            function syncIcon() {
                var icon = btn.querySelector('i');
                if (!icon) return;
                icon.className = document.fullscreenElement ? 'fa fa-compress' : 'fa fa-expand';
            }
            btn.addEventListener('click', function () {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen().catch(function () {});
                }
            });
            document.addEventListener('fullscreenchange', syncIcon);
            syncIcon();
        }
    };
})(window);
