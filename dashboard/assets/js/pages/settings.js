(function () {
    var TABS = ['account', 'mail', 'ai'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'account';

    Shell.init({ active: 'settings-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { account: 'Account', mail: 'Mail Configuration', ai: 'AI Assistant Configuration' };
        return '<a href="settings.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');
    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
    });

    // ---- Account ----
    var account = Store.get('account');
    document.getElementById('acCurrentEmail').value = account.email;

    function wireOtpRow(row) {
        var inputs = Array.prototype.slice.call(row.querySelectorAll('input'));
        inputs.forEach(function (input, i) {
            input.addEventListener('input', function () {
                input.value = input.value.replace(/[^0-9]/g, '').slice(0, 1);
                if (input.value && inputs[i + 1]) inputs[i + 1].focus();
            });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' && !input.value && inputs[i - 1]) inputs[i - 1].focus();
            });
        });
    }
    function otpRowValue(row) {
        return Array.prototype.slice.call(row.querySelectorAll('input')).map(function (i) { return i.value; }).join('');
    }
    var otpCurrentRow = document.getElementById('acOtpCurrent');
    var otpNewRow = document.getElementById('acOtpNew');
    wireOtpRow(otpCurrentRow);
    wireOtpRow(otpNewRow);

    var pendingNewEmail = '';

    document.getElementById('acSendCode').addEventListener('click', function () {
        var newEmail = document.getElementById('acNewEmail').value.trim();
        if (!newEmail) { Toast.show('Enter a new email address.', 'error'); return; }
        if (newEmail === account.email) { Toast.show('That is already your current email.', 'error'); return; }
        pendingNewEmail = newEmail;
        Toast.show('DEV MODE — a code was "sent" to your current email. Enter any 6 digits.', 'info');
        document.getElementById('acEmailStep1').style.display = 'none';
        document.getElementById('acEmailStep2').style.display = 'block';
        otpCurrentRow.querySelector('input').focus();
    });

    document.getElementById('acVerifyCurrent').addEventListener('click', function () {
        if (!/^\d{6}$/.test(otpRowValue(otpCurrentRow))) { Toast.show('Enter all 6 digits.', 'error'); return; }
        Toast.show('DEV MODE — a code was "sent" to your new email. Enter any 6 digits.', 'info');
        document.getElementById('acEmailStep2').style.display = 'none';
        document.getElementById('acEmailStep3').style.display = 'block';
        otpNewRow.querySelector('input').focus();
    });

    document.getElementById('acVerifyNew').addEventListener('click', function () {
        if (!/^\d{6}$/.test(otpRowValue(otpNewRow))) { Toast.show('Enter all 6 digits.', 'error'); return; }
        account.email = pendingNewEmail;
        Store.save('account', account);
        document.getElementById('acCurrentEmail').value = account.email;
        document.getElementById('acNewEmail').value = '';
        [otpCurrentRow, otpNewRow].forEach(function (row) {
            row.querySelectorAll('input').forEach(function (i) { i.value = ''; });
        });
        document.getElementById('acEmailStep3').style.display = 'none';
        document.getElementById('acEmailStep1').style.display = 'block';
        Toast.show('Email updated.', 'success');
    });

    document.getElementById('acSavePassword').addEventListener('click', function () {
        var oldPw = document.getElementById('acOldPassword').value;
        var newPw = document.getElementById('acNewPassword').value;
        var confirmPw = document.getElementById('acConfirmPassword').value;
        if (!oldPw) { Toast.show('Enter your current password.', 'error'); return; }
        if (oldPw !== account.password) { Toast.show('Old password is incorrect.', 'error'); return; }
        if (newPw.length < 6) { Toast.show('New password must be at least 6 characters.', 'error'); return; }
        if (newPw !== confirmPw) { Toast.show('New passwords do not match.', 'error'); return; }
        account.password = newPw;
        Store.save('account', account);
        document.getElementById('acOldPassword').value = '';
        document.getElementById('acNewPassword').value = '';
        document.getElementById('acConfirmPassword').value = '';
        Toast.show('Password updated.', 'success');
    });

    // ---- Mail ----
    var mail = Store.get('settingsMail');
    document.getElementById('mHost').value = mail.smtpHost;
    document.getElementById('mPort').value = mail.smtpPort;
    document.getElementById('mUser').value = mail.smtpUser;
    document.getElementById('mPass').value = mail.smtpPassword;
    document.getElementById('mFromAddress').value = mail.fromAddress;
    document.getElementById('mFromName').value = mail.fromName;
    document.getElementById('saveMail').addEventListener('click', function () {
        Store.save('settingsMail', {
            smtpHost: document.getElementById('mHost').value,
            smtpPort: Number(document.getElementById('mPort').value) || 0,
            smtpUser: document.getElementById('mUser').value,
            smtpPassword: document.getElementById('mPass').value,
            fromAddress: document.getElementById('mFromAddress').value,
            fromName: document.getElementById('mFromName').value
        });
        Toast.show('Mail settings saved.', 'success');
    });

    // ---- AI Assistant ----
    var ai = Store.get('settingsAi');
    document.getElementById('aName').value = ai.assistantName;
    document.getElementById('aDisplayName').value = ai.displayName;
    document.getElementById('aPersona').value = ai.persona;

    var kbFileName = ai.knowledgeBaseFileName || '';
    var kbUploader = Uploader.mount(document.getElementById('kbUploader'), { accept: '.json', onChange: function (dataUrl, file) { kbFileName = file ? file.name : ''; } });
    if (kbFileName) kbUploader.setValue('#', kbFileName);

    document.getElementById('saveAi').addEventListener('click', function () {
        Store.save('settingsAi', {
            assistantName: document.getElementById('aName').value,
            displayName: document.getElementById('aDisplayName').value,
            persona: document.getElementById('aPersona').value,
            knowledgeBaseFileName: kbFileName
        });
        Toast.show('AI Assistant settings saved.', 'success');
    });
})();
