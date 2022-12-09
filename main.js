
//global variables
let pokeAPIurl = 'https://pokeapi.co/api/v2/pokemon/';  //the source api for data
let game = document.querySelector('#game');  //mainly used for css purposes
let youWinMsg = document.querySelector('#msgWinner');
let message = `<h1>"Winner, Winner, Pokemon Dinner!!!"</h1>`;

let startBtn = document.querySelector('#startBtn');  //start buttons to start timer
let stopBtn = document.querySelector('#stopBtn');  //stop button to stop timer
let minutes = document.querySelector('#minutes');  //displays minutes in game and changes as timer initiates and runs
let seconds = document.querySelector('#seconds');  //displays seconds in game and changes as timer initiates and runs
let totalSeconds = 0; //sets the timer to begin at 0
let totalScore = document.querySelector('#totalScore');  //holds total score for each match

let isPaused = true;  //used to prevent player from being able to select more than two cards at once.  
let firstPick;  //used to flag the first card user picks
let matches;  //counter to add matching cards
let check = null;  //variable points to timer to validate if timer has initiated


// variables not used
// let timerInterval;  //not used
// let timerStatus = true; //not used initially used to stop timer
// let timer = document.querySelector('#timer');  //not used initially used for timer functionality
// let restartBtn = document.querySelector('#button');  //not used initial thought was to use a restart button


//purpose of loadPokemon function is to fetch data from api
//loadPokemon uses a set function to only fetch non-duplicate data.  It fetches 10 pokemon.  
let loadPokemon = async () => {
    let randomIDs = new Set();  
    console.log(randomIDs);

    while(randomIDs.size < 10){
        let randomNumber = randNum();
        randomIDs.add(randomNumber);
    }
    console.log(randomIDs);
    let pokePromises = [...randomIDs].map(id => fetch(pokeAPIurl + id));
    let responses = await Promise.all(pokePromises);
    return await Promise.all(responses.map(response => response.json()));
}

//Initially used code below, but decided to try out the promises all method above
/*
    let randomPokeIDArray = [...randomIDs];
    for(let i = 0; i < randomPokeIDArray.length; i++) {
        let response = await fetch(pokeAPIurl + '1');
        let pokemon = await response.json();
        console.log(pokemon);  //Testing json output
       
    
    console.log([...randomIDs]);
    return randomPokeIDArray, pokemon
*/


//displayPokemon function uses another random method to reshuffle pokemon so that both card sets are not in same order.  Using .map method it iterates thru the randomized data, returning html elements with assigned properties/values, and storing in a variable (pokemonHTML).  The DOM gets updated by assigning <pokemonHTML> to the <game.innerHTML> variable.  <displayPokemon> will be called by the resetGame function in order to 

let displayPokemon = (pokemon) => {
   console.log(pokemon);  //Testing output
   pokemon.sort ( _ => Math.random() - 0.5);
   pokemon.map(pokemon => console.log(pokemon.name));
   let pokemonHTML = pokemon.map(pokemon => {

    
    return ` 
        <div class="card" onclick="clickCard(event)"
            data-pokename = "${pokemon.name}">
            <div class="front"></div>
            <div class="back rotated">
                
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt=${pokemon.name}/>
                <h1>${pokemon.name}</h1>
            </div>
        </div>

     
    `
   }).join('');
  
 game.innerHTML = pokemonHTML;

 
}

/*
Added event listener in order to click on the pokemon cards.  
User clicks two cards and they rotate (faceup/facedown).
Then a matching check is initatied to see if they are the same.  
If not same, then re-rotate.  
Used timer function.
True or False validation to flag rotation and prevent reselecting cards
*/

