(function () {
    Shell.init({ active: 'contact' });

    var contact = Store.get('contact');
    document.getElementById('cLocation').value = contact.location;
    document.getElementById('cEmail').value = contact.email;
    document.getElementById('cWhatsapp').value = contact.whatsapp || '';
    document.getElementById('cPhone').value = contact.phone || '';

    document.getElementById('saveContact').addEventListener('click', function () {
        Store.save('contact', {
            location: document.getElementById('cLocation').value,
            email: document.getElementById('cEmail').value,
            whatsapp: document.getElementById('cWhatsapp').value,
            phone: document.getElementById('cPhone').value
        });
        Toast.show('Contact settings saved.', 'success');
    });
})();
