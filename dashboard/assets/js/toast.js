(function (global) {
    function ensureStack() {
        var stack = document.querySelector('.db-toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.className = 'db-toast-stack';
            document.body.appendChild(stack);
        }
        return stack;
    }

    global.Toast = {
        show: function (message, type) {
            var stack = ensureStack();
            var el = document.createElement('div');
            el.className = 'db-toast' + (type ? ' ' + type : '');
            el.textContent = message;
            stack.appendChild(el);
            setTimeout(function () {
                el.style.opacity = '0';
                el.style.transition = 'opacity 0.2s ease';
                setTimeout(function () { el.remove(); }, 200);
            }, 3500);
        }
    };
})(window);
