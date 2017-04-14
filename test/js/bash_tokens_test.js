(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let j$ = window.j$;
    let assertEquals = t$.assertEquals;

    let tokenize = j$.tokenize;

    let ts = {name: 'tokenize'};
    ts.tests = {
        tokenize_comments_alone: function () {
            var found = '';
            assertEquals(found, tokenize('#aaa bb\tc').word);
            assertEquals(found, tokenize('   #aaa bb\tc').word);
            assertEquals(found, tokenize('\t #aaa bb\tc').word);
            assertEquals(found, tokenize(' \t#aaa bb\tc').word);
        },
        tokenize_comments_only: function () {
            var found = '';
            assertEquals(found, tokenize('#aaa bb\tc\n#"aaa"\'bb\'"\'\\"\\\n###\n#').word);
        },
        tokenize_spaces_only: function () {
            var found = '';
            assertEquals(found, tokenize('  \t\t\t\t    \t ').word);
        },
        tokenize_doubleQuotes_alone: function () {
            var found = '"aaa bb c"';
            assertEquals(found, tokenize('"aaa bb c"').word);
            assertEquals(found, tokenize('   "aaa bb c"').word);
            assertEquals(found, tokenize('\t "aaa bb c"').word);
            assertEquals(found, tokenize(' \t"aaa bb c"').word);
        },
        tokenize_doubleQuotes_followedBySpace: function () {
            var found = '"a"';
            assertEquals(found, tokenize('"a" ').word);
            assertEquals(found, tokenize('"a"\t').word);
        },
        tokenize_doubleQuotes_followedByDoubleQuotes: function () {
            var found = '"a""b"';
            assertEquals(found, tokenize('"a""b"').word);
        },
        tokenize_doubleQuotes_followedBySingleQuotes: function () {
            var found = '"a"\'b\'';
            assertEquals(found, tokenize('"a"\'b\'').word);
        },
        tokenize_doubleQuotes_followedByWord: function () {
            var found = '"a"b';
            assertEquals(found, tokenize('"a"b').word);
        },
        tokenize_singleQuotes_alone: function () {
            var found = '\'aaa bb c\'';
            assertEquals(found, tokenize('\'aaa bb c\'').word);
            assertEquals(found, tokenize('   \'aaa bb c\'').word);
            assertEquals(found, tokenize('\t \'aaa bb c\'').word);
            assertEquals(found, tokenize(' \t\'aaa bb c\'').word);
        },
        tokenize_singleQuotes_followedBySpace: function () {
            var found = '\'a\'';
            assertEquals(found, tokenize('\'a\' ').word);
            assertEquals(found, tokenize('\'a\'\t').word);
        },
        tokenize_singleQuotes_followedByDoubleQuotes: function () {
            var found = '\'a\'"b"';
            assertEquals(found, tokenize('\'a\'"b"').word);
        },
        tokenize_singleQuotes_followedBySingleQuotes: function () {
            var found = '\'a\'\'b\'';
            assertEquals(found, tokenize('\'a\'\'b\'').word);
        },
        tokenize_singleQuotes_followedByWord: function () {
            var found = '\'a\'b';
            assertEquals(found, tokenize('\'a\'b').word);
        },
        tokenize_word_alone: function () {
            var found = 'aaa';
            assertEquals(found, tokenize('aaa').word);
            assertEquals(found, tokenize('   aaa').word);
            assertEquals(found, tokenize('\t aaa').word);
            assertEquals(found, tokenize(' \taaa').word);
        },
        tokenize_word_followedBySpace: function () {
            var found = 'a';
            assertEquals(found, tokenize('a ').word);
            assertEquals(found, tokenize('a\t').word);
        },
        tokenize_word_followedByDoubleQuotes: function () {
            var found = 'a"b"';
            assertEquals(found, tokenize('a"b"').word);
        },
        tokenize_word_followedBySingleQuotes: function () {
            var found = 'a\'b\'';
            assertEquals(found, tokenize('a\'b\'').word);
        },
        tokenize_escapedWhitespaceShouldBeTreatedLikeNonWhitespace: function () {
            var found = 'a\\ b\\\tc';
            assertEquals(found, tokenize('a\\ b\\\tc').word);
        },

    };
    t$.testSuites.push(ts);

    

}(window.t$ = window.t$ || {}));
