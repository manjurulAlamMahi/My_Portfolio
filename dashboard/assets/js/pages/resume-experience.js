(function () {
    Shell.init({ active: 'resume-experience' });

    var experience = Store.get('experience');
    var expList = document.getElementById('expList');

    function render() {
        expList.innerHTML = experience.map(function (e, i) {
            return '<div class="db-timeline-editor-item">' +
                '<div class="db-form-row">' +
                    '<div class="db-form-group"><label>Date Range</label><input class="db-input" data-exp="' + i + '" data-field="dateRange" value="' + e.dateRange + '"></div>' +
                    '<div class="db-form-group"><label>Title</label><input class="db-input" data-exp="' + i + '" data-field="title" value="' + e.title + '"></div>' +
                    '<div class="db-form-group"><label>Company</label><input class="db-input" data-exp="' + i + '" data-field="company" value="' + e.company + '"></div>' +
                '</div>' +
                '<div class="db-form-group"><label>Description</label><textarea class="db-textarea" data-exp="' + i + '" data-field="description">' + e.description + '</textarea></div>' +
                '<div class="reorder">' +
                    '<button type="button" class="db-pill-btn outline" data-move-up="' + i + '"' + (i === 0 ? ' disabled' : '') + '><i class="fa fa-arrow-up"></i></button>' +
                    '<button type="button" class="db-pill-btn outline" data-move-down="' + i + '"' + (i === experience.length - 1 ? ' disabled' : '') + '><i class="fa fa-arrow-down"></i></button>' +
                    '<button type="button" class="db-pill-btn danger" data-remove="' + i + '"><i class="fa fa-trash"></i> Remove</button>' +
                '</div>' +
            '</div>';
        }).join('');

        expList.querySelectorAll('[data-move-up]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var i = Number(btn.dataset.moveUp);
                var tmp = experience[i - 1]; experience[i - 1] = experience[i]; experience[i] = tmp;
                render();
            });
        });
        expList.querySelectorAll('[data-move-down]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var i = Number(btn.dataset.moveDown);
                var tmp = experience[i + 1]; experience[i + 1] = experience[i]; experience[i] = tmp;
                render();
            });
        });
        expList.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                experience.splice(Number(btn.dataset.remove), 1);
                render();
            });
        });
    }
    render();

    document.getElementById('addExp').addEventListener('click', function () {
        experience.unshift({ id: 'exp-' + Date.now(), dateRange: '', title: 'New Role', company: '', description: '' });
        render();
    });

    document.getElementById('saveExp').addEventListener('click', function () {
        expList.querySelectorAll('input, textarea').forEach(function (field) {
            experience[Number(field.dataset.exp)][field.dataset.field] = field.value;
        });
        Store.save('experience', experience);
        Toast.show('Experience saved.', 'success');
    });
})();
