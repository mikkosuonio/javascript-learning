"use strict;"

describe('withAdvice', function() {
    var object;

    beforeEach(function() {
        object = {
            method: function() {}
        };
    });

    describe('before', function() {
        describe('generic advice behavior', function() {
            verifyGenericAdviceBehavior('around');
        });
        describe('before or after advice behavior', function() {
            verifyBeforeOrAfterAdviceBehavior('before');
        });
        it('calls the advice function before the original method', function() {
            object.method = function() {
                calls.push('object.method');
            };
            function advice() {
                calls.push('advice');
            };

            withAdvice.call(object);
            object.before('method', advice);
            var calls = [];
            object.method();

            expect(calls).toEqual(['advice', 'object.method']);
        });
        it('calls multiple advice functions in reversed addition order', function() {
            function advice1() {
                calls.push('advice1');
            };
            function advice2() {
                calls.push('advice2');
            };

            withAdvice.call(object);
            object.before('method', advice1);
            object.before('method', advice2);
            var calls = [];
            object.method();

            expect(calls).toEqual(['advice2', 'advice1']);
        });
    });
    describe('after', function() {
        describe('generic advice behavior', function() {
            verifyGenericAdviceBehavior('around');
        });
        describe('before or after advice behavior', function() {
            verifyBeforeOrAfterAdviceBehavior('before');
        });
        it('calls the advice function after the original method', function() {
            object.method = function() {
                calls.push('object.method');
            };
            function advice() {
                calls.push('advice');
            };

            withAdvice.call(object);
            object.after('method', advice);
            var calls = [];
            object.method();

            expect(calls).toEqual(['object.method', 'advice']);
        });
        it('calls multiple advice functions in addition order', function() {
            function advice1() {
                calls.push('advice1');
            };
            function advice2() {
                calls.push('advice2');
            };

            withAdvice.call(object);
            object.after('method', advice1);
            object.after('method', advice2);
            var calls = [];
            object.method();

            expect(calls).toEqual(['advice1', 'advice2']);
        });
    });
    describe('around', function() {
        describe('generic advice behavior', function() {
            verifyGenericAdviceBehavior('around');
        });
        it('allows calling the original method', function() {
            object.method = function() {
                called = true;
            };
            function advice(target) {
                target.call(this);
            };

            withAdvice.call(object);
            object.around('method', advice);
            var called = false;
            object.method();

            expect(called).toEqual(true);
        });
        it('calls the advice function with correct parameters', function() {
            function advice(target, args) {
                argumentsForMethod = args;
            };

            withAdvice.call(object);
            object.around('method', advice);
            var argumentsForMethod = [];
            object.method(1,2);

            expect(argumentsForMethod).toEqual([1,2]);
        });
        it('adds the advice function even if the object does not have the method', function() {
            delete object.method;            
            function advice(target, args) {
                called = true;
                method = target;
                argumentsForMethod = args;
            };

            withAdvice.call(object);
            object.around('method', advice);
            var called = false;
            var method = {};
            var argumentsForMethod = [];
            object.method(1,2);

            expect(called).toEqual(true);
            expect(method).toBeUndefined();
            expect(argumentsForMethod).toEqual([1,2]);
        });
        it('calls multiple advice functions in reversed addition order', function() {
            function advice1(target) {
                calls.push('advice1');
                target.call(this);
            };
            function advice2(target) {
                calls.push('advice2');
                target.call(this);
            };

            withAdvice.call(object);
            object.around('method', advice1);
            object.around('method', advice2);
            var calls = [];
            object.method();

            expect(calls).toEqual(['advice2', 'advice1']);
        });
    });
    
    function verifyGenericAdviceBehavior(adviceType) {
        it('calls the advice function', function() {
            function advice() {
                called = true;
            };

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var called = false;
            object.method();

            expect(called).toEqual(true);
        });
        it('calls the advice function in correct context', function() {
            function advice() {
                context = this;
            };

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var context;
            object.method();

            expect(context).toBe(object);
        });
    };
    function verifyBeforeOrAfterAdviceBehavior(adviceType) {
        it('calls the advice function', function() {
            function advice() {
                called = true;
            };

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var called = false;
            object.method();

            expect(called).toEqual(true);
        });
        it('calls the original method', function() {
            object.method = function() {
                called = true;
            };
            function advice() {};

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var called = false;
            object.method();

            expect(called).toEqual(true);
        });
        it('calls the advice function with correct parameters', function() {
            function advice() {
                callParameters = arguments;
            };

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var callParameters = [];
            object.method(1,2);

            expect(callParameters).toEqual([1,2]);
        });
        it('calls the original method with correct parameters', function() {
            object.method = function() {
                callParameters = arguments;
            };
            function advice() {};

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var callParameters = [];
            object.method(1,2);

            expect(callParameters).toEqual([1,2]);
        });
        it('calls the advice function in correct context', function() {
            function advice() {
                context = this;
            };

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var context;
            object.method();

            expect(context).toBe(object);
        });
        it('calls the original method in correct context', function() {
            object.method = function() {
                context = this;
            };
            function advice() {};

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var context;
            object.method();

            expect(context).toBe(object);
        });
        it('adds the advice function even if the object does not have the method', function() {
            delete object.method;            
            function advice() {
                called = true;
            };

            withAdvice.call(object);
            object[adviceType]('method', advice);
            var called = false;
            object.method();

            expect(called).toEqual(true);
        });
    };
});

