(function () {
    Shell.init({ active: 'resume-skills' });

    var skills = Store.get('skills');
    var categoriesEl = document.getElementById('skillCategories');

    function renderCategories() {
        categoriesEl.innerHTML = skills.map(function (cat, ci) {
            var rows = cat.items.map(function (item, ii) {
                return '<div class="db-skill-row">' +
                    '<input type="text" class="db-input" data-cat="' + ci + '" data-item="' + ii + '" data-field="name" value="' + item.name + '">' +
                    '<input type="range" min="0" max="100" data-cat="' + ci + '" data-item="' + ii + '" data-field="level" value="' + item.level + '">' +
                    '<span class="pct">' + item.level + '%</span>' +
                    '<button type="button" class="db-pill-btn danger" data-remove-item="' + ci + ':' + ii + '"><i class="fa fa-trash"></i></button>' +
                '</div>';
            }).join('');
            return '<div class="db-skill-category">' +
                '<h4><input class="db-input" style="display:inline-block;width:auto;font-weight:500;" data-cat-name="' + ci + '" value="' + cat.category + '"> <button type="button" class="db-pill-btn outline" data-add-item="' + ci + '" style="float:right;font-size:11px;padding:6px 12px;"><i class="fa fa-plus"></i> Skill</button></h4>' +
                rows +
            '</div>';
        }).join('');

        categoriesEl.querySelectorAll('input[type="range"]').forEach(function (range) {
            range.addEventListener('input', function () {
                range.nextElementSibling.textContent = range.value + '%';
            });
        });
        categoriesEl.querySelectorAll('[data-remove-item]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var parts = btn.dataset.removeItem.split(':');
                skills[Number(parts[0])].items.splice(Number(parts[1]), 1);
                renderCategories();
            });
        });
        categoriesEl.querySelectorAll('[data-add-item]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                skills[Number(btn.dataset.addItem)].items.push({ name: 'New Skill', level: 50 });
                renderCategories();
            });
        });
    }
    renderCategories();

    document.getElementById('addCategory').addEventListener('click', function () {
        skills.push({ category: 'New Category', items: [] });
        renderCategories();
    });

    document.getElementById('saveSkills').addEventListener('click', function () {
        categoriesEl.querySelectorAll('[data-cat-name]').forEach(function (input) {
            skills[Number(input.dataset.catName)].category = input.value;
        });
        categoriesEl.querySelectorAll('[data-field="name"]').forEach(function (input) {
            skills[Number(input.dataset.cat)].items[Number(input.dataset.item)].name = input.value;
        });
        categoriesEl.querySelectorAll('[data-field="level"]').forEach(function (input) {
            skills[Number(input.dataset.cat)].items[Number(input.dataset.item)].level = Number(input.value);
        });
        Store.save('skills', skills);
        Toast.show('Technical skills saved.', 'success');
    });

    // ---- Soft skills ----
    var softSkills = Store.get('softSkills');
    var softGrid = document.getElementById('softSkillsGrid');
    function renderSoftSkills() {
        softGrid.innerHTML = softSkills.map(function (s, i) {
            return '<div class="db-softskill-card">' +
                '<button type="button" class="db-pill-btn danger remove-btn db-remove-x" data-remove="' + i + '" aria-label="Remove soft skill"><i class="fa fa-times"></i></button>' +
                '<i class="fa ' + s.icon + ' icon"></i>' +
                '<input class="db-input" style="margin-bottom:6px;" data-soft="' + i + '" data-field="name" value="' + s.name + '">' +
                '<textarea class="db-textarea" style="min-height:60px;" data-soft="' + i + '" data-field="note">' + s.note + '</textarea>' +
            '</div>';
        }).join('');
        softGrid.querySelectorAll('[data-remove]').forEach(function (btn) {
            btn.addEventListener('click', function () { softSkills.splice(Number(btn.dataset.remove), 1); renderSoftSkills(); });
        });
    }
    renderSoftSkills();
    document.getElementById('addSoftSkill').addEventListener('click', function () {
        softSkills.push({ name: 'New Skill', icon: 'fa-star-o', note: '' });
        renderSoftSkills();
    });
    document.getElementById('saveSoftSkills').addEventListener('click', function () {
        softGrid.querySelectorAll('input, textarea').forEach(function (field) {
            softSkills[Number(field.dataset.soft)][field.dataset.field] = field.value;
        });
        Store.save('softSkills', softSkills);
        Toast.show('Soft skills saved.', 'success');
    });
})();
