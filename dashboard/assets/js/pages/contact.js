(function () {
    Shell.init({ active: 'contact' });

    var contact = Store.get('contact');
    document.getElementById('cLocation').value = contact.location;
    document.getElementById('cEmail').value = contact.email;
    document.getElementById('cSkype').value = contact.skype;
    document.getElementById('cFormEndpoint').value = contact.formEndpoint;

    document.getElementById('saveContact').addEventListener('click', function () {
        Store.save('contact', {
            location: document.getElementById('cLocation').value,
            email: document.getElementById('cEmail').value,
            skype: document.getElementById('cSkype').value,
            formEndpoint: document.getElementById('cFormEndpoint').value
        });
        Toast.show('Contact settings saved.', 'success');
    });
})();
