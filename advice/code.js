// References:
// https://speakerdeck.com/u/anguscroll/p/how-we-learned-to-stop-worrying-and-love-javascript
// https://gist.github.com/2864853

"use strict;"

function withAdvice() {
    this.before = function(method, advice) {
        var original = this[method];
        if (original)
            this[method] = function() {
                advice.apply(this, arguments);
                original.apply(this, arguments);
            };
        else
            this[method] = advice;
    };
    this.after = function(method, advice) {
        var original = this[method];
        if (original)
            this[method] = function() {
                original.apply(this, arguments);
                advice.apply(this, arguments);
            };
        else
            this[method] = advice;
    };
    this.around = function(method, advice) {
        var original = this[method];
        this[method] = function() {
            advice.call(this, original, arguments);
        };
    };
};