//clickCard function purpose is to accept a click event when user clicks the first card
let clickCard = (event) => {
    let pokemonCard = event.currentTarget;
    let [front, back] = getFrontBackCard(pokemonCard);  
    if (front.classList.contains('rotated') ) {
       
        return; 
    }
        isPaused = true;

        //first version used to update front/back card class elements.  Used an array instead.
        // front.classList.toggle('rotated');
        // back.classList.toggle('rotated');

        rotateElements([front, back]);  //function takes in the array and updated the rotation property
    

    //this if statement asks if this is not the first card then it is the second card selected.  
    if(!firstPick) {
        firstPick = pokemonCard;
        isPaused = false;
        } else {
            let secondPokemon = pokemonCard.dataset.pokename;
            let firstPokemon = firstPick.dataset.pokename;

            //if condition (if cards do not match) then flip back
            if(firstPokemon !== secondPokemon) {
                let [firstFront, firstBack] = getFrontBackCard(firstPick);
                setTimeout(() => { console.log('inside setTimeout');
                    rotateElements([front, back, firstFront, firstBack]);
                    firstPick = null;
                    isPaused = false;
                }, 500)
            }  else { //else if pokemon match, increment matches variable, update total score
                matches++;
                totalScore.innerHTML = matches;
                console.log(totalScore);
                if(matches === 10){ //if all pokemon match then call stopTimer(), Display message
                    stopTimer();
                    youWinMsg.style.visibility='visible';
                    // console.log("Winner, Winner, Pokemon Dinner!!!")

                }
                firstPick = null;
                isPaused = false;
            }
        }
    // console.log(event.currentTarget.dataset.pokemon); //testing clicked event output
}


//rotateElements function's purpose is to initiate rotation of cards by updating toggle method on the elements(cards).
let rotateElements = (elements) => { 
    /*console.log('inside rotate Elements funct');*/
    // if(typeof elements !== 'object' || !elements.length) return;
    elements.forEach(element => element.classList.toggle('rotated'));
    
}

//getFrontBackCard purpose is to help select the card elements.  It gets called within the clickCards function.
let getFrontBackCard = (card) => {
    let front = card.querySelector(".front");
    let back = card.querySelector(".back");
    return [front, back];
}

//pokemon.map(pokemon => console.log(pokemon.name)); //testing output

//pad function's purpose is to increment  the timer's seconds and minutes accordingly.
let pad = (val) => { 
    // console.log(val);  //testing 
    return val > 9 ? val : '0' + val;
}


//startTimer function's purpose is to initiate a timer by using the setInterval method and using the milliseconds.  I set this to interval of 1000 milliseconds.
let startTimer = () => {

    //Attempt to change visibility of start/stop buttons.  If <Start timer btn> clicked then display <Stop timer btn> and hides <Start timer btn>
    // if (check === null){
    //     stopBtn.style.visibility = 'visible';
    // } else {
    //     stopBtn.style.visibility = 'visible';
    // }
    
    check = setInterval( function() {
    seconds.innerHTML = pad(++totalSeconds%60);
    minutes.innerHTML = pad(parseInt(totalSeconds/60,10));
}, 1000);

    //Attempt to change visibility of start/stop buttons.  If <Stop timer btn> clicked then display <Start timer btn> and hides <Stop timer btn>
    // if (!timerStatus) {
    //     startBtn.innerHTML = 'Start timer';
    //     stopTimer();
    // }
    // restartBtn.setAttribute('onclick', null); \\might not need this after I refactor
}


// stop timer function's purpose is to stop the timer (clearInterval)
let stopTimer = () => {

        clearInterval(check);
        
        //continued...Attempt to change visibility of start/stop buttons.  If <Stop timer btn> clicked then display <Start timer btn> and hides <Stop timer btn>

        // startBtn.style.visibility = 'visible';
    } 


//resetGame function's purpose is to resets all variables and html elements in order to restart a game.  The setTimout function calls displayPokemon with two paramaters which returns to sets of pokemon.  Used milliseconds of 1000 time to reset game.
//
let resetGame = async () => {
    totalSeconds = 0;
    check = null;
    stopTimer();
    seconds.innerHTML = '00';
    minutes.innerHTML = '00';
    game.innerHTML = '';
    isPaused = true;
    firstPick = null;
    matches = 0;
    totalScore.innerHTML = 0;
    youWinMsg.style.visibility='hidden';

    setTimeout( async() => {
        let pokemon = await loadPokemon();     
        displayPokemon([...pokemon, ...pokemon]);
        isPaused = false;
       
        // console.log('in resetGame function');//testing
   
    },1000)
}

//random function to randomize the return of pokemons in the api fetch call
let  randNum = () => {
    let randomNumber = Math.ceil(Math.random() * 500);
    return randomNumber;
}

//resetGame function call.  In lieu of using the Fetch Pokemon Button.  Only use one or the other.
// resetGame();




