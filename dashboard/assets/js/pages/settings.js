(function () {
    var TABS = ['mail', 'ai'];
    var params = new URLSearchParams(window.location.search);
    var activeTab = TABS.indexOf(params.get('tab')) !== -1 ? params.get('tab') : 'mail';

    Shell.init({ active: 'settings-' + activeTab });

    document.getElementById('tabStrip').innerHTML = TABS.map(function (t) {
        var labels = { mail: 'Mail Configuration', ai: 'AI Assistant Configuration' };
        return '<a href="settings.html?tab=' + t + '" class="' + (t === activeTab ? 'active' : '') + '">' + labels[t] + '</a>';
    }).join('');
    document.querySelectorAll('.db-tab-panel').forEach(function (panel) {
        panel.classList.toggle('active', panel.dataset.tab === activeTab);
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
