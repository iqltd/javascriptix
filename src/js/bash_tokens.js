
function either(...fcts) {
    return (...args) => fcts.some(f => f.apply(null, args));
}

function allTrue(...fcts) {
    return (...args) => fcts.every(f => f.apply(null, args));
}

function not(f) {
    return (...args) => !f.apply(null, args);
}

let Token = function(start, end) {
    this.start = start;
    this.end = end;
    this.startFrom = 0;
    this.allowed = null;
};

let inputEnds = (s, i) => s.length <= i + 1;
let commentStarts = (s, i) => s[i] === '#';
let commentEnds = (s, i) => s[i] === '\n';
let comment = new Token(commentStarts, either(commentEnds, inputEnds));

let isEscaped = (s, i) => s[i-1] === '\\';
let isSingleQuote = (s, i) => s[i] === '\'';
let singleQuoted = new Token(allTrue(isSingleQuote, not(isEscaped)), isSingleQuote);
singleQuoted.startFrom = 1;

let isDoubleQuote = (s, i) => s[i] === '"';
let isValidDoubleQuote = allTrue(isDoubleQuote, not(isEscaped));
let doubleQuoted = new Token(isValidDoubleQuote, isValidDoubleQuote);
doubleQuoted.startFrom = 1;

let isWhitespace = (s, i) => ' \t'.includes(s[i]);
let whitespaceEnds = (s, i) => !' \t'.includes(s[i+1]);
let whitespace = new Token(isWhitespace, either(whitespaceEnds, inputEnds));

let wordEnds = (s, i) => ' \t'.includes(s[i+1]);
let word = new Token(not(isWhitespace), either(inputEnds, wordEnds));
word.allowed = [singleQuoted, doubleQuoted];

function tokenize(text) {
    let allowed = [comment, singleQuoted, doubleQuoted, whitespace, word];
    let token = allowed.find(token => token.start(text, 0));
    let end = findEnd(text, token.startFrom, token);
    return [text.slice(0, end + 1), text.slice(end + 1)] ;
}

function findEnd(text, i, token) {
    if (!token) {
        return i - 1;
    }
    while (i < text.length) {
        if (token.end(text, i)) {
            return i;
        }
        if (token.allowed) {
            let newToken = token.allowed.find(newToken => newToken.start(text, i));
            i = findEnd(text, i+1, newToken); 
        }
        i++;
    }
}

let cases = [
    'a b',
    ' b',
    'b',
    'abcde',
    'abc"d"e',
    'abcd\'e\'',
    'abc#nocomment de',
    'abc #comment',
    '#comment, so it will be treated like a single word',
    '"double quoted"'
];

cases.forEach(tc => { 
    console.log(tc + ' -> '); 
    console.log(tokenize(tc)); 
});
