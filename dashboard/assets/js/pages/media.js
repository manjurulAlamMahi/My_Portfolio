(function () {
    Shell.init({ active: 'media' });

    var media = Store.get('media');
    var mediaGrid = document.getElementById('mediaGrid');
    var pendingUpload = null;

    var newMediaUploader = Uploader.mount(document.getElementById('newMediaUploader'), {
        accept: 'image/*',
        onChange: function (dataUrl, file) { pendingUpload = dataUrl ? { url: dataUrl, name: file.name } : null; }
    });

    document.getElementById('addMediaBtn').addEventListener('click', function () {
        if (!pendingUpload) { Toast.show('Choose an image to upload first.', 'error'); return; }
        var label = document.getElementById('newMediaLabel').value.trim() || pendingUpload.name;
        var tag = document.getElementById('newMediaTag').value;
        media.push({ id: 'media-' + Date.now(), url: pendingUpload.url, label: label, tag: tag });
        Store.save('media', media);
        pendingUpload = null;
        newMediaUploader.setValue(null);
        document.getElementById('newMediaLabel').value = '';
        renderGrid();
        Toast.show('Media added to library.', 'success');
    });

    function resolveUrl(url) {
        return url.indexOf('data:') === 0 ? url : DB_BASE + url;
    }

    function renderGrid() {
        mediaGrid.innerHTML = media.map(function (item) {
            return '<div class="db-media-card">' +
                '<div class="hover-actions">' +
                    '<button type="button" data-replace="' + item.id + '" aria-label="Replace"><i class="fa fa-refresh"></i></button>' +
                    '<button type="button" data-delete="' + item.id + '" aria-label="Delete"><i class="fa fa-trash"></i></button>' +
                '</div>' +
                '<input type="file" accept="image/*" data-replace-input="' + item.id + '">' +
                '<div class="thumb"><img src="' + resolveUrl(item.url) + '" alt="' + item.label + '"></div>' +
                '<div class="meta"><div class="label">' + item.label + '</div><span class="db-badge">' + item.tag + '</span></div>' +
            '</div>';
        }).join('');

        mediaGrid.querySelectorAll('[data-replace]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                mediaGrid.querySelector('[data-replace-input="' + btn.dataset.replace + '"]').click();
            });
        });
        mediaGrid.querySelectorAll('[data-replace-input]').forEach(function (input) {
            input.addEventListener('change', function () {
                var file = input.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function () {
                    var item = media.find(function (m) { return m.id === input.dataset.replaceInput; });
                    item.url = reader.result;
                    Store.save('media', media);
                    renderGrid();
                    Toast.show('Image replaced.', 'success');
                };
                reader.readAsDataURL(file);
            });
        });
        mediaGrid.querySelectorAll('[data-delete]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = media.find(function (m) { return m.id === btn.dataset.delete; });
                Modal.confirm({ title: 'Delete "' + item.label + '"?', message: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' })
                    .then(function (ok) {
                        if (!ok) return;
                        media = media.filter(function (m) { return m.id !== item.id; });
                        Store.save('media', media);
                        renderGrid();
                        Toast.show('Media deleted.', 'success');
                    });
            });
        });
    }
    renderGrid();
})();
