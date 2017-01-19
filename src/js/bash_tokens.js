
class Event {
    constructor(pattern, process) {
        this.pattern = pattern;
        this.process = process;
    }

    matches(text, index) {
        return this.pattern.includes(text[index]);
    }
}

let firstSingleQuote = new Event('\'');
let secondSingleQuote = new Event('\'');
let firstDoubleQuote = new Event('"');
let secondDoubleQuote = new Event('"');
let whiteSpace = new Event(' \t');
let newline = new Event('\n');
let comment = new Event('#');
let endOfComment = new Event('\n');
let escape = new Event('\\');

let allExceptComments = [firstSingleQuote, firstDoubleQuote, whiteSpace, newline, escape];
let all = allExceptComments.slice();
all.push(comment);

firstSingleQuote.allowed = [secondSingleQuote];
secondSingleQuote.allowed = allExceptComments;

firstDoubleQuote.allowed = [secondDoubleQuote];
secondDoubleQuote.allowed = allExceptComments;

whiteSpace.allowed = all;
newline.allowed = all;

comment.allowed = [endOfComment];
endOfComment.allowed = [all];

function doMe(text) {
    let i = 0, allowed = all;
    while (i < text.length) {
        for (let event of allowed) {
            if (event.matches(text, i)) {
                console.log(`Found char matching ${event.pattern} at position ${i}`);
                allowed = event.allowed;
                break;
            }
        }

        i++;
    }
}

doMe('012345 "xxxxxxx" #  aaa\n');

