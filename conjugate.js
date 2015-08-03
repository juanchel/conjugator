'use strict';

$(document).ready(function() {
    // Stop the user from pressing enter in the text area
    $('textarea').bind('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
            $(this).parents('form').submit();
            return false;
        }
    });

    $('#play').click(function() {
        nextQuestion();
        $('#start-screen').animate({top: '-1000px'}, 800);
        $('#main').show();
        $('#main').animate({'margin-top': '60px'}, 800);
    });
});

var correct = '';

function Question(word) {
    this.word = word;
    this.base = word;
    this.modList = ['Base word'];
}

function Term(word, ruby, def) {
    this.word = word;
    this.ruby = ruby;
    this.def = def;
}

Question.prototype.modify = function(modSet) {
    // Pick and apply a random mod
    var modifier = fetchRandom(modSet);
    this.word = modifier.modFunc(this.word);
    this.modList.push.apply(this.modList, modifier.desc);

    // If theres a next mod, apply it too
    if (modifier.nextMod != null) {
        this.modify(modifier.nextMod);
    }
}

// Fetches a random element of an array
function fetchRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function submitAnswer() {
    if ($('#answer').val() == correct) {
        $('#answer').addClass('flash');
        setTimeout(function(){
            $("#answer").removeClass('flash');
        }, 300);
        nextQuestion();
    }
}

function nextQuestion() {
    var type = pickType();
    var term;
    if (type == ICHIDAN) {  
        var term = ichidan[Math.floor(Math.random() * ichidan.length)];
        $('#part').text('v. ')
    }
    var question = new Question(term.word);
    question.modify(type);
    correct = question.word;

    console.log(correct);
    $('#question-word').html(term.ruby);
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
function pickType() {
    return ICHIDAN;
}

// Returns the word without the last kana
function trimLast(word) {
    return word.substring(0, word.length - 1);
}

var ichidan = [
    new Term('たべる', '<ruby>食<rt>た</rt></ruby>べる</span>', 'to eat'),
    new Term('ねる', '<ruby>寝<rt>ね</rt></ruby>る', 'to sleep; to lie down'),
    new Term('しんじる', '<ruby>信<rt>しん</rt></ruby>じる', 'to believe'),
    new Term('おきる', '<ruby>起<rt>お</rt></ruby>きる', 'to wake up; to occur'),
    new Term('きる', '<ruby>着<rt>き</rt></ruby>る', 'to wear'),
    new Term('でる', '<ruby>出<rt>で</rt></ruby>る', 'to leave; to come out'),
    new Term('かける', '<ruby>掛<rt>か</rt></ruby>ける', 'to hang'),
]
