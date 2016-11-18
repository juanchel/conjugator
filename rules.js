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

function Term(word, ruby, def) {
    this.word = word;
    this.ruby = ruby;
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
    new Term('おきる', '<ruby>起<rt>お</rt></ruby>きる', 'to wake up; to occur'),
    new Term('でる', '<ruby>出<rt>で</rt></ruby>る', 'to leave; to come out'),
    new Term('くわえる', '<ruby>加<rt>くわ</rt></ruby>える', 'to add to, include'),
    new Term('みとめる', '<ruby>認<rt>みと</rt></ruby>める', 'to admit, recognize'),
    new Term('こたえる', '<ruby>答<rt>こた</rt></ruby>える', 'to answer'),
    new Term('さける', '<ruby>避<rt>さ</rt></ruby>ける', 'to avoid, dodge'),
    new Term('きんじる', '<ruby>禁<rt>きん</rt></ruby>じる', 'to ban, prohibit'),
    new Term('あびる', '<ruby>浴<rt>あ</rt></ruby>びる', 'to bathe, take a shower'),
    new Term('いる', '<ruby>居<rt>い</rt></ruby>る', 'to be'),
    new Term('できる', '<ruby>来<rt>でき</rt></ruby>る', 'to be able'),
    new Term('いきる', '<ruby>生<rt>い</rt></ruby>きる', 'to be alive'),
    new Term('きこえる', '<ruby>聞<rt>き</rt></ruby>こえる', 'to be audible, able to hear'),
    new Term('うまれる', '<ruby>生<rt>う</rt></ruby>まれる', 'to be born'),
    new Term('おれる', '<ruby>折<rt>お</rt></ruby>れる', 'to be broken, snap'),
    new Term('こげる', '<ruby>焦<rt>こ</rt></ruby>げる', 'to be burned, charred'),
    new Term('まける', '<ruby>負<rt>ま</rt></ruby>ける', 'to be defeated, lose a game'),
    new Term('たりる', '<ruby>足<rt>た</rt></ruby>りる', 'to be enough, suffient'),
    new Term('おくれる', '<ruby>遅<rt>おく</rt></ruby>れる', 'to be late, lag behind'),
    new Term('なまける', '<ruby>怠<rt>なま</rt></ruby>ける', 'to be lazy'),
    new Term('もてる', 'もてる', 'to be popular'),
    new Term('みえる', '<ruby>見<rt>み</rt></ruby>える', 'to be visible, able to see'),
    new Term('ぬれる', '<ruby>濡<rt>ぬ</rt></ruby>れる', 'to become wet'),
    new Term('はじめる', '<ruby>始<rt>はじ</rt></ruby>める', 'to begin'),
    new Term('しんじる', '<ruby>信<rt>しん</rt></ruby>じる', 'to believe, trust'),
    new Term('まげる', '<ruby>曲<rt>ま</rt></ruby>げる', 'to bend, twist'),
    new Term('かりる', '<ruby>借<rt>か</rt></ruby>りる', 'to borrow, rent'),
    new Term('こわれる', '<ruby>壊<rt>こわ</rt></ruby>れる', 'to break'),
    new Term('きれる', '<ruby>切<rt>き</rt></ruby>れる', 'to break, cut off, expire'),
    new Term('そだてる', '<ruby>育<rt>そだ</rt></ruby>てる', 'to bring up a child, train'),
    new Term('たてる', '<ruby>立<rt>た</rt></ruby>てる', 'to build'),
    new Term('やける', '<ruby>焼<rt>や</rt></ruby>ける', 'to burn'),
    new Term('変える', '変える', 'to change'),
    new Term('しらべる', '<ruby>調<rt>しら</rt></ruby>べる', 'to check, investigate'),
    new Term('はれる', '<ruby>晴<rt>は</rt></ruby>れる', 'to clear up, tidy up'),
    new Term('くずれる', '<ruby>崩<rt>くず</rt></ruby>れる', 'to collapse, cave in'),
    new Term('とれる', '<ruby>取<rt>と</rt></ruby>れる', 'to come off'),
    new Term('はずれる', '<ruby>外<rt>はず</rt></ruby>れる', 'to come off, go wide'),
    new Term('ほどける', '<ruby>解<rt>ほど</rt></ruby>ける', 'to come untied, loose'),
    new Term('なぐさめる', '<ruby>慰<rt>なぐさ</rt></ruby>める', 'to comfort, console'),
    new Term('いいつける', '<ruby>言<rt>い</rt></ruby>いつける', 'to command'),
    new Term('くらべる', '<ruby>比<rt>くら</rt></ruby>べる', 'to compare'),
    new Term('つづける', '<ruby>続<rt>つづ</rt></ruby>ける', 'to continue, proceed'),
    new Term('かぞえる', '<ruby>数<rt>かぞ</rt></ruby>える', 'to count'),
    new Term('きめる', '<ruby>決<rt>き</rt></ruby>める', 'to decide, choose'),
    new Term('さだめる', '<ruby>定<rt>さだ</rt></ruby>める', 'to decide, establish'),
    new Term('たべる', '<ruby>食<rt>た</rt></ruby>べる', 'to eat'),
    new Term('すぐれる', '<ruby>優<rt>すぐ</rt></ruby>れる', 'to excel, be excellent, be superior'),
    new Term('とりかえる', '<ruby>取<rt>と</rt></ruby>り<ruby>換<rt>か</rt></ruby>える', 'to exchange'),
    new Term('たおれる', '<ruby>倒<rt>たお</rt></ruby>れる', 'to fall down, collapse'),
    new Term('ほれる', '<ruby>惚<rt>ほ</rt></ruby>れる', 'to fall in love'),
    new Term('おちる', '<ruby>落<rt>お</rt></ruby>ちる', 'to fall, fail, go down'),
    new Term('おそれる', '<ruby>恐<rt>おそ</rt></ruby>れる', 'to fear, be in awe of'),
    new Term('かんじる', '<ruby>感<rt>かん</rt></ruby>じる', 'to feel, sense'),
    new Term('みつける', '<ruby>見<rt>み</rt></ruby>つける', 'to find'),
    new Term('かたづける', '<ruby>付<rt>かたづ</rt></ruby>ける', 'to finish, tidy up'),
    new Term('ながれる', '<ruby>流<rt>なが</rt></ruby>れる', 'to flow, be called off'),
    new Term('わすれる', '<ruby>忘<rt>わす</rt></ruby>れる', 'to forget'),
    new Term('あつめる', '<ruby>集<rt>あつ</rt></ruby>める', 'to gather, collect'),
    new Term('える', '<ruby>得<rt>え</rt></ruby>る', 'to get'),
    new Term('きかえる', '<ruby>換<rt>きか</rt></ruby>える', 'to get changed'),
    new Term('こえる', 'こえる', 'to get fat, grow fertile / cross over, exceed'),
    new Term('おりる', '<ruby>降<rt>お</rt></ruby>りる', 'to get off, go down'),
    new Term('つかれる', '<ruby>疲<rt>つか</rt></ruby>れる', 'to get tired'),
    new Term('おきる', '<ruby>起<rt>お</rt></ruby>きる', 'to get up'),
    new Term('なれる', '<ruby>慣<rt>な</rt></ruby>れる', 'to get used to, become familiar with'),
    new Term('あげる', 'あげる', 'to give'),
    new Term('くれる', '<ruby>呉<rt>く</rt></ruby>れる', 'to give (the giver is not the speaker)'),
    new Term('かじる', '<ruby>齧<rt>かじ</rt></ruby>る', 'to gnaw, nibble'),
    new Term('でかける', '<ruby>出<rt>で</rt></ruby>かける', 'to go out, leave home'),
    new Term('むかえる', '<ruby>迎<rt>むか</rt></ruby>える', 'to greet, meet, welcome'),
    new Term('くれる', '<ruby>暮<rt>く</rt></ruby>れる', 'to grow dark (sunset)'),
    new Term('かける', 'かける', 'to hang, sit, telephone, risk'),
    new Term('たすける', '<ruby>助<rt>たす</rt></ruby>ける', 'to help'),
    new Term('さまたげる', '<ruby>妨<rt>さまた</rt></ruby>げる', 'to hinder, obstruct'),
    new Term('ぶつける', 'ぶつける', 'to hit against, throw at'),
    new Term('かかえる', '<ruby>抱<rt>かか</rt></ruby>える', 'to hold (in your arms), have'),
    new Term('ふえる', '<ruby>増<rt>ふ</rt></ruby>える', 'to increase'),
    new Term('くるしませる', '<ruby>苦<rt>くる</rt></ruby>しませる', 'to inflict pain, torment'),
    new Term('ふせる', '<ruby>伏<rt>ふ</rt></ruby>せる', 'to lay face down'),
    new Term('つれる', '<ruby>連<rt>つ</rt></ruby>れる', 'to lead'),
    new Term('もれる', '<ruby>漏<rt>も</rt></ruby>れる', 'to leak, escape'),
    new Term('なめる', '<ruby>舐<rt>な</rt></ruby>める', 'to lick'),
    new Term('ならべる', '<ruby>並<rt>なら</rt></ruby>べる', 'to line up, list, arrange in order'),
    new Term('みる', '<ruby>見<rt>み</rt></ruby>る', 'to look'),
    new Term('さげる', '<ruby>下<rt>さ</rt></ruby>げる', 'to lower, hang'),
    new Term('まちがえる', '<ruby>違<rt>まちが</rt></ruby>える', 'to make a mistake'),
    new Term('こしらえる', '<ruby>拵<rt>こしら</rt></ruby>える', 'to make manufacture'),
    new Term('まぜる', '<ruby>混<rt>ま</rt></ruby>ぜる', 'to mix'),
    new Term('しらせる', '<ruby>知<rt>し</rt></ruby>らせる', 'to notify'),
    new Term('あける', '<ruby>開<rt>あ</rt></ruby>ける', 'to open'),
    new Term('あわてる', '<ruby>慌<rt>あわ</rt></ruby>てる', 'to panic, be flustered'),
    new Term('わかれる', '<ruby>別<rt>わか</rt></ruby>れる', 'to part, separate from, be divided, divorced'),
    new Term('へる', '<ruby>減<rt>へ</rt></ruby>る', 'to pass through, go by'),
    new Term('すぎる', '<ruby>過<rt>す</rt></ruby>ぎる', 'to pass, exceed'),
    new Term('かさねる', '<ruby>重<rt>かさ</rt></ruby>ねる', 'to pile up, repeat'),
    new Term('くわだてる', '<ruby>企<rt>くわだ</rt></ruby>てる', 'to plan, scheme'),
    new Term('ほめる', '<ruby>褒<rt>ほ</rt></ruby>める', 'to praise'),
    new Term('もうける', '<ruby>儲<rt>もう</rt></ruby>ける', 'to profit, make money'),
    new Term('いれる', '<ruby>入<rt>い</rt></ruby>れる', 'to put in, let in'),
    new Term('のせる', 'のせる', 'to put on top off, put on board'),
    new Term('かかげる', '<ruby>掲<rt>かか</rt></ruby>げる', 'to raise (a flag), hold up'),
    new Term('おぼえる', '<ruby>覚<rt>おぼ</rt></ruby>える', 'to remember, learn'),
    new Term('もとめる', '<ruby>求<rt>もと</rt></ruby>める', 'to request, seek, buy, ask'),
    new Term('にる', '<ruby>似<rt>に</rt></ruby>る', 'to resemble, be similar to'),
    new Term('おさえる', '<ruby>抑<rt>おさ</rt></ruby>える', 'to restrain, control'),
    new Term('にげる', '<ruby>逃<rt>に</rt></ruby>げる', 'to run away, escape'),
    new Term('たくわえる', '<ruby>蓄<rt>たくわ</rt></ruby>える', 'to save money, put aside, store'),
    new Term('ためる', 'ためる', 'to save, store, accumulate'),
    new Term('みせる', '<ruby>見<rt>み</rt></ruby>せる', 'to show'),
    new Term('しめる', '<ruby>閉<rt>し</rt></ruby>める', 'to shut'),
    new Term('こしかける', '<ruby>掛<rt>こしか</rt></ruby>ける', 'to sit in (western style)'),
    new Term('ねる', '<ruby>寝<rt>ね</rt></ruby>る', 'to sleep, go to bed'),
    new Term('こぼれる', 'こぼれる', 'to spill, overflow'),
    new Term('ひろめる', '<ruby>広<rt>ひろ</rt></ruby>める', 'to spread, make popular'),
    new Term('かまえる', '<ruby>構<rt>かま</rt></ruby>える', 'to stand prepared'),
    new Term('とめる', '<ruby>止<rt>と</rt></ruby>める', 'to stop, fasten'),
    new Term('やめる', '<ruby>止<rt>や</rt></ruby>める', 'to stop, give up, resign'),
    new Term('つよめる', '<ruby>強<rt>つよ</rt></ruby>める', 'to strengthen'),
    new Term('かためる', '<ruby>固<rt>かた</rt></ruby>める', 'to strengthen, harden'),
    new Term('ささえる', '<ruby>支<rt>ささ</rt></ruby>える', 'to support'),
    new Term('ひきうける', '<ruby>引<rt>ひ</rt></ruby>き<ruby>受<rt>う</rt></ruby>ける', 'to take charge of'),
    new Term('教える', '教える', 'to teach, show'),
    new Term('いましめる', '<ruby>戒<rt>いまし</rt></ruby>める', 'to tell off, caution'),
    new Term('かんがえる', '<ruby>考<rt>かんが</rt></ruby>える', 'to think'),
    new Term('なげる', '<ruby>投<rt>な</rt></ruby>げる', 'to throw away'),
    new Term('すてる', '<ruby>捨<rt>す</rt></ruby>てる', 'to throw away'),
    new Term('そだてる', '<ruby>育<rt>そだ</rt></ruby>てる', 'to rear, to bring up'),
    new Term('いじめる', '<ruby>虐<rt>いじ</rt></ruby>める', 'to torment, bully'),
    new Term('ふれる', '<ruby>触<rt>ふ</rt></ruby>れる', 'to touch'),
    new Term('のりかえる', '<ruby>乗<rt>の</rt></ruby>り<ruby>換<rt>か</rt></ruby>える', 'to transit'),
    new Term('つける', '<ruby>点<rt>つ</rt></ruby>ける', 'to turn on, light'),
    new Term('きえる', '<ruby>消<rt>き</rt></ruby>える', 'to vanish, go out, be extinguished'),
    new Term('ながめる', '<ruby>眺<rt>なが</rt></ruby>める', 'to watch, view'),
    new Term('きる', '<ruby>着<rt>き</rt></ruby>る', 'to wear'),
    new Term('かれる', '<ruby>枯<rt>か</rt></ruby>れる', 'to wither'),
    new Term('つとめる', '<ruby>勤<rt>つと</rt></ruby>める', 'to work for'),
    new Term('きずつける', '<ruby>傷<rt>きず</rt></ruby>つける', 'to wound, damage, harm'),
]
