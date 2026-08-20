/*
* Uploader — custom drag-and-drop upload component (no Dropify: it's a
* stale jQuery plugin that clashes with this site's aesthetic). Reads files
* as data URLs so previews/persistence work purely client-side via Store.
*/
(function (global) {
    function isImageAccept(accept) {
        return !accept || accept.indexOf('image') !== -1;
    }

    function mount(container, options) {
        options = options || {};
        var accept = options.accept || 'image/*';
        var onChange = options.onChange || function () {};
        var state = { url: options.initialUrl || null, name: options.initialLabel || '' };

        container.classList.add('db-uploader');
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        container.appendChild(input);

        function render() {
            var existing = container.querySelector('.db-uploader-empty, .db-uploader-preview');
            if (existing) existing.remove();

            if (!state.url) {
                var empty = document.createElement('div');
                empty.className = 'db-uploader-empty';
                empty.innerHTML = '<i class="fa fa-cloud-upload"></i><div class="hint"><strong>Click to upload</strong> or drag and drop</div>';
                empty.addEventListener('click', function () { input.click(); });
                container.appendChild(empty);
            } else {
                var preview = document.createElement('div');
                preview.className = 'db-uploader-preview';
                var thumbHtml = isImageAccept(accept)
                    ? '<img src="' + state.url + '" alt="">'
                    : '<i class="fa fa-file-text-o"></i>';
                preview.innerHTML =
                    '<div class="thumb">' + thumbHtml + '</div>' +
                    '<div class="meta">' +
                        '<div class="filename">' + (state.name || 'Uploaded file') + '</div>' +
                        '<div class="actions">' +
                            '<button type="button" class="db-pill-btn outline" data-role="replace">Replace</button>' +
                            '<button type="button" class="db-pill-btn danger" data-role="remove">Remove</button>' +
                        '</div>' +
                    '</div>';
                preview.querySelector('[data-role="replace"]').addEventListener('click', function () { input.click(); });
                preview.querySelector('[data-role="remove"]').addEventListener('click', function () {
                    state = { url: null, name: '' };
                    render();
                    onChange(null, null);
                });
                container.appendChild(preview);
            }
        }

        function handleFile(file) {
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function () {
                state = { url: reader.result, name: file.name };
                render();
                onChange(reader.result, file);
            };
            reader.readAsDataURL(file);
        }

        input.addEventListener('change', function () { handleFile(input.files[0]); });

        container.addEventListener('dragover', function (e) { e.preventDefault(); container.classList.add('dragover'); });
        container.addEventListener('dragleave', function () { container.classList.remove('dragover'); });
        container.addEventListener('drop', function (e) {
            e.preventDefault();
            container.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        });

        render();
        return {
            getValue: function () { return state; },
            setValue: function (url, name) { state = { url: url, name: name || '' }; render(); }
        };
    }

    global.Uploader = { mount: mount };
})(window);
