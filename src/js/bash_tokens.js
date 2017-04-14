(function (j$) {

    class TokenType {
        constructor(canContain) {
            this.canContain = canContain;        
            this.starts = () => false;
            this.ends = () => true;
            this.adjustEnd = i => i;
        }

        embeddedDetected(text, index) {
            return this.canContain && this.canContain.find(token => token.starts(text, index));  
        }

        afterEmbedded(text, index) {
            return this.embeddedDetected(text, index).getEnd(text, index + 1);
        }

        getEnd(text, index) {
            while (index <= text.length) {
                if (this.ends(text, index)) {
                    return this.adjustEnd(index);
                }
                if (this.embeddedDetected(text, index)){
                    index = this.afterEmbedded(text, index);
                }
                index++;
            }
            return -1;
        }
    }

    class Token {
        constructor(text, startIndex, endIndex) {
            this.complete = startIndex < endIndex;
            this.word = text.slice(startIndex, endIndex);
            this.rest = text.slice(endIndex);
        }
    }

    let either = (...fcts) => (...args) => fcts.some(f => f.apply(null, args));
    let allTrue = (...fcts) => (...args) => fcts.every(f => f.apply(null, args));
    let not = f => (...args) => !f.apply(null, args);

    let matches = chars => (text, index) => chars.includes(text[index]); 
    let previous = f => (text, index) => f(text, index - 1);
    let inputEnded = (s, i) => s.length < i + 1;

    let comment = new TokenType();
    comment.starts = matches('#'); 
    comment.ends = either(matches('\n'), inputEnded);

    let whitespace = new TokenType();
    let isWhitespace = matches(' \t');
    whitespace.starts = isWhitespace;
    whitespace.ends = either(not(isWhitespace), inputEnded);
    whitespace.adjustEnd = i => i - 1;

    let singleQuoted = new TokenType();
    let isEscaped = previous(matches('\\'));
    singleQuoted.starts = allTrue(matches('\''), not(isEscaped));
    singleQuoted.ends = matches('\'');

    let doubleQuoted = new TokenType();
    doubleQuoted.starts = allTrue(matches('"'), not(isEscaped));
    doubleQuoted.ends = allTrue(matches('"'), not(isEscaped));

    let word = new TokenType([singleQuoted, doubleQuoted]);
    word.starts = not(isWhitespace);
    word.ends = either(inputEnded, allTrue(isWhitespace, not(isEscaped)));
    word.adjustEnd = i => i - 1;

    let findTokenStarting = function (text, i) {
        return [comment, whitespace, word]
            .find(token => token.starts(text, i));
    };

    let shouldBeSkipped = (token) => [comment, whitespace].includes(token);

    function extractWord(text, start) {
        if (start >= text.length) {
            return new Token(text, start, start);
        }    
        let token = findTokenStarting(text, start);
        let end = token.getEnd(text, start) + 1;
        if (shouldBeSkipped(token)) {
            return extractWord(text, end);
        } else {
            return new Token(text, start, end);    
        }
    }

    j$.tokenize = (text) => extractWord(text, 0);

}(window.j$ = window.j$ || {}));
