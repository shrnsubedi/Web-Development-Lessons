/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores,roundScore,activePlayer,diceFace,currentScore,currentPlayer;
var gamePlaying;

init();

diceImage=document.querySelector(".dice");
queryChange();

function init(){
	gamePlaying=true;
	scores=[0,0];
	currentScore=0;
	roundScore=0;
	activePlayer=0;

	document.querySelector('.dice').style.display='none';

	document.querySelector("#current-0").innerHTML=0;
	document.querySelector("#score-0").innerHTML=0;
	document.querySelector("#current-1").innerHTML=0;
	document.querySelector("#score-1").innerHTML=0;

	document.querySelector('#name-0').textContent="Player-1!!";
	document.querySelector('#name-1').textContent="Player-2!!";



}

// Change player turn 
function changePlayer(){
	currentScore=0;
	currentPlayer.innerHTML=currentScore;
	document.querySelector('.player-'+activePlayer+'-panel').classList.remove('active');
	if(activePlayer==1)
		activePlayer=0;
	else
		activePlayer=1;
	document.querySelector('.player-'+activePlayer+'-panel').classList.add('active');

	queryChange();
}

//Change the current query selector to active player
function queryChange(){
	currentPlayer=document.querySelector("#current-"+ activePlayer);
	playerScore=document.querySelector("#score-"+ activePlayer);
}

//Getting the HTML elements and adding event Listeners

document.querySelector(".btn-new").addEventListener("click",function(){
	init();
});

document.querySelector(".btn-roll").addEventListener("click",function(){
	if(!gamePlaying){

	}
	else{
			//display the dice
		document.querySelector('.dice').style.display='block';
		//Get a random dice roll
		diceFace= Math.floor(Math.random()*6+1);
		//Change the image to respective dice face
		diceImage.src="dice-"+diceFace+".png";
		//If the dice face reads one, the turn is changed
		if(diceFace===1){
			changePlayer();
		}
		else{
			currentScore+=diceFace;
			currentPlayer.innerHTML=currentScore;
		}
	}
});

document.querySelector(".btn-hold").addEventListener("click",function(){
	if(!gamePlaying){

	}
	else{
		scores[activePlayer]+=currentScore;
		playerScore.innerHTML=scores[activePlayer];
		document.querySelector('.dice').style.display='none';
		if(scores[activePlayer]>=20){
			gamePlaying=false;
			document.querySelector('#name-'+ activePlayer).textContent="Winner!!";
		}
		else{
			changePlayer();
		}
	}
	
});



