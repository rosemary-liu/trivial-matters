/* global data */
/* exported data */
var $buttonContainer = document.querySelector('.button-container');
var $buttons = document.querySelectorAll('button.clue');
var $modal = document.querySelector('.modal-off');
var $views = document.querySelectorAll('.view');
var $clue = document.querySelector('.clue-text');
var $answer = document.querySelector('.answer');
var $points = document.querySelector('.points');
var $yesButton = document.querySelector('#yes');
var $noButton = document.querySelector('#no');
var $qCorrectHeader = document.querySelector('span.q-correct');
var $pointsHeader = document.querySelector('span.score');
var buttonTarget;
var $favoriteContainer = document.querySelector('.favorite');
var $favoriteButton = document.querySelector('button.fa');
var $starIcon = document.querySelector('.fa-star');
var $returnButton = document.querySelector('#return');

function getClues() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://jservice.io/api/random/?count=9');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.length; i++) {
      var clueData = {
      };
      clueData.question = xhr.response[i].question;
      clueData.answer = xhr.response[i].answer;
      clueData.points = xhr.response[i].value;
      clueData.completed = null;
      clueData.favorite = null;
      clueData.correct = null;
      clueData.entryId = data.nextEntryId;
      data.clues.push(clueData);
      data.nextEntryId++;
    }
  });
  xhr.send();
}

getClues();

$buttonContainer.addEventListener('click', openModal);

function openModal(event) {
  $modal.classList.remove('modal-off');
  $modal.classList.add('modal-on');
  buttonTarget = event.target;
  for (var i = 0; i < $buttons.length; i++) {
    if (buttonTarget === $buttons[i]) {
      if (data.clues[i].completed === 'yes') {
        returnToQuestions();
        return;
      } else {
        displayClue();
        return;
      }
    }
  }
}

function closeModal(event) {
  $modal.classList.remove('modal-on');
  $modal.classList.add('modal-off');
  resetView();
}

function displayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (parseInt(event.target.textContent) === data.clues[i].entryId) {
      $clue.textContent = data.clues[i].question;
      $answer.textContent = 'Answer: ' + data.clues[i].answer;
      $points.textContent = 'Points: ' + data.clues[i].points;
      data.currentlyAnswering = data.clues[i];
      return;
    }
  }
}

$modal.addEventListener('click', handleModal);

function handleModal(event) {
  var $modalOn = document.querySelector('.modal-on');
  if (event.target !== $modalOn) {
    for (var i = 0; i < $buttons.length; i++) {
      if (buttonTarget === $buttons[i] &&
      data.clues[i].completed === null) {
        showAnswer();
        return;
      }
    }
  } else {
    closeModal();
  }
}

function showAnswer() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'click-to-see-answer') {
      $views[i].classList.add('hidden');
    }
  }
  if ($favoriteContainer.classList.contains('hidden')) {
    $favoriteContainer.classList.remove('hidden');
  }
  // if question is in favorites array, make star yellow
}

// remove favorites star
function returnToQuestions() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'return') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'question' ||
      $views[i].getAttribute('data-modal') === 'click-to-see-answer' ||
      $views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.add('hidden');
    }
  }

  // $favoriteContainer.classList.add('hidden');
}

function handleYes() {
  data.currentlyAnswering.completed = 'yes';
  data.currentlyAnswering.correct = 'yes';
  data.score += data.currentlyAnswering.points;
  $qCorrectHeader.textContent = null;
  $pointsHeader.textContent = data.score;
  data.currentlyAnswering = null;
  grayClue();
  closeModal();

}

function handleNo() {
  data.currentlyAnswering.completed = 'yes';
  data.currentlyAnswering.correct = 'no';
  data.currentlyAnswering = null;
  grayClue();
  closeModal();

}

function resetView() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'question') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'click-to-see-answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.add('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'return') {
      $views[i].classList.add('hidden');
    }
  }

  if (!($favoriteContainer.classList.contains('hidden'))) {
    $favoriteContainer.classList.add('hidden');
  }
}

function grayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === 'yes') {
      $buttons[i].setAttribute('id', 'answered');
    }
  }
}

$yesButton.addEventListener('click', handleYes);
$noButton.addEventListener('click', handleNo);
$returnButton.addEventListener('click', closeModal);
$favoriteButton.addEventListener('click', handleFavorite);

// if favorite button clicked
// check if in favorites array
//
// make yellow background or gray
// update favorites array (match by entryId)

function yellowStar() {
  if (!($starIcon.classList.contains('fa-star-yellow'))) {
    $starIcon.classList.add('fa-star-yellow');
  }
  if ($starIcon.classList.contains('fa-star-gray')) {
    $starIcon.classList.remove('fa-star-gray');
  }
}

// function grayStar() {
//   if (!($starIcon.classList.contains('fa-star-gray'))) {
//     $starIcon.classList.add('fa-star-gray');
//   }
//   if ($starIcon.classList.contains('fa-star-yellow')) {
//     $starIcon.classList.remove('fa-star-yellow');
//   }
// }

function handleFavorite() {
  var buttonTargetId = parseInt(buttonTarget.textContent);
  // console.log('click event listener works');
  // console.log(typeof buttonTargetId, buttonTargetId);

  for (var i = 0; i < data.favorites.length; i++) {
    if (!(data.favorites[i].entryId === buttonTargetId)) {
      yellowStar();
      data.favorites.push(data.currentlyAnswering);

    }
  }

  //     for (var j = 0; j < data.favorites.length; j++) {
  //       if ((!data.favorites[j].includes(data.clues[i].entryId))) {
  //         yellowStar();
  //         // push to array
  //         console.log(data.favorites);
  //         data.favorites.push(data.currentlyAnswering);
  //         console.log(data.favorites);
  //         return;
  //       } else {
  //         grayStar();
  //         // splice from array
  //       }

  //     }
  //   }
  // }

}
