function Modifier(flags, modFunc, nextMod) {
  if(this instanceof Modifier == false)
    return new Modifier(flags, modFunc, nextMod);

  try{
    this.flag = flags.map(function(f){return f[1];});
    this.desc = flags.map(function(f){return f[0];});
    this.modFunc = modFunc;
    this.nextMod = nextMod;
  } catch(e){
    console.error(flags, modFunc)
  };
}

function Term(word, kanji, def) {
    if(this instanceof Term == false)
      return new Term(word, kanji, def);
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

var ModTypes = {
  FORMAL: ['Formal', 'formal'],
  INFORMAL: ['Informal', 'informal'],
  PAST: ['Past', 'past'],
  NEGATIVE: ['Negative' ,'negative'],
  TE: ['て　form', 'verbte'],
  VOLITIONAL: ['Volitional', 'volitional'],
  POTENTIAL: ['Potential', 'potential'],
  CAUSATIVE: ['Causative', 'causative'],
  PASSIVE: ['Passive', 'passive'],
  PROGRESSIVE: ['Progressive', 'progressive'],
  IMPERITIVE: ['Imperitive', 'imperitive'],
  PROBABLE: ['Probable', 'probable'],
  CONDITIONAL: ['Conditional', 'conditional'],
  PLEASE: ['Please', 'please'],
  REQUEST: ['Request', 'request'],
  HEARSAY: ['Hearsay', 'hearsay'],
  SEEMSLIKE: ['Seems like', 'seemslike'],
};



var ICHIVERB = [
    Modifier([ModTypes.INFORMAL], function(w) {
        return w;
    }),
    Modifier([ModTypes.INFORMAL, ModTypes.PAST], function(w) {
        return trimLast(w) + 'た';
    }),
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE], function(w) {
        return trimLast(w) + 'ない';
    }),
    Modifier([ModTypes.INFORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
        return trimLast(w) + 'なかった';
    }),
    Modifier([ModTypes.FORMAL], function(w) {
        return trimLast(w) + 'ます';
    }),
    Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w) {
        return trimLast(w) + 'ました';
    }),
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w) {
        return trimLast(w) + 'ません';
    }),
    Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
        return trimLast(w) + 'ませんでした';
    }),
    Modifier([ModTypes.FORMAL, ModTypes.VOLITIONAL, ModTypes.NEGATIVE], function(w) {
        return trimLast(w) + 'ますまい';
    }),
]

var ICHIDAN = [
    Modifier([], function(w) {
        return w;
    }, ICHIVERB),
    Modifier([ModTypes.TE], function(w) {
        return trimLast(w) + 'て';
    }),
    Modifier([ModTypes.TE, ModTypes.PLEASE], function(w) {
        return trimLast(w) + 'て' + 'ください';
    }),
    Modifier([ModTypes.POTENTIAL], function(w) {
        return trimLast(w) + 'られる';
    }, ICHIVERB),
    Modifier([ModTypes.PASSIVE], function(w) {
        return trimLast(w) + 'られる';
    }, ICHIVERB),
    Modifier([ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させる';
    }, ICHIVERB),
    Modifier([ModTypes.PASSIVE, ModTypes.CAUSATIVE], function(w) {
        return trimLast(w) + 'させられる';
    }, ICHIVERB),
    Modifier([ModTypes.PROGRESSIVE], function(w) {
        return trimLast(w) + 'ている';
    }, ICHIVERB),
    Modifier([ModTypes.REQUEST], function(w) {
        return trimLast(w) + 'なさい';
    }),
    Modifier([ModTypes.HEARSAY], function(w) {
        return w + 'そう';
    }),
    Modifier([ModTypes.SEEMSLIKE], function(w) {
        return trimLast(w) + 'そう';
    }),
    Modifier([ModTypes.NEGATIVE, ModTypes.VOLITIONAL], function(w) {
        return w + 'まい';
    }),
    Modifier([ModTypes.VOLITIONAL], function(w) {
        return trimLast(w) + 'ましょう';
    }),
    Modifier([ModTypes.FORMAL, ModTypes.VOLITIONAL], function(w) {
        return trimLast(w) + 'ましょう';
    }),
    Modifier([ModTypes.CONDITIONAL], function(w) {
        return trimLast(w) + 'れば';
    }),
];

var GODAN = [
  Modifier([ModTypes.TE], function(w) {
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
  }),

  Modifier([ModTypes.PAST], function(w) {
      var e, l = snipLast(w);
      switch(l)
      {
        case 'す':
          e = 'した';
          break;
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
  }),
  Modifier([ModTypes.NEGATIVE], function(w) {
      var l = snipLast(w);
      return trimLast(w) + Mogrify.A(l) + 'ない';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w) {
      var l = snipLast(w);
      return trimLast(w) + Mogrify.I(l) + 'ません';
  }),
  Modifier([ModTypes.CAUSATIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'せる';
  }),
  Modifier([ModTypes.PASSIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'れる';
  }),
  Modifier([ModTypes.POTENTIAL], function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w)) + 'る';
  }),
  Modifier([ModTypes.CONDITIONAL], function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w)) + 'ば';
  }),
  Modifier([ModTypes.VOLITIONAL], function(w) {
      return trimLast(w) + Mogrify.O(snipLast(w)) + 'う';
  }),
  Modifier(ModTypes.FORMAL, function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'ます';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'なかった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w) {
      return trimLast(w) + Mogrify.I(snipLast(w)) + 'ませんでした';
  }),
  Modifier([ModTypes.CAUSATIVE, ModTypes.PASSIVE], function(w) {
      return trimLast(w) + Mogrify.A(snipLast(w)) + 'せられる';
  }),
  Modifier(ModTypes.IMPERITIVE, function(w) {
      return trimLast(w) + Mogrify.E(snipLast(w));
  }),
]

