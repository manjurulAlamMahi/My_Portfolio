(function () {
    Shell.init({ active: 'resume-education' });

    var education = Store.get('education');
    var eduGrid = document.getElementById('eduGrid');

    function render() {
        eduGrid.innerHTML = education.map(function (e, i) {
            return '<div class="db-card" style="text-align:center;">' +
                '<i class="fa fa-graduation-cap" style="font-size:24px;color:var(--db-accent);margin-bottom:12px;display:block;"></i>' +
                '<input class="db-input" style="margin-bottom:8px;text-align:center;" data-edu="' + i + '" data-field="title" value="' + e.title + '">' +
                '<input class="db-input" style="text-align:center;" data-edu="' + i + '" data-field="institution" value="' + e.institution + '">' +
                '<button type="button" class="db-pill-btn danger" data-remove="' + i + '" style="margin-top:14px;width:100%;justify-content:center;"><i class="fa fa-trash"></i> Remove</button>' +
            '</div>';
        }).join('');
        eduGrid.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { education.splice(Number(btn.dataset.remove), 1); render(); });
        });
    }
    render();

    document.getElementById('addEdu').addEventListener('click', function () {
        education.push({ id: 'edu-' + Date.now(), title: 'New Credential', institution: '' });
        render();
    });

    document.getElementById('saveEdu').addEventListener('click', function () {
        eduGrid.querySelectorAll('input').forEach(function (input) {
            education[Number(input.dataset.edu)][input.dataset.field] = input.value;
        });
        Store.save('education', education);
        Toast.show('Education saved.', 'success');
    });
})();
