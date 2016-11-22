'use strict';

var score = 0;
var time = 0;
var mult = 1;
var _timeMax = 30;
var timeMax = _timeMax;
var correct = '';
var skipped = false;

$(document).ready(function() {
    // Stop the user from pressing enter in the text area
    $('textarea').bind('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
            $(this).parents('form').submit();
            skipQuestion();
            return false;
        }
    });

    // When the play button is clicked
    $('#play').add("#optplay").click(function() {
        nextQuestion();
        $('#start-screen').animate({top: '-1000px'}, 800);
        $('#main').show();
        $('#option-menu').hide();
        $('#main').animate({'margin-top': '20px'}, 800);
        $('#title-text').animate({'width': '350px', 'font-size': '20pt', 'height': '40px', 'bottom': '5px', 'margin-bottom': '0px'}, 800);
        $('#title').animate({'height': '50px'}, 800);
        $('#ribbon img').animate({'height': '50px', 'width': '50px'}, 800);
    });

    $('#options').click(function() {
        $('#start-screen').animate({top: '-1000px'}, 800);
        $('#option-menu').show();
        $('#option-menu').animate({'margin-top': '20px'}, 800);
        $('#title-text').animate({'width': '350px', 'font-size': '20pt', 'height': '40px', 'bottom': '5px', 'margin-bottom': '0px'}, 800);
        $('#title').animate({'height': '50px'}, 800);
        $('#ribbon img').animate({'height': '50px', 'width': '50px'}, 800);
    });

    var genOpts = function(id, opts)
    {
      opts.forEach(function(opt)
      {
        opt[1] = "opt-" + opt[1];
        opt.unshift($("#"+id));
        genFullOption.apply(this, opt)
      });
    }

    genOpts('adjective-options', [
      ['い adjectives', 'iadj'],
      ['な adjectives', 'naadj']
    ]);

    genOpts('conjugation-options', [
      ModTypes.FORMAL,
      ModTypes.INFORMAL,
      ModTypes.PAST,
      ModTypes.NEGATIVE,
      ModTypes.TE,
      ModTypes.VOLITIONAL,
      ModTypes.POTENTIAL,
      ModTypes.CAUSATIVE,
      ModTypes.PASSIVE,
      ModTypes.PROGRESSIVE,
      ModTypes.IMPERITIVE,
      ModTypes.PROBABLE,
      ModTypes.CONDITIONAL,
      ModTypes.PLEASE,
      ModTypes.REQUEST,
      ModTypes.HEARSAY,
      ModTypes.SEEMSLIKE,
    ]);

    genOpts('verb-options',[
      ['ichidan (-いる,　-える)', 'ichidan'],
      ['godan', 'godan'],
      ['irregular', 'irregular'],
    ]);

    genOpts('kanji-options',[
      ['Show and Accept Kanji', 'kanji'],
      ['Show Furigana', 'furigana'],
    ]);

    $("#option-menu input:checkbox")
    .change(function()
    {
      location.hash = configString();
    })
    .each(function(i)
    {
      $(this).data("cfg", 2**i);
    });
    setConfig(location.hash.replace(/^\#/, ''));

});

function Question(word) {
    this.word = word;
    this.base = word;
    this.modList = [];
}

Question.prototype.modify = function(modSet) {
    // Pick and apply a random mod
    var modifier = fetchRandom(modSet);
    this.word = modifier.modFunc(this.word);
    this.modList.push.apply(this.modList, modifier.desc);
}

// Fetches a random element of an array
function fetchRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Skips a question and shows the correct answer
function skipQuestion() {
    if (skipped) {
        nextQuestion();
    } else {
        time = -1;
        mult = 1;
        $('#mult').text(mult);
        $('#answer').addClass('flash-red');
        $('#time-bar').css('background', '#e74c3c');
        addWell($('#answer').val()||'', correct)
        $('#answer').val(correct);
        setTimeout(function(){
            $('#answer').removeClass('flash-red');
        }, 300);
    }
    skipped = !skipped;
}

// Check if the answer is correct every time a character is typed
function submitAnswer() {
    var ans = $('#answer').val().replace(/\s/g, '');
    if (ans == correct && !skipped) {
        $('#answer').addClass('flash');
        setTimeout(function(){
            $('#answer').removeClass('flash');
        }, 300);
        if (time > 0) {
            score += Math.ceil(time * mult / timeMax);
            mult += 1;
            timeMax *= 0.95;
        } else {
            mult = 1;
            timeMax = _timeMax;
        }
        addWell(ans, correct)
        $('#score').text(score);
        setTimeBar(100);
        $('#mult').text(mult);
        nextQuestion();
    }
}

