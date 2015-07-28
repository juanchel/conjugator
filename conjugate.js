'use strict';

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
    var word = ichidan[Math.floor(Math.random() * ichidan.length)];
    correct = conjugate(word, 0);
    console.log(correct);
    $('#question-word').text(word);
    $('#answer').val('');
}

function conjugate(word, mods) {
    var res = word.substring(0, word.length - 1) + 'た';
    return res;
}

var ichidan = ['たべる', 'ねる', 'しんじる', 'ねる', 'おきる', 'きる', 'でる', 'かける'];