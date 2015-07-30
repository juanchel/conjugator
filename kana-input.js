'use strict';

(function () {

  var root = this;

  var _ = function (input) {

    return {

      insert: function (newStr, position) {
        newStr = newStr || '';
        position = Math.max(0, Math.min(position, input.length));

        return input.substr(0, position) + newStr + input.substr(position);
      },

      remove: function (length, position) {
        length = Math.min(length, position);
        position = Math.max(0, Math.min(position, input.length));

        return input.substr(0, position - length) + input.substr(position);
      },

      setCaretPosition: function (position) {

        if (input.setSelectionRange) {
          input.setSelectionRange(position, position);
        } else if (input.createTextRange) {
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', position);
          range.moveStart('character', position);
          range.select();
        }
      }
    };
  };

  var ki = root.kanaInput = {

    // Add utils for testing
    utils: _,

    // kana / romajis knowledge

    // Order is important, it matches with hiraganas and katakanas
    romajis: 'a i u e o ka ki ku ke ko sa shi su se so ta chi tsu te to na ni nu ne no ha hi fu he ho ma mi mu me mo ya yu yo ra ri ru re ro wa wo n ga gi gu ge go za ji zu ze zo da ji zu de do ba bi bu be bo pa pi pu pe po kya kyu kyo gya gyu gyo sha shu sho ja ju jo cha chu cho nya nyu nyo hya hyu hyo bya byu byo pya pyu pyo mya myu myo rya ryu ryo'.split(' '),

    isRomaji: function (input) {
      return ki.romajis.indexOf(input) !== -1;
    },

    isSpecialRomaji: function (input) {

      // Handle special case for n ん ン
      var specialN = input.match(/^[んン][aieuo]$/) != null;

      // Handle special case for sokuon っ
      var specialSokuon = input.match(/^([kstcnhfmyrwgzjdbp])\1/) && ki.isRomaji(input.substr(1));

      return specialN || specialSokuon;
    },

    // Order is important, it matches with romajis
    hiraganas: 'あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の は ひ ふ へ ほ ま み む め も や ゆ よ ら り る れ ろ わ を ん が ぎ ぐ げ ご ざ じ ず ぜ ぞ だ ぢ づ で ど ば び ぶ べ ぼ ぱ ぴ ぷ ぺ ぽ きゃ きゅ きょ ぎゃ ぎゅ ぎょ しゃ しゅ しょ じゃ じゅ じょ ちゃ ちゅ ちょ にゃ にゅ にょ ひゃ ひゅ ひょ びゃ びゅ びょ ぴゃ ぴゅ ぴょ みゃ みゅ みょ りゃ りゅ りょ'.split(' '),

    isHiragana: function (input) {
      return ki.hiraganas.indexOf(input) !== -1;
    },

    // Order is important, it matches with romajis
    katakanas: 'ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ ダ ヂ ヅ デ ド バ ビ ブ ベ ボ パ ピ プ ペ ポ キャ キュ キョ ギャ ギュ ギョ シャ シュ ショ ジャ ジュ ジョ チャ チュ チョ ニャ ニュ ニョ ヒャ ヒュ ヒョ ビャ ビュ ビョ ピャ ピュ ピョ ミャ ミュ ミョ リャ リュ リョ'.split(' '),

    isKatakana: function (input) {
      return ki.katakanas.indexOf(input) !== -1;
    },

    isKana: function (input) {
      return ki.isHiragana(input) || ki.isKatakana(input);
    },

    isSpecialKana: function (input) {
      var specialSokuon = (input[0] === 'っ' || input[0] === 'ッ') &&
        ki.isKana(input.substr(1));

      return specialSokuon;
    },

    kanaToRomaji: function (input) {
      var kana;

      if (input[0] === 'っ' && ki.isKana(input.substr(1))) {
        kana = ki.romajis[ki.hiraganas.indexOf(input.substr(1))];
      }

      if (input[0] === 'ッ' && ki.isKana(input.substr(1))) {
        kana = ki.romajis[ki.katakanas.indexOf(input.substr(1))];
      }

      if (kana) {
        kana = kana[0] + kana;
      } else {
        kana = ki.romajis[ki.hiraganas.indexOf(input)] || ki.romajis[ki.katakanas.indexOf(input)];
      }

      return kana;
    },

    romajiToHiragana: function (input) {
      if (input[0] === 'ん') {
        input = 'n' + input.substr(1);
      }

      if (input.match(/^([kstcnhfmyrwgzjdbp])\1/) && ki.isRomaji(input.substr(1))) {
        input = 'n' + input.substr(1);

        return 'っ' + ki.hiraganas[ki.romajis.indexOf(input.substr(1))];
      } else {
        return ki.hiraganas[ki.romajis.indexOf(input)];
      }
    },

    romajiToKatakana: function (input) {
      if (input[0] === 'ン') {
        input = 'n' + input.substr(1);
      }

      if (input.match(/^([kstcnhfmyrwgzjdbp])\1/) && ki.isRomaji(input.substr(1))) {
        return 'ッ' + ki.katakanas[ki.romajis.indexOf(input.substr(1))];
      } else {
        return ki.katakanas[ki.romajis.indexOf(input)];
      }
    },

    // insert new letter inside text and make possible hiragana transformations
    insertNewLetter: function (mode, text, position, newLetter, callback) {

      if (text.length >= 25) {
        return;
      }

      var newText = _(text).insert(newLetter, position),
        newPosition = position + 1,
        extractedRomajiText = newText.substring(0, newPosition),
        translatedRomajiText;

      // Extract previous romajis characters that can be translated
      while (extractedRomajiText.length > 0 && !ki.isRomaji(extractedRomajiText) && !ki.isSpecialRomaji(extractedRomajiText)) {
        extractedRomajiText = extractedRomajiText.substr(1);
      }

      if (extractedRomajiText.length > 0) {

        // Remove the extractedRomajiText from the text and update position
        newText = _(newText).remove(extractedRomajiText.length, newPosition);
        newPosition -= extractedRomajiText.length;

        // Translate from romajis to hiragana or katakana
        if (mode === 'hiragana') {
          translatedRomajiText = ki.romajiToHiragana(extractedRomajiText);
        }
        if (mode === 'katakana') {
          translatedRomajiText = ki.romajiToKatakana(extractedRomajiText);
        }

        // Insert translated text and update position
        newText = _(newText).insert(translatedRomajiText, newPosition);
        newPosition += translatedRomajiText.length;
      }

      callback(newText, newPosition);
    },

    // remove letter from text, make transformation back to romajis if necessary
    // removeLetter: function (text, position, callback) {

    //   var newText = text,
    //     newPosition = position,
    //     extractedKanaText = newText.substring(0, newPosition),
    //     translatedKanaText;

    //   // Extract previous romajis characters that can be translated
    //   while (extractedKanaText.length > 0 && !ki.isKana(extractedKanaText) && !ki.isSpecialKana(extractedKanaText)) {
    //     extractedKanaText = extractedKanaText.substr(1);
    //   }

    //   if (extractedKanaText.length > 0) {

    //     // Remove the extractedKanaText from the text and update position
    //     newText = _(newText).remove(extractedKanaText.length, newPosition);
    //     newPosition -= extractedKanaText.length;

    //     // Translate from kana to romajis
    //     translatedKanaText = ki.kanaToRomaji(extractedKanaText);

    //     // Special case for n ん ン
    //     if (translatedKanaText.match(/^n[aieuo]$/)) {
    //       if (ki.isHiragana(extractedKanaText)) {
    //         translatedKanaText = 'ん' + translatedKanaText[1];
    //       } else {
    //         translatedKanaText = 'ン' + translatedKanaText[1];
    //       }
    //     }

    //     // Insert translated text and update position
    //     newText = _(newText).insert(translatedKanaText, newPosition);
    //     newPosition += translatedKanaText.length;
    //   }

    //   // Remove the character that was supposed to be moved
    //   newText = _(newText).remove(1, newPosition);
    //   newPosition -= 1;

    //   callback(newText, newPosition);
    // }
  };

  root.onkeypress = function (e) {

    var input = e.target,
      kanaInput = input.dataset ? input.dataset.kanaInput : false;

    if (kanaInput !== '' && kanaInput !== 'true' || e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }

    var position = input.selectionStart,
      selectionLength = input.selectionEnd - input.selectionStart,
      text = input.value.toLowerCase(),
      newLetter = String.fromCharCode(e.charCode),

      transformCallback = function (newText, newPosition) {
        input.value = newText;
        _(input).setCaretPosition(newPosition);
      };

    if ('A' <= newLetter && newLetter <= 'z') {
      e.preventDefault();

      var mode = newLetter <= 'Z' ? 'katakana' : 'hiragana';
      newLetter = newLetter.toLowerCase();

      // Remove selected characters
      if (selectionLength > 0) {
        text = _(text).remove(selectionLength, position + selectionLength);
      }

      // Insert new letter and transform to kana with correct mode
      ki.insertNewLetter(mode, text, position, newLetter, transformCallback);
    }

    if (newLetter === '.') {
      e.preventDefault();
      ki.insertNewLetter('hiragana', text, position, '。', transformCallback);
    }

    if (newLetter === '-') {
      e.preventDefault();
      ki.insertNewLetter('hiragana', text, position, 'ー', transformCallback);
    }
  };

  root.onkeydown = function (e) {

    var input = e.target,
      kanaInput = input.dataset ? input.dataset.kanaInput : false;

    if (kanaInput !== '' && kanaInput !== 'true' || e.metaKey || e.altKey || e.ctrlKey) {
      return;
    }

    var position = input.selectionStart,
      selectionLength = input.selectionEnd - input.selectionStart,
      text = input.value.toLowerCase(),

      transformCallback = function (newText, newPosition) {
        input.value = newText;
        _(input).setCaretPosition(newPosition);
      };


    // if (e.keyCode === 8 /* backspace */ && position !== 0 && selectionLength === 0) {
    //   e.preventDefault();

    //   ki.removeLetter(text, position, transformCallback);
    // }
  };

  root.onkeyup = function (e) {

    var input = e.target,
      mode = input.dataset ? input.dataset.kanaInput : false;

    submitAnswer();
    if (mode !== 'hiragana' && mode !== 'katakana') {
      return;
    }

  };

}).call(this);