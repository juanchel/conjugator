// FIRST
// たべる -> VERB
// たべられる -> VERB
// たべさせる -> VERB
// たべさせられる -> VERB
// たべられる -> VERB

// たべて　-> TEFORM
// たべなさい
// たべそう
// たべるそう
// たべよう
// たべましょう
// たべな -> VERBNAI

// VERB
// たべる
// たべた
// たべない
// たべなかった
// たべます
// たべました
// たべません
// たべませんでした

// TEFORM
// たべてください

// VERBNAI
// たべないでください
// たべなくて
// たべなければ
// たべなさそう
// たべないそう

function Modifier(modFunc, desc, nextMod) {
    this.modFunc = modFunc;
    this.desc = desc;
    this.nextMod = nextMod; 
}

var NAIFORM = {
    'kudasai': new Modifier(function(w) {
        return w + 'いでください';
    }, ['Negative', 'Please ~ください'], null),
    'te': new Modifier(function(w) {
        return w + 'くて';
    }, ['Negative', 'て form'], null),
    'ba': new Modifier(function(w) {
        return w + 'ければ';
    }, ['Negative', 'Conditional ~ば'], null),
    'seems': new Modifier(function(w) {
        return w + 'さそう';
    }, ['Negative', 'Seems ~そう'], null),
    'hearsay': new Modifier(function(w) {
        return w + 'いそう';
    }, ['Negative', 'Hearsay ~そう'], null),
}

var TEFORM = {
    'base': new Modifier(function(w) {
        return w;
    }, ['て form'], null),
    'kudasai': new Modifier(function(w) {
        return w + 'ください';
    }, ['Please ~ください'], null),
}

var ICHIVERB = {
    'base': new Modifier(function(w) {
        return w;
    }, [], null),
    'past': new Modifier(function(w) {
        return trimLast(w) + 'た';
    }, ['Past'], null),
    'neg': new Modifier(function(w) {
        return trimLast(w) + 'ない';
    }, ['Negative'], null),
    'neg past': new Modifier(function(w) {
        return trimLast(w) + 'なかった';
    }, ['Negative', 'Past'], null),
    'pol': new Modifier(function(w) {
        return trimLast(w) + 'ます';
    }, ['Polite'], null),
    'pol past': new Modifier(function(w) {
        return trimLast(w) + 'ました';
    }, ['Polite', 'Past'], null),
    'pol neg': new Modifier(function(w) {
        return trimLast(w) + 'ません';
    }, ['Polite', 'Negative'], null),
    'pol neg past': new Modifier(function(w) {
        return trimLast(w) + 'ませんでした';
    }, ['Polite', 'Negative', 'Past'], null),
}

var ICHIDAN = {
    'base': new Modifier(function(w) {
        return w;
    }, [], ICHIVERB),
    'te': new Modifier(function(w) {
        return trimLast(w) + 'て';
    }, [], TEFORM),
    'neg': new Modifier(function(w) {
        return trimLast(w) + 'な';
    }, [], NAIFORM),
    'poten': new Modifier(function(w) {
        return trimLast(w) + 'られる';
    }, ['Potential'], ICHIVERB),
    'pass': new Modifier(function(w) {
        return trimLast(w) + 'られる';
    }, ['Passive'], ICHIVERB),
    'cause': new Modifier(function(w) {
        return trimLast(w) + 'させる';
    }, ['Causitive'], ICHIVERB),
    'pass cause': new Modifier(function(w) {
        return trimLast(w) + 'させられる';
    }, ['Causitive', 'Passive'], ICHIVERB),
    'te iru': new Modifier(function(w) {
        return trimLast(w) + 'ている';
    }, ['Enduring ~ている'], ICHIVERB),
    'nasai': new Modifier(function(w) {
        return trimLast(w) + 'なさい';
    }, ['Request ~なさい'], null),
    'hearsay': new Modifier(function(w) {
        return w + 'そう';
    }, ['Hearsay ~そう'], null),
    'seems': new Modifier(function(w) {
        return trimLast(w) + 'そう';
    }, ['Seems like ~そう'], null),
    'vol': new Modifier(function(w) {
        return trimLast(w) + 'よう';
    }, ['Volitional'], null),
    'pol vol': new Modifier(function(w) {
        return trimLast(w) + 'ましょう';
    }, ['Polite', 'Volitional'], null),
    'ba': new Modifier(function(w) {
        return trimLast(w) + 'れば';
    }, ['Conditional ~ば'], null),
}