'use strict';

var correct = 'にほん'

function submitAnswer() {
    if ($('#answer').val() == correct) {
        nextQuestion();
    }
}

function nextQuestion() {
    $('#answer').val('');
}