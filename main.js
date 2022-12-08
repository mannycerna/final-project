
//global variables
let game = document.querySelector('#game');
// let timer = document.querySelector('#timer');
// let restartBtn = document.querySelector('#button');
let minutes = document.querySelector('#minutes');
let seconds = document.querySelector('#seconds');
let totalSeconds = 0;
let totalScore = document.querySelector('#totalScore');

let pokeAPIurl = 'https://pokeapi.co/api/v2/pokemon/';
let isPaused = true;
let firstPick;
let matches;
let timerInterval;
let check = null;


//fetch data from api
//used set to handle duplicates when retrieving random data
let loadPokemon = async () => {
    let randomIDs = new Set();  
    console.log(randomIDs);

    while(randomIDs.size < 10){
        let randomNumber = randNum();
        randomIDs.add(randomNumber);
    }

    let pokePromises = [...randomIDs].map(id => fetch(pokeAPIurl + id));
    let responses = await Promise.all(pokePromises);
    return await Promise.all(responses.map(response => response.json()));
}

    //used promises all 
    // let randomPokeIDArray = [...randomIDs];
    // for(let i = 0; i < randomPokeIDArray.length; i++) {
    //     let response = await fetch(pokeAPIurl + '1');
    //     let pokemon = await response.json();
    //     console.log(pokemon);  //Testing json output
       
    
    // console.log([...randomIDs]);
    // return randomPokeIDArray, pokemon

//once json data is fetched this function uses another random method to retrieve 2 sets of 10 pokemon.  Retruns html used in creating the cards.

let displayPokemon = (pokemon) => {
   console.log(pokemon);
   pokemon.sort ( _ => Math.random() - 0.5);
   pokemon.map(pokemon => console.log(pokemon.name));
   let pokemonHTML = pokemon.map(pokemon => {

    
    return ` 
        <div class="card" onclick="clickCard(event)"
            data-pokename = "${pokemon.name}">
            <div class="front"></div>
            <div class="back rotated">
                
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt=${pokemon.name}/>
                <h2>${pokemon.name}</h2>
            </div>
        </div>

     
    `
   }).join('');
  
 game.innerHTML = pokemonHTML;

 
}

/*Added event listener in order to click on the pokemon cards.  
User clicks two cards and they rotate (faceup/facedown).
Then a matching check is initatied to see if they are the same.  
If not same, then re-rotate.  
Used timer function.
True or False validation to flag rotation and prevent reselecting cards



*/
let clickCard = (event) => {
    let pokemonCard = event.currentTarget;
    let [front, back] = getFrontBackCard(pokemonCard);  
    if (front.classList.contains('rotated') ) {
        return; 
    }
        isPaused = true;

        // front.classList.toggle('rotated');
        // back.classList.toggle('rotated');

        rotateElements([front, back]);
    
    if(!firstPick) {
        firstPick = pokemonCard;
        isPaused = false;
        } else {
            let secondPokemon = pokemonCard.dataset.pokename;
            let firstPokemon = firstPick.dataset.pokename;

            if(firstPokemon !== secondPokemon) {
                let [firstFront, firstBack] = getFrontBackCard(firstPick);
                setTimeout(() => { console.log('inside setTimeout');
                    rotateElements([front, back, firstFront, firstBack]);
                    firstPick = null;
                    isPaused = false;
                }, 500)
            }  else {
                matches++;
                totalScore.innerHTML = matches;
                console.log(totalScore);
                if(matches === 10){
                    stopTimer();
                    console.log("Winner, Winner, Pokemon Dinner!!!")

                }
                firstPick = null;
                isPaused = false;
            }
        }
    // console.log(event.currentTarget.dataset.pokemon); //testing clicked event output
}
//function to initiate the rotation of cards by updating toggle method on the elements(cards).
let rotateElements = (elements) => { /*console.log('inside rotate Elements funct');*/
    // if(typeof elements !== 'object' || !elements.length) return;
    elements.forEach(element => element.classList.toggle('rotated'));
    
}

//helper function selects the card elements
let getFrontBackCard = (card) => {
    let front = card.querySelector(".front");
    let back = card.querySelector(".back");
    return [front, back];
}

//    pokemon.map(pokemon => console.log(pokemon.name)); //testing output


let pad = (val) => { 
    return val > 9 ? val : '0' + val;
}

let startTimer = () => {
check = setInterval( function() {
    seconds.innerHTML = pad(++totalSeconds%60);
    minutes.innerHTML = pad(parseInt(totalSeconds/60,10));
}, 1000);
    // restartBtn.setAttribute('onclick', null); \\might not need this after I refactor
}

let stopTimer = () => {
    clearInterval(check);
}


// let startTimer  = () => {
//     setInterval(startTimer, 1000);
//     ++totalSeconds;
//     seconds.innerHTML = pad(totalSeconds % 60);
//     minutes.innerHTML = pad(parseInt(totalSeconds / 60));
    
// }

// let pad = (val) => {
//     let valString = val + '';
//     if (valString.length < 2){
//         return '0' + valString;
//     } else {
//         return valString;
//     }
// }
// setInterval(startTimer, 1000);
// let timeTracker = setInterval(setTimer, 1000);

// startTimer();

//reset button resets all variables and html elements in order to restart a game
let resetGame = async () => {
    totalSeconds = 0;
    // startTimer();
    clearInterval();
    setTimeout( async() => {
        let pokemon = await loadPokemon();     
        displayPokemon([...pokemon, ...pokemon]);
        isPaused = false;
        // startTimer()
    // console.log('in reset');//testing
   
    },1000)
    game.innerHTML = '';
    isPaused = true;
    firstPick = null;
    matches = 0;
    

    
}



//random function to randomize the return of pokemons in the api fetch call
let  randNum = () => {
    let randomNumber = Math.ceil(Math.random() * 500);
    return randomNumber;
}


//resetGame function call
// resetGame();




