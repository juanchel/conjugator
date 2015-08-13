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

// base kudasai te ba seems hearsay past neg pol poten pass cause iru nasai seems vol

function Modifier(flag, modFunc, desc, nextMod) {
    this.flag = flag;
    this.modFunc = modFunc;
    this.desc = desc;
    this.nextMod = nextMod; 
}

function Term(word, ruby, def) {
    this.word = word;
    this.ruby = ruby;
    this.def = def;
}

var NAIFORM = [
    new Modifier('kudasai', function(w) {
        return w + 'いでください';
    }, ['Negative', 'Please ~ください'], null),
    new Modifier('te', function(w) {
        return w + 'くて';
    }, ['Negative', 'て form'], null),
    new Modifier('ba', function(w) {
        return w + 'ければ';
    }, ['Negative', 'Conditional ~ば'], null),
    new Modifier('seems', function(w) {
        return w + 'さそう';
    }, ['Negative', 'Seems ~そう'], null),
    new Modifier('hearsay', function(w) {
        return w + 'いそう';
    }, ['Negative', 'Hearsay ~そう'], null),
]

var TEFORM = [
    new Modifier('base', function(w) {
        return w;
    }, ['て form'], null),
    new Modifier('kudasai', function(w) {
        return w + 'ください';
    }, ['Please ~ください'], null),
]

var ICHIVERB = [
    new Modifier('base', function(w) {
        return w;
    }, [], null),
    new Modifier('past', function(w) {
        return trimLast(w) + 'た';
    }, ['Past'], null),
    new Modifier('neg', function(w) {
        return trimLast(w) + 'ない';
    }, ['Negative'], null),
    new Modifier('neg past', function(w) {
        return trimLast(w) + 'なかった';
    }, ['Negative', 'Past'], null),
    new Modifier('pol', function(w) {
        return trimLast(w) + 'ます';
    }, ['Polite'], null),
    new Modifier('pol past', function(w) {
        return trimLast(w) + 'ました';
    }, ['Polite', 'Past'], null),
    new Modifier('pol neg', function(w) {
        return trimLast(w) + 'ません';
    }, ['Polite', 'Negative'], null),
    new Modifier('pol neg past', function(w) {
        return trimLast(w) + 'ませんでした';
    }, ['Polite', 'Negative', 'Past'], null),
]

var ICHIDAN = [
    new Modifier('base', function(w) {
        return w;
    }, [], ICHIVERB),
    new Modifier('te', function(w) {
        return trimLast(w) + 'て';
    }, [], TEFORM),
    new Modifier('neg', function(w) {
        return trimLast(w) + 'な';
    }, [], NAIFORM),
    new Modifier('poten', function(w) {
        return trimLast(w) + 'られる';
    }, ['Potential'], ICHIVERB),
    new Modifier('pass', function(w) {
        return trimLast(w) + 'られる';
    }, ['Passive'], ICHIVERB),
    new Modifier('cause', function(w) {
        return trimLast(w) + 'させる';
    }, ['Causitive'], ICHIVERB),
    new Modifier('pass cause', function(w) {
        return trimLast(w) + 'させられる';
    }, ['Causitive', 'Passive'], ICHIVERB),
    new Modifier('te iru', function(w) {
        return trimLast(w) + 'ている';
    }, ['Enduring ~ている'], ICHIVERB),
    new Modifier('nasai', function(w) {
        return trimLast(w) + 'なさい';
    }, ['Request ~なさい'], null),
    new Modifier('hearsay', function(w) {
        return w + 'そう';
    }, ['Hearsay ~そう'], null),
    new Modifier('seems', function(w) {
        return trimLast(w) + 'そう';
    }, ['Seems like ~そう'], null),
    new Modifier('vol', function(w) {
        return trimLast(w) + 'よう';
    }, ['Volitional'], null),
    new Modifier('pol vol', function(w) {
        return trimLast(w) + 'ましょう';
    }, ['Polite', 'Volitional'], null),
    new Modifier('ba', function(w) {
        return trimLast(w) + 'れば';
    }, ['Conditional ~ば'], null),
]

var ichidan = [
    new Term('たべる', '<ruby>食<rt>た</rt></ruby>べる</span>', 'to eat'),
    new Term('ねる', '<ruby>寝<rt>ね</rt></ruby>る', 'to sleep; to lie down'),
    new Term('しんじる', '<ruby>信<rt>しん</rt></ruby>じる', 'to believe'),
    new Term('おきる', '<ruby>起<rt>お</rt></ruby>きる', 'to wake up; to occur'),
    new Term('きる', '<ruby>着<rt>き</rt></ruby>る', 'to wear'),
    new Term('でる', '<ruby>出<rt>で</rt></ruby>る', 'to leave; to come out'),
    new Term('かける', '<ruby>掛<rt>か</rt></ruby>ける', 'to hang'),
]