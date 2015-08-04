'use strict';

var score = 0;
var time = 0;
var timemax = 15;
var correct = '';

$(document).ready(function() {
    // Stop the user from pressing enter in the text area
    $('textarea').bind('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
            $(this).parents('form').submit();
            return false;
        }
    });

    // When the play button is clicked
    $('#play').click(function() {
        nextQuestion();
        $('#start-screen').animate({top: '-1000px'}, 800);
        $('#main').show();
        $('#main').animate({'margin-top': '20px'}, 800);
        $('#title-text').animate({'width': '350px', 'font-size': '20pt', 'height': '40px', 'bottom': '5px', 'margin-bottom': '0px'}, 800);
        $('#title').animate({'height': '50px'}, 800);
    });
});

function Question(word) {
    this.word = word;
    this.base = word;
    this.modList = ['Base word'];
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

// Check if the answer is correct every time a character is typed
function submitAnswer() {
    if ($('#answer').val() == correct) {
        $('#answer').addClass('flash');
        setTimeout(function(){
            $("#answer").removeClass('flash');
        }, 300);
        setTimeBar(100);
        nextQuestion();
    }
}

function setTimeBar(percent) {
    $('#time-bar').css('background-image', 'linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-o-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-moz-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-webkit-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
    $('#time-bar').css('background-image', '-ms-linear-gradient(left, #3498db ' + percent + '%, #ecf0f1 ' + percent + '%)');
}

// Generate a new question
function nextQuestion() {
    time = 100 * timemax;

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

// Timer function called 100 times per second
function interval() {
    time--;
    setTimeBar(time/timemax);
}

var t = setInterval(interval, 10);