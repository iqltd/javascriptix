(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    let arrayEquals = t$.arrayEquals;
    let assertErrorThrown = t$.assertErrorThrown;

    let tokenize = j$.tokenize;

    let ts = {name: 'tokenize'};
    ts.tests = {
        tokenize_comments: function () {
            var found = '';
            assertEquals(found, tokenize('#a bb ccc').word);
        },
    };
    t$.testSuites.push(ts);

    

}(window.t$ = window.t$ || {}));
