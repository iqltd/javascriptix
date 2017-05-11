define(function () {
    
    function simpleEquals(o1, o2) {
        return o1 === o2;
    }

    function assertTrue(condition) {
        if (!condition) {
            throw new Error('Assertion failed. Condition not true.');
        }
    }

    function assertDefined(o) {
        if (o == undefined || o == null) {
            throw new Error('Assertion failed. Object undefined or null');
        }
    }

    function assertEquals(obj1, obj2, equals = simpleEquals) {
        if (!equals(obj1, obj2)) {
            throw new Error(`Assertion failed. Expected [${obj1}] not equal to [${obj2}]`);
        }
    }

    function arrayEquals(arr1, arr2, equals = simpleEquals) {
        if (arr1 === arr2) {
            return true;
        }
        if (!arr1 || !arr2 || arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (!equals(arr1[i], arr2[i])) {
                return false;
            }
        }
        return true;
    }

    function assertErrorThrown(func, args) {
        let errorId = Symbol();
        try {
            func.call(null, args);
            throw errorId;
        } catch (e) {
            if (e === errorId) {
                throw new Error('Assertion failed. No error was thrown.');
            }
        }
    }

    return {
        assertTrue, 
        assertDefined, 
        assertEquals, 
        arrayEquals,
        assertErrorThrown,
    };
});