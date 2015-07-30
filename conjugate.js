'use strict';

var ICHIDAN = 1;

var correct = 'たべる';

function Modifier(modFunc, desc, nextMod) {
    this.modFunc = modFunc;
    this.desc = desc;
    this.nextMod = nextMod; 
}

function Question(word) {
    this.word = word;
    this.base = word;
    this.modList = ['Base word'];
}

Question.prototype.modify = function(modSet) {
    var modifier = fetchRandom(modSet);
    this.word = modifier.modFunc(this.word);
    this.modList.push.apply(this.modList, modifier.desc);
    if (modifier.nextMod != null) {
        this.modify(modifier.nextMod);
    }
}

function fetchRandom(obj) {
    var tempKey, keys = [];
    for(tempKey in obj) {
       if(obj.hasOwnProperty(tempKey)) {
           keys.push(tempKey);
       }
    }
    return obj[keys[Math.floor(Math.random() * keys.length)]];
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
    }, ['て form'], null),
    'poten': new Modifier(function(w) {
        return trimLast(w) + 'られる';
    }, ['Potential form'], ICHIVERB),
    'pass': new Modifier(function(w) {
        return trimLast(w) + 'られる';
    }, ['Passive form'], ICHIVERB),
    'cause': new Modifier(function(w) {
        return trimLast(w) + 'させる';
    }, ['Causitive form'], ICHIVERB),
    'pass cause': new Modifier(function(w) {
        return trimLast(w) + 'させられる';
    }, ['Causitive form', 'Passive form'], ICHIVERB),
}

$(document).ready(function() {
    $('textarea').bind('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
            $(this).parents('form').submit();
            return false;
        }
    }); 
});

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
    var word = ichidan[Math.floor(Math.random() * ichidan.length)];
    var question = new Question(word);
    question.modify(type);
    correct = question.word;

    console.log(correct);
    $('#question-word').text(word);
    $('#mods .mod').remove();
    fadeInMods(question.modList);
    $('#answer').val('');

}

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

function pickType() {
    return ICHIDAN;
}

function trimLast(word) {
    return word.substring(0, word.length - 1);
}

var ichidan = ['たべる', 'ねる', 'しんじる', 'ねる', 'おきる', 'きる', 'でる', 'かける'];
