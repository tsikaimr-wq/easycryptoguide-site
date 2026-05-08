(function () {
    var path = String(window.location.pathname || '').toLowerCase();
    var adminPaths = ['admin.html', 'admin_login.html', 'support_admin.html'];

    if (path.indexOf('maintenance.html') >= 0) return;

    for (var i = 0; i < adminPaths.length; i += 1) {
        if (path.indexOf(adminPaths[i]) >= 0) return;
    }

    window.location.replace('/maintenance.html');
})();