var irreg_do = [
    {
      base: "する",
      polite: "します",
      te: "して",

      past: "した",
      polpast: "しました",

      neg: "しない",
      polneg: "しません",

      pastneg: "しなかった",
      polpastneg: "しませんでした",

      volitional: "しよう",
      passive: "される",
      causative: "させる",
      potential: "できる",
      imperitive: "しろ",
      conditional: "すれば",
    },
    {
      base: "くる",
      polite: "きます",
      te: "きて",

      past: "きた",
      polpast: "きました",

      neg: "こない",
      polneg: "",

      pastneg: "こなかった",
      polpastneg: "きませんでした",

      volitional: "こよう",
      passive: "こられる",
      causative: "こさせる",
      potential: "これる",
      imperitive: "こい",
      conditional: "くれば",
    },
]

var irreg_exist = [
    {
      base: "です",
      polite: "です",

      past: "だった",
      polpast: "でした",

      neg: "ではない",
      polneg: "ではありません",

      pastneg: "ではなかった",
      polpastneg: "ではありませんでした",

      probable: "だろう",
      polprobable: "でしょう",

      negprob: "ではないだろう",
      polnegprob: "ではないでしょう",
    },
    {
      base: "ある",
      polite: "あります",

      past: "あった",
      polpast: "ありました",

      neg: "ない",
      polneg: "ありません",

      pastneg: "なかった",
      polpastneg: "ありませんでした",

      probable: "あるだろう",
      polprobable: "あるでしょう",

      negprob: "ないだろう",
      polnegprob: "ないでしょう",
    },
    {
      base: "いる",
      polite: "います",

      past: "いった",
      polpast: "いました",

      neg: "いない",
      polneg: "いません",

      pastneg: "いなかった",
      polpastneg: "いませんでした",

      probable: "いるだろう",
      polprobable: "いるでしょう",

      negprob: "いないだろう",
      polnegprob: "いないでしょう",
    }
];

function irreg_get(terms, w)
{
  var i, t;
  for(i=0;i<terms.length;i++)
  {
    t = terms[i];
    if(t.base.localeCompare(w) == 0)
      return t;
  }
  console.error('No irregular term for: ' + w);
}

var IRREGULAR_DO = [
  Modifier([ModTypes.FORMAL], function(w){
    return irreg_get(irreg_do, w).polite;
  }),
  Modifier([ModTypes.TE], function(w){
    return irreg_get(irreg_do, w).te;
  }),
  Modifier(ModTypes.PAST, function(w){
    return irreg_get(irreg_do, w).past;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w){
    return irreg_get(irreg_do, w).polpast;
  }),
  Modifier([ModTypes.NEGATIVE], function(w){
    return irreg_get(irreg_do, w).neg;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w){
    return irreg_get(irreg_do, w).polneg;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return irreg_get(irreg_do, w).pastneg;
  }),
  Modifier([ModTypes.VOLITIONAL], function(w){
    return irreg_get(irreg_do, w).volitional;
  }),
  Modifier([ModTypes.PASSIVE], function(w){
    return irreg_get(irreg_do, w).passive;
  }),
  Modifier([ModTypes.CAUSATIVE], function(w){
    return irreg_get(irreg_do, w).causative;
  }),
  Modifier([ModTypes.POTENTIAL], function(w){
    return irreg_get(irreg_do, w).potential;
  }),
  Modifier([ModTypes.IMPERITIVE], function(w){
    return irreg_get(irreg_do, w).imperitive;
  }),
  Modifier([ModTypes.CONDITIONAL], function(w){
    return irreg_get(irreg_do, w).conditional;
  }),
]

var IRREGULAR_EXIST = [
  Modifier([ModTypes.FORMAL], function(w){
    return irreg_get(irreg_exist, w).polite;
  }),
  Modifier([ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).probable;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).polprobable;
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).negprob;
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PROBABLE], function(w){
    return irreg_get(irreg_exist, w).polnegprob;
  }),
]

var II_ADJECTIVE = [
  Modifier([ModTypes.FORMAL], function(w){
    return w + 'です';
  }),
  Modifier([ModTypes.PAST], function(w){
    return trimLast(w) + 'かった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w){
    return trimLast(w) + 'かったです';
  }),
  Modifier([ModTypes.NEGATIVE], function(w){
    return trimLast(w) + 'くない';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w){
    return trimLast(w) + 'くありません';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return trimLast(w) + 'くなかった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return trimLast(w) + 'くありませんでした';
  }),
  Modifier(ModTypes.TE, function(w){
    return trimLast(w) + 'くて';
  }),
]

var NA_ADJECTIVE = [
  Modifier([ModTypes.TE], function(w){
    return w + 'で';
  }),
  Modifier([ModTypes.FORMAL], function(w){
    return w + 'です';
  }),
  Modifier([ModTypes.NEGATIVE], function(w){
    return w + 'ではない';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE], function(w){
    return w + 'ではありません';
  }),
  Modifier([ModTypes.PAST], function(w){
    return w + 'だった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.PAST], function(w){
    return w + 'でした';
  }),
  Modifier([ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return w + 'ではなかった';
  }),
  Modifier([ModTypes.FORMAL, ModTypes.NEGATIVE, ModTypes.PAST], function(w){
    return w + 'ではありませんでした';
  }),
  Modifier([ModTypes.TE], function(w){
    return w + 'で';
  }),
]
