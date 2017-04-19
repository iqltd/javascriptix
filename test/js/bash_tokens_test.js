(function (t$) {
    t$.testSuites = t$.testSuites || [];

    let j$ = window.j$;
    let assertEquals = t$.assertEquals;
    let sys = t$.initSystem();
    let bash = new j$.__Bash(sys);

    let tokenize = text => bash.tokenize(text).word;

    let ts = {name: 'tokenize'};
    ts.tests = {
        tokenize_comments_alone: function () {
            var found = '';
            assertEquals(found, tokenize('#aaa bb\tc'));
            assertEquals(found, tokenize('   #aaa bb\tc'));
            assertEquals(found, tokenize('\t #aaa bb\tc'));
            assertEquals(found, tokenize(' \t#aaa bb\tc'));
            assertEquals(found, tokenize('#'));
            assertEquals(found, tokenize('#####'));
            assertEquals(found, tokenize('#"aaa"\'bb\'"\'\\"\\'));
        },
        tokenize_comments_only: function () {
            assertEquals('\n', tokenize('#comment\n'));
        },
        tokenize_spaces_only: function () {
            assertEquals('', tokenize('  \t\t\t\t    \t '));
        },
        tokenize_doubleQuotes_alone: function () {
            var found = '"aaa bb c"';
            assertEquals(found, tokenize('"aaa bb c"'));
            assertEquals(found, tokenize('   "aaa bb c"'));
            assertEquals(found, tokenize('\t "aaa bb c"'));
            assertEquals(found, tokenize(' \t"aaa bb c"'));
        },
        tokenize_doubleQuotes_followedBySpace: function () {
            var found = '"a"';
            assertEquals(found, tokenize('"a" '));
            assertEquals(found, tokenize('"a"\t'));
        },
        tokenize_doubleQuotes_followedByDoubleQuotes: function () {
            assertEquals('"a""b"', tokenize('"a""b"'));
        },
        tokenize_doubleQuotes_followedBySingleQuotes: function () {
            assertEquals('"a"\'b\'', tokenize('"a"\'b\''));
        },
        tokenize_doubleQuotes_followedByWord: function () {
            assertEquals('"a"b', tokenize('"a"b'));
        },
        tokenize_doubleQuotes_followedByMeta: function () {
            assertEquals('"a"', tokenize('"a">'));
        },
        tokenize_singleQuotes_alone: function () {
            var found = '\'aaa bb c\'';
            assertEquals(found, tokenize('\'aaa bb c\''));
            assertEquals(found, tokenize('   \'aaa bb c\''));
            assertEquals(found, tokenize('\t \'aaa bb c\''));
            assertEquals(found, tokenize(' \t\'aaa bb c\''));
        },
        tokenize_singleQuotes_followedBySpace: function () {
            var found = '\'a\'';
            assertEquals(found, tokenize('\'a\' '));
            assertEquals(found, tokenize('\'a\'\t'));
        },
        tokenize_singleQuotes_followedByDoubleQuotes: function () {
            assertEquals('\'a\'"b"', tokenize('\'a\'"b"'));
        },
        tokenize_singleQuotes_followedBySingleQuotes: function () {
            assertEquals('\'a\'\'b\'', tokenize('\'a\'\'b\''));
        },
        tokenize_singleQuotes_followedByWord: function () {
            assertEquals('\'a\'b', tokenize('\'a\'b'));
        },
        tokenize_singleQuotes_followedByMeta: function () {
            assertEquals('\'a\'', tokenize('\'a\'<'));
        },
        tokenize_word_alone: function () {
            var found = 'aaa';
            assertEquals(found, tokenize('aaa'));
            assertEquals(found, tokenize('   aaa'));
            assertEquals(found, tokenize('\t aaa'));
            assertEquals(found, tokenize(' \taaa'));
        },
        tokenize_word_followedBySpace: function () {
            var found = 'a';
            assertEquals(found, tokenize('a '));
            assertEquals(found, tokenize('a\t'));
        },
        tokenize_word_followedByDoubleQuotes: function () {
            assertEquals('a"b"', tokenize('a"b"'));
        },
        tokenize_word_followedBySingleQuotes: function () {
            assertEquals('a\'b\'', tokenize('a\'b\''));
        },
        tokenize_escapedCommentIsNoComment: function () {
            assertEquals('\\#comment', tokenize('\\#comment'));
        },
        tokenize_escapedWhitespaceIsNoWhitespace: function () {
            assertEquals('a\\ b', tokenize('a\\ b'));
            assertEquals('a\\\tb', tokenize('a\\\tb'));
        },
        tokenize_escapedMetaIsNoMeta: function () {
            assertEquals('a\\(b\\)', tokenize('a\\(b\\)'));
        },
        // tokenize_incompleteQuoting: function () {
        //     assertEquals('', tokenize('a"incomplete'));
        // },

    };
    t$.testSuites.push(ts);

    

}(window.t$ = window.t$ || {}));
