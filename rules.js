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

// base te ba seems hearsay kudasai past neg past pol cause pass poten iru vol polvol negba negte neghearsay negseems neghearsay

function Modifier(flag, modFunc, desc, nextMod) {
    this.flag = flag;
    this.modFunc = modFunc;
    this.desc = desc;
    this.nextMod = nextMod;
}

function Term(word, kanji, def) {
    this.word = word;
    this.ruby = addFurigana(kanji || word, word);
    this.def = def;
}

var NAIFORM = [
    new Modifier('kudasai', function(w) {
        return w + 'いでください';
    }, ['Negative', 'Please ~ください'], null),
    new Modifier('negte', function(w) {
        return w + 'くて';
    }, ['Negative', 'て form'], null),
    new Modifier('negba', function(w) {
        return w + 'ければ';
    }, ['Negative', 'Conditional ~ば'], null),
    new Modifier('negseems', function(w) {
        return w + 'さそう';
    }, ['Negative', 'Seems ~そう'], null),
    new Modifier('neghearsay', function(w) {
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
    new Modifier('negpolvol', function(w) {
        return trimLast(w) + 'ますまい';
    }, ['Polite', 'Volitional', 'Negative'], null),
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
    new Modifier('negvol', function(w) {
        return w + 'まい';
    }, ['Volitional', 'Negative'], null),
    new Modifier('vol', function(w) {
        return trimLast(w) + 'ましょう';
    }, ['Volitional'], null),
    new Modifier('polvol', function(w) {
        return trimLast(w) + 'ましょう';
    }, ['Polite', 'Volitional'], null),
    new Modifier('ba', function(w) {
        return trimLast(w) + 'れば';
    }, ['Conditional ~ば'], null),
]

var ichidan = [
    new Term('おきる', '起きる', 'to wake up; to occur'),
    new Term('でる', '出る', 'to leave; to come out'),
    new Term('くわえる', '加える', 'to add to, include'),
    new Term('みとめる', '認める', 'to admit, recognize'),
    new Term('こたえる', '答える', 'to answer'),
    new Term('さける', '避ける', 'to avoid, dodge'),
    new Term('きんじる', '禁じる', 'to ban, prohibit'),
    new Term('あびる', '浴びる', 'to bathe, take a shower'),
    new Term('いる', '居る', 'to be'),
    new Term('できる', '来る', 'to be able'),
    new Term('いきる', '生きる', 'to be alive'),
    new Term('きこえる', '聞こえる', 'to be audible, able to hear'),
    new Term('うまれる', '生まれる', 'to be born'),
    new Term('おれる', '折れる', 'to be broken, snap'),
    new Term('こげる', '焦げる', 'to be burned, charred'),
    new Term('まける', '負ける', 'to be defeated, lose a game'),
    new Term('たりる', '足りる', 'to be enough, suffient'),
    new Term('おくれる', '遅れる', 'to be late, lag behind'),
    new Term('なまける', '怠ける', 'to be lazy'),
    new Term('もてる', null, 'to be popular'),
    new Term('みえる', '見える', 'to be visible, able to see'),
    new Term('ぬれる', '濡れる', 'to become wet'),
    new Term('はじめる', '始める', 'to begin'),
    new Term('しんじる', '信じる', 'to believe, trust'),
    new Term('まげる', '曲げる', 'to bend, twist'),
    new Term('かりる', '借りる', 'to borrow, rent'),
    new Term('こわれる', '壊れる', 'to break'),
    new Term('きれる', '切れる', 'to break, cut off, expire'),
    new Term('そだてる', '育てる', 'to bring up a child, train'),
    new Term('たてる', '立てる', 'to build'),
    new Term('やける', '焼ける', 'to burn'),
    new Term('かえる', '変える', 'to change'),
    new Term('しらべる', '調べる', 'to check, investigate'),
    new Term('はれる', '晴れる', 'to clear up, tidy up'),
    new Term('くずれる', '崩れる', 'to collapse, cave in'),
    new Term('とれる', '取れる', 'to come off'),
    new Term('はずれる', '外れる', 'to come off, go wide'),
    new Term('ほどける', '解ける', 'to come untied, loose'),
    new Term('なぐさめる', '慰める', 'to comfort, console'),
    new Term('いいつける', '言いつける', 'to command'),
    new Term('くらべる', '比べる', 'to compare'),
    new Term('つづける', '続ける', 'to continue, proceed'),
    new Term('かぞえる', '数える', 'to count'),
    new Term('きめる', '決める', 'to decide, choose'),
    new Term('さだめる', '定める', 'to decide, establish'),
    new Term('たべる', '食べる', 'to eat'),
    new Term('すぐれる', '優れる', 'to excel, be excellent, be superior'),
    new Term('とりかえる', '取り換える', 'to exchange'),
    new Term('たおれる', '倒れる', 'to fall down, collapse'),
    new Term('ほれる', '惚れる', 'to fall in love'),
    new Term('おちる', '落ちる', 'to fall, fail, go down'),
    new Term('おそれる', '恐れる', 'to fear, be in awe of'),
    new Term('かんじる', '感じる', 'to feel, sense'),
    new Term('みつける', '見つける', 'to find'),
    new Term('かたづける', '付ける', 'to finish, tidy up'),
    new Term('ながれる', '流れる', 'to flow, be called off'),
    new Term('わすれる', '忘れる', 'to forget'),
    new Term('あつめる', '集める', 'to gather, collect'),
    new Term('える', '得る', 'to get'),
    new Term('きかえる', '換える', 'to get changed'),
    new Term('こえる', null, 'to get fat, grow fertile / cross over, exceed'),
    new Term('おりる', '降りる', 'to get off, go down'),
    new Term('つかれる', '疲れる', 'to get tired'),
    new Term('おきる', '起きる', 'to get up'),
    new Term('なれる', '慣れる', 'to get used to, become familiar with'),
    new Term('あげる', null, 'to give'),
    new Term('くれる', '呉れる', 'to give (the giver is not the speaker)'),
    new Term('かじる', '齧る', 'to gnaw, nibble'),
    new Term('でかける', '出かける', 'to go out, leave home'),
    new Term('むかえる', '迎える', 'to greet, meet, welcome'),
    new Term('くれる', '暮れる', 'to grow dark (sunset)'),
    new Term('かける', null, 'to hang, sit, telephone, risk'),
    new Term('たすける', '助ける', 'to help'),
    new Term('さまたげる', '妨げる', 'to hinder, obstruct'),
    new Term('ぶつける', null, 'to hit against, throw at'),
    new Term('かかえる', '抱える', 'to hold (in your arms), have'),
    new Term('ふえる', '増える', 'to increase'),
    new Term('くるしませる', '苦しませる', 'to inflict pain, torment'),
    new Term('ふせる', '伏せる', 'to lay face down'),
    new Term('つれる', '連れる', 'to lead'),
    new Term('もれる', '漏れる', 'to leak, escape'),
    new Term('なめる', '舐める', 'to lick'),
    new Term('ならべる', '並べる', 'to line up, list, arrange in order'),
    new Term('みる', '見る', 'to look'),
    new Term('さげる', '下げる', 'to lower, hang'),
    new Term('まちがえる', '違える', 'to make a mistake'),
    new Term('こしらえる', '拵える', 'to make manufacture'),
    new Term('まぜる', '混ぜる', 'to mix'),
    new Term('しらせる', '知らせる', 'to notify'),
    new Term('あける', '開ける', 'to open'),
    new Term('あわてる', '慌てる', 'to panic, be flustered'),
    new Term('わかれる', '別れる', 'to part, separate from, be divided, divorced'),
    new Term('へる', '減る', 'to pass through, go by'),
    new Term('すぎる', '過ぎる', 'to pass, exceed'),
    new Term('かさねる', '重ねる', 'to pile up, repeat'),
    new Term('くわだてる', '企てる', 'to plan, scheme'),
    new Term('ほめる', '褒める', 'to praise'),
    new Term('もうける', '儲ける', 'to profit, make money'),
    new Term('いれる', '入れる', 'to put in, let in'),
    new Term('のせる', null, 'to put on top off, put on board'),
    new Term('かかげる', '掲げる', 'to raise (a flag), hold up'),
    new Term('おぼえる', '覚える', 'to remember, learn'),
    new Term('もとめる', '求める', 'to request, seek, buy, ask'),
    new Term('にる', '似る', 'to resemble, be similar to'),
    new Term('おさえる', '抑える', 'to restrain, control'),
    new Term('にげる', '逃げる', 'to run away, escape'),
    new Term('たくわえる', '蓄える', 'to save money, put aside, store'),
    new Term('ためる', null, 'to save, store, accumulate'),
    new Term('みせる', '見せる', 'to show'),
    new Term('しめる', '閉める', 'to shut'),
    new Term('こしかける', '掛ける', 'to sit in (western style)'),
    new Term('ねる', '寝る', 'to sleep, go to bed'),
    new Term('こぼれる', null, 'to spill, overflow'),
    new Term('ひろめる', '広める', 'to spread, make popular'),
    new Term('かまえる', '構える', 'to stand prepared'),
    new Term('とめる', '止める', 'to stop, fasten'),
    new Term('やめる', '止める', 'to stop, give up, resign'),
    new Term('つよめる', '強める', 'to strengthen'),
    new Term('かためる', '固める', 'to strengthen, harden'),
    new Term('ささえる', '支える', 'to support'),
    new Term('ひきうける', '引き受ける', 'to take charge of'),
    new Term('教える', null, 'to teach, show'),
    new Term('いましめる', '戒める', 'to tell off, caution'),
    new Term('かんがえる', '考える', 'to think'),
    new Term('なげる', '投げる', 'to throw away'),
    new Term('すてる', '捨てる', 'to throw away'),
    new Term('そだてる', '育てる', 'to rear, to bring up'),
    new Term('いじめる', '虐める', 'to torment, bully'),
    new Term('ふれる', '触れる', 'to touch'),
    new Term('のりかえる', '乗り換える', 'to transit'),
    new Term('つける', '点ける', 'to turn on, light'),
    new Term('きえる', '消える', 'to vanish, go out, be extinguished'),
    new Term('ながめる', '眺める', 'to watch, view'),
    new Term('きる', '着る', 'to wear'),
    new Term('かれる', '枯れる', 'to wither'),
    new Term('つとめる', '勤める', 'to work for'),
    new Term('きずつける', '傷つける', 'to wound, damage, harm'),
]
