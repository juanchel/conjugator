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

var KANA_FAM = {
  V: ['あ','え','い','お','う'],

  K: ['か','け','き','こ','く'],
  G: ['が','げ','ぎ','ご','ぐ'],

  H: ['は','へ','ひ','ほ','ふ'],
  B: ['ば','べ','び','ぼ','ぶ'],
  P: ['ぱ','ぺ','ぴ','ぽ','ぷ'],

  S: ['さ','せ','し','そ','す'],
  Z: ['ざ','ぜ','じ','ぞ','ず'],

  T: ['た','て','ち','と','つ'],
  D: ['だ','で','ぢ','ど', null],

  N: ['な','ね','に','の','ぬ'],
  M: ['ま','め','み','も','む'],
  R: ['ら','れ','り','ろ','る'],
  Y: ['や', null, null, 'よ', 'ゆ'],

};

var Mogrify = {
  _mog: function(kana, index)
  {
    for(base in KANA_FAM)
    {
      if(KANA_FAM[base].indexOf(kana) != -1)
      {
        return KANA_FAM[base][index]
      }
    }
    console.error("No mogrification for kana: " + kana);
  },
  A: function(kana)
  {
      return Mogrify._mog(kana, 0);
  },
  E: function(kana)
  {
      return Mogrify._mog(kana, 1);
  },
  I: function(kana)
  {
      return Mogrify._mog(kana, 2);
  },
  O: function(kana)
  {
      return Mogrify._mog(kana, 3);
  },
  U: function(kana)
  {
      return Mogrify._mog(kana, 4);
  },
};

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
    }, ['Causative'], ICHIVERB),
    new Modifier('pass cause', function(w) {
        return trimLast(w) + 'させられる';
    }, ['Causative', 'Passive'], ICHIVERB),
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
];

var GODAN = [
  new Modifier('base', function(w) {
      return w;
  }, [], null),
  new Modifier('te', function(w) {
      var e, l = snipLast(w);
      switch(l)
      {
        case 'す':
          e = 'して';
          break;
        case 'く':
          e = 'いて';
          break;
        case 'ぐ':
          e = 'いで';
          break;
        case 'ぬ':
        case 'ぶ':
        case 'む':
          e = 'んで';
          break;
        case 'る':
        case 'つ':
        case 'う':
          e = 'ぅて';
          break;
        default:
          console.error('No te conj for: ' + l)
      }
      return trimLast(w) + e;
  }, ['て-Form'], null),

  new Modifier('past', function(w) {
      var e, l = snipLast(w);
      switch(l)
      {
        case 'す':
          e = 'した';
          break;
          console.info(l);
        case 'く':
          e = 'いた';
          break;
        case 'ぐ':
          e = 'いだ';
          break;
        case 'ぬ':
        case 'ぶ':
        case 'む':
          e = 'んだ';
          break;
        case 'る':
        case 'つ':
        case 'う':
          e = 'ぅた';
          break;
        default:
          console.error('No past conj for: ' + l)
      }
      return trimLast(w) + e;
  }, ['Past'], null),
  new Modifier('neg', function(w) {
      var l = snipLast(w);
      return trimLast(w) + Mogrify.A(l) + 'ない';
  }, ['Negative'], null),
  new Modifier('polneg', function(w) {
      var l = snipLast(w);
      return trimLast(w) + Mogrify.I(l) + 'ません';
  }, ['Negative', 'Polite'], null),
  new Modifier('cause', function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'せる';
  }, ['Causative'], null),
  new Modifier('passive', function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'れる';
  }, ['Passive'], null),
  new Modifier('potential', function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w)) + 'る';
  }, ['Potential'], null),
  new Modifier('conditional', function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w)) + 'ば';
  }, ['Conditional'], null),
  new Modifier('volitional', function(w) {
      return trimLast(w) + Mogrify.O(snipLast(w)) + 'う';
  }, ['Volitional'], null),
  new Modifier('polite', function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'ます';
  }, ['Polite'], null),
  new Modifier('pastneg', function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'なかった';
  }, ['Past', 'Negative'], null),
  new Modifier('polpastneg', function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'ませんでした';
  }, ['Past', 'Negative', 'Polite'], null),
  new Modifier('passivecause', function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'せられる';
  }, ['Passive', 'Causative'], null),
  new Modifier('imperitive', function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w));
  }, ['Imperitive'], null),
]
