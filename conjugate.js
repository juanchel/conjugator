'use strict';

var ICHIDAN = 1;

var correct = 'たべる';

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
        nextQuestion();
    }
}

function nextQuestion() {
    var type = pickType();
    var word = ichidan[Math.floor(Math.random() * ichidan.length)];
    var modList = pickMods();
    correct = conjugate(word, 0);
    console.log(correct);
    $('#question-word').text(word);
    $('#answer').val('');
}

function pickType() {
    return ICHIDAN;
}

function pickMods() {
    return 0;
}

function trimLast() {
    return trimLast(word);
}

function conjugate(word, mods) {
    var res = trimLast(word) + 'た';
    return res;
}

function ichiPolite(word) {
    return trimLast(word) + 'ます';
}

function ichiPast(word) {
    return trimLast(word) + 'た'; 
}

function ichiNegative(word) {
    return trimLast(word) + 'ない';
}

function ichiTe(word) {
    return trimLast(word) + 'て';
}

function ichiCause(word) {
    return trimLast(word) + 'させる';
}

function ichiPass(word) {
    return trimLast(word) + 'られる';
}

function ichiPotential(word) {
    return trimLast(word) + 'られる'
}

function adjPast(word) {
    return trimLast(word) + 'かった';
}

var ichidan = ['たべる', 'ねる', 'しんじる', 'ねる', 'おきる', 'きる', 'でる', 'かける'];