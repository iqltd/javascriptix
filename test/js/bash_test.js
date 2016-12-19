(function (t$) {
    "use strict";
    
    var j$, assertEquals, arrayEquals;
    
    t$.testSuites = t$.testSuites || [];
    
    
    j$ = window.j$;
    assertEquals = t$.assertEquals;
    arrayEquals = t$.simpleArrayEquals;
    
    t$.testSuites.push({
        name: "j$.bash.tokenize",
        tokenize_delimitedBySpace: function () {
            var found = ['a', 'bb', 'ccc'];
            assertEquals(found, j$.bash.tokenize('a bb ccc'), arrayEquals);
        },
        tokenize_delimitedBySpaces: function () {
            var found = ['a', 'bb'];
            assertEquals(found, j$.bash.tokenize(' a  bb '), arrayEquals);
        },
        tokenize_delimitedByAnyMetacharacter: function () {
            var found = ['1', '2', '3', '\n', '4', '|', '5', '&', '6', ';', '7', '(', '8', ')', '9', '<', '10', '>', '11' ];
            assertEquals(found, j$.bash.tokenize('1 2\t3\n4|5&6;7(8)9<10>11'), arrayEquals);
        },
        tokenize_delimitedByMultipleMetacharacters: function () {
            var found = ['1', '\n', '|', '&', ';', '(', ')', '<', '>', '2'];
            assertEquals(found, j$.bash.tokenize('1 \t\n|&;()<>2'), arrayEquals);
        },
        tokenize_singleQuotedDelimitedBySpace: function () {
            var found = ["'single quoted'", "' also single quoted   '"];
            assertEquals(found, j$.bash.tokenize("'single quoted' ' also single quoted   '"), arrayEquals);
        },
        tokenize_doubleQuotedDelimitedBySpace: function () {
            var found = ['"double quoted"', '" also double quoted   "'];
            assertEquals(found, j$.bash.tokenize('"double quoted" " also double quoted   "'), arrayEquals);
        },
        tokenize_doubleQuotedWithEscapedDoubleQuote: function () {
            var found = ['"double \\" quoted"'];
            assertEquals(found, j$.bash.tokenize('"double \\" quoted" '), arrayEquals);
        }
    });
    
}(window.t$ = window.t$ || {}));