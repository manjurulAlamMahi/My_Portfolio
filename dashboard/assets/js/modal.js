(function (global) {
    global.Modal = {
        confirm: function (options) {
            options = options || {};
            return new Promise(function (resolve) {
                var overlay = document.createElement('div');
                overlay.className = 'db-modal-overlay visible';
                overlay.innerHTML =
                    '<div class="db-modal" role="dialog" aria-modal="true">' +
                        '<h3>' + (options.title || 'Are you sure?') + '</h3>' +
                        '<p>' + (options.message || 'This action cannot be undone.') + '</p>' +
                        '<div class="db-modal-actions">' +
                            '<button type="button" class="db-pill-btn outline" data-role="cancel">' + (options.cancelLabel || 'Cancel') + '</button>' +
                            '<button type="button" class="db-pill-btn ' + (options.danger ? 'danger' : 'accent') + '" data-role="confirm">' + (options.confirmLabel || 'Confirm') + '</button>' +
                        '</div>' +
                    '</div>';

                function close(result) {
                    overlay.remove();
                    resolve(result);
                }

                overlay.addEventListener('click', function (e) {
                    if (e.target === overlay) close(false);
                });
                overlay.querySelector('[data-role="cancel"]').addEventListener('click', function () { close(false); });
                overlay.querySelector('[data-role="confirm"]').addEventListener('click', function () { close(true); });

                document.body.appendChild(overlay);
            });
        }
    };
})(window);
