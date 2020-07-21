function generateColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  var result = "rgb(" + r + ", " + g + ", " + b + ")";
  colorArray.push(result);
  return result;
}

function assignColors() {
  colorArray = [];
  newColorBtn.innerHTML = "NEW COLORS";
  headContainer.style.backgroundColor = '#3f75b2';
  gameText.style.visibility = 'hidden';
  for (i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = generateColor();
  }
  selectGameColor();
}

function selectGameColor() {
  if (easyFlag) {
    var i = Math.floor(Math.random() * 3);
  }
  else {
    var i = Math.floor(Math.random() * 6);
  }
  gameColor = colorArray[i];
  rgbValueTitle.innerHTML = gameColor;
}

function checkClick() {
  for (var i = 0; i < squares.length; i++) {
    (function (x) {
      squares[x].addEventListener('click', function () {
        if (squares[x].style.backgroundColor == gameColor) {
          correctAnswer();
        }
        else {
          gameText.style.visibility = 'visible';
          gameText.innerHTML = "Try Again!";
          squares[x].style.visibility = 'hidden';
        }
      });
    })(i)
  }
}

function correctAnswer() {
  for (i = 0; i < squares.length; i++) {
    squares[i].style.visibility = 'visible';
    squares[i].style.backgroundColor = gameColor;
  }
  gameText.innerHTML = 'Correct!';
  newColorBtn.innerHTML = "Play Again?";
  headContainer.style.backgroundColor = gameColor;
}


var gameColor;

var colorArray = [];
var rgbValueTitle = document.querySelector('.rgb-value');

var gameText = document.querySelector('#game-text');

var headContainer = document.querySelector('.head-container');

var easyFlag = false;


var easyButton = document.querySelector('#easy');
easyButton.addEventListener('click', function () {
  easyButton.classList.add('selected');
  hardButton.classList.remove('selected');
  easyFlag = true;
  colorArray.length = 3;
  squares.length = 3;
  assignColors();
  for (i = 0; i < 3; i++) {
    squares[i].style.visibility = 'visible';
    squares[i].style.display = 'block';
  }
  for (i = 3; i < squares.length; i++) {
    squares[i].style.display = 'none';
  }
});


var hardButton = document.querySelector('#hard');
hardButton.classList.add('selected');
hardButton.addEventListener('click', function () {
  hardButton.classList.add('selected');
  easyButton.classList.remove('selected');
  colorArray.length = 6;
  squares.length = 6;
  assignColors();
  for (i = 0; i < squares.length; i++) {
    squares[i].style.display = 'block';
    squares[i].style.visibility = 'visible';
  }
});

var newColorBtn = document.querySelector('#new-colors')
newColorBtn.addEventListener('click', assignColors);

var squares = document.querySelectorAll(".squares");
assignColors();
checkClick();