// Sets time remaining bar to the percentage passed in
function setTimeBar(percent) {
    $('#time-bar').css('background-image', 'linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-o-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-moz-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-webkit-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-ms-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
}

// Generate a new question
function nextQuestion() {
    time = 100 * timeMax;

    var wordset = pickType(),
      type = wordset[0],
      terms = wordset[1],
      pos = wordset[2];

    var term = terms[Math.floor(Math.random() * terms.length)];
    $('#part').text(pos)

    var question = new Question(term.word);
    question.modify(type);
    correct = question.word;

    console.log(correct);
    $('#question-word').html(term.render());
    $('#meaning').text(term.def);
    $('#mods .mod').remove();
    $('#answer').val('');
    fadeInMods(question.modList);
}

// Function for animating the mods falling in
function fadeInMods(modList) {
    var $space = $('<div/>', {class: 'space'});
    $space.text('.')
    var $toAdd = $('<div/>', {class: 'mod', style: 'display:none'});
    $toAdd.text(modList.shift());
    $space.insertBefore('#mod-clear');
    $toAdd.insertBefore('#mod-clear');
    $('.space').animate({width: '0px'}, 300);
    $('.mod').fadeIn(300);
    if (modList.length > 0) {
        setTimeout(function() {
            $('.space').remove();
            fadeInMods(modList);
        }, 300);
    }
}

// Picks a type of word to make the next question about
// This function returns the object dictionary so it can be passed around easily
var sets = null
function pickType() {
    var sum = 0;
    if(sets == null)
    {
      sets = [];
      if($("#opt-godan:checked").length)
        sets.push([GODAN, godan, '[godan] v.'])

      if($("#opt-irregular:checked").length)
      {
        sets.push([IRREGULAR_DO, irregular_do, '[irregular] v.'])
        sets.push([IRREGULAR_EXIST, irregular_exist, '[irregular] v.'])
      }

      if($("#opt-naadj:checked").length)
        sets.push([NA_ADJECTIVE, na_adjective, '[na] adj.'])

      if($("#opt-iadj:checked").length)
        sets.push([II_ADJECTIVE, ii_adjective, '[i] adj.'])

      // keep last
      if($("#opt-ichidan:checked").length || !sets.length)
        sets.push([ICHIDAN, ichidan, '[ichidan] v.'])

      // remove config-disabled modifiers
      filterSets(sets);
    }

    if(sets.length == 1)
      return sets[0];

    sets.forEach(function(s)
    {
      sum += s[1].length;
    });

    var rando = ~~(Math.random() * sum);
    var i=0
    do {
      if(rando < sets[i][1].length)
        return sets[i]
      rando -= sets[i][1].length
      i++;
    } while (i < sets.length);
}

// Returns the word without the last kana
function trimLast(word) {
    return word.substring(0, word.length - 1);
}

function snipLast(word) {
    return word.substr(-1);
}

// Timer function called 100 times per second
function interval() {
    if (!skipped) {
        time--;
        setTimeBar(time/timeMax);
    }
}

// Adds an label to the options menu
function genLabel(desc) {
    var $label = $('<div/>', {class: 'option-label'});
    $label.text(desc);
    return $label;
}

// Adds an option to the options menu
function genOption(desc) {
    var $option = $('<div/>', {class: 'check-box'});
    var $input = $('<input/>', {type: 'checkbox', value: '0', id: desc, name: ''});
    $input.prop('checked', true);
    var $label = $('<label/>', {for: desc});
    $option.append($input);
    $option.append($label);
    return $option;
}

function genFullOption(target, label, opt) {
    target.append(genLabel(label));
    target.append(genOption(opt));
}

var t = setInterval(interval, 10);

function addWell(actual, expected)
{
  var mods = $("#mods .mod").map(function(){ return $(this).text()}).toArray().join(", ");
  var def = $("#meaning").text();
  if(!def)
    return;

  var w = $('<div/>').addClass('wellitem');
  w.append(
    $("<span/>")
    .addClass("well-right")
    .append(def + " &mdash; ")
    .append(mods)
  );

  if(actual.localeCompare(expected) == 0)
  {
    w.addClass('correct').append(
      $("<span/>")
      .text(actual)
    );
  }
  else
  {
    w.addClass('skipped')
    .append(' ' + expected)
    .append(
      $('<span/>')
      .addClass('striken')
      .text(actual)
    );
  }

  $('#well').prepend(w);
}

function configString()
{
  return $("#option-menu input:checkbox:checked")
  .map(function(){
    return $(this).data('cfg')
  })
  .toArray()
  .reduce(function(a,b)
  {
    return a + b;
  }).toString(36);
}

function setConfig(str)
{
  str=""+str;
  if(!str.length) return;
  var bits = parseInt(""+str, 36, 10);
  $("#option-menu input:checkbox")
  .each(function(){
    var bval = +$(this).data('cfg');
    $(this).prop("checked", !!(bits & bval));
  });
}

function checkConfig(opts)
{
  var i, id;
  for(i=0; i < opts.length; i++)
  {
    id = '#opt-' + opts[i];
    if($(id).filter(":checked").length == 0)
    {
      return false;
    }
  }
  return true;
}

function filterSets(sets)
{
  var i=0, mods, terms;
  for(i; i < sets.length; i++)
  {
    sets[i][0] = sets[i][0].filter(filterMod);
  }

  return sets;
};

function filterMod(mod)
{
  var i, flags = mod.flag;
  if(!checkConfig(flags))
    return false;

  return true;
};
