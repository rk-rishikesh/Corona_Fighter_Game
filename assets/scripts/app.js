/* HOME SCREEN*/
const homeScreen = document.getElementById('screen-one');
homeScreen.classList.add("visible");
const startGameButton = homeScreen.querySelector(".btn-start");




/* GAME SCREEN */

let ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 20;
const CORONA_MEGA_ATTACK_VALUE = 40;
const CORONA_ATTACK_VALUE = 15;
const HEAL_VALUE = 60;
const BONUS_VALUE = 50;

const LOG_EVENT_PLAYER_ATTACK = "PLAYER ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER STRONG ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER HEALED";
const LOG_EVENT_CORONA_ATTACK = "CORONA ATTACK";
const LOG_EVENT_PLAYER_VACCINATED = "PLAYER VACCINATED";
const LOG_EVENT_GAME_OVER = "GAME OVER";

let chosenMaxLife = 100;
let currentCoronaHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let battleLog = [];
let vaccinated = false;
let vaccineCount = 0;
let maskWarningCount = 0;



const gameScreen = document.getElementById('screen-two');
// gameScreen.classList.add("visible");
const startGame = () => {
  homeScreen.classList.remove("visible");
  gameScreen.classList.add("visible");
};

startGameButton.addEventListener("click", startGame);


//Accessing Delete Modal
const deleteMessageModel = document.getElementById("message-modal");
//Access close Button
const closeMessageModalButton =
  deleteMessageModel.querySelector(".btn--passive");

//Access VS tag
const maskAttack = document.getElementById("maskAttack-modal");
const sanitizerAttack = document.getElementById("sanitizerAttack-modal");

const healModel = document.getElementById("heal-modal");
const vaccineModel = document.getElementById("vaccine-modal");
//vaccineModel.classList.add("visible");
const deleteBackdrophandler = () => {
  removeDeleteWarning();
};

const removeDeleteWarning = () => {
  deleteMessageModel.classList.remove("visible");
};

const warningHandler = () => {
  if(maskWarningCount === 0){
    deleteMessageModel.classList.add("visible");
    closeMessageModalButton.addEventListener("click", removeDeleteWarning);
  }
  maskWarningCount = 1;  
};

//const userName = prompt('Enter your name', '')
// Set max value of health bar
adjustHealthBars(chosenMaxLife);

function writeToLog(_event, _value, _playerHealth, _coronaHealth) {
  let logEntry;

  /* USING SWITCH CASE */
  switch (_event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: _event,
        damage: _value,
        target: "CORONA",
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: _event,
        damage: _value,
        target: "CORONA",
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: _event,
        value: _value,
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_CORONA_ATTACK:
      logEntry = {
        event: _event,
        damage: _value,
        target: "PLAYER",
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: _event,
        result: _value,
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}

function reset() {
  currentCoronaHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  //Corona attacking Player
  const playerDamage = dealPlayerDamage(CORONA_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_CORONA_ATTACK,
    CORONA_ATTACK_VALUE,
    currentPlayerHealth,
    currentCoronaHealth
  );

  if (currentPlayerHealth <= 0 && vaccinated) {
    vaccinated = false;
    //removeBonusLife();

    increasePlayerHealth(BONUS_VALUE);
    currentPlayerHealth += BONUS_VALUE;

    alert("Bonous Life activated!! Thanks to vaccine");
    setPlayerHealth(initialPlayerHealth + BONUS_VALUE);
  }

  if (currentCoronaHealth <= 0 && currentPlayerHealth > 0) {
    // alert("YOU WON !");
    vaccineCount = 0;
    maskWarningCount = 0;
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentPlayerHealth,
      currentCoronaHealth
    );
    gameScreen.classList.remove("visible");
    scoreBoardScreen.classList.add("visible");
    
  } else if (currentPlayerHealth <= 0 && currentCoronaHealth > 0) {
    // alert("YOU LOST !");
    vaccineCount = 0;
    maskWarningCount = 0;
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "CORONA WON",
      currentPlayerHealth,
      currentCoronaHealth
    );
    gameScreen.classList.remove("visible");
    scoreBoardScreen.classList.add("visible");
  } else if (currentCoronaHealth <= 0 && currentPlayerHealth <= 0) {
    // alert("MATCH DRAWN !");
    vaccineCount = 0;
    maskWarningCount = 0;
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MATCH DRAWN",
      currentPlayerHealth,
      currentCoronaHealth
    );
    gameScreen.classList.remove("visible");
    scoreBoardScreen.classList.add("visible");
  }

  if (currentPlayerHealth <= 0 || currentCoronaHealth <= 0) {
    reset();
  }
}

function walkHandler() {
  const playerDamage = dealPlayerDamage(CORONA_MEGA_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_CORONA_ATTACK,
    CORONA_MEGA_ATTACK_VALUE,
    currentPlayerHealth,
    currentCoronaHealth
  );

  endRound();
}

function attack(mode) {
  let maxAttackValue;
  let logEvent;
  let attackType;

  if (mode === "ATTACK") {
    console.log(ATTACK_VALUE);
    maxAttackValue = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
    attackType = maskAttack;
    ATTACK_VALUE -= 5;
    if (ATTACK_VALUE < 0) {
      warningHandler();
    }
  } else if (mode === "STRONG ATTACK") {
    maxAttackValue = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    attackType = sanitizerAttack;
  }

  //Player attacking CORONA
  const coronaDamage = dealCoronaDamage(maxAttackValue);
  attackType.classList.add("visible");
  setTimeout(() => {
    attackType.classList.remove("visible");
  }, 500);

  currentCoronaHealth -= coronaDamage;
  writeToLog(
    logEvent,
    maxAttackValue,
    currentPlayerHealth,
    currentCoronaHealth
  );
  endRound();
}

function attackHandler() {
  attack("ATTACK");
}

function strongAttackHandler() {
  attack("STRONG ATTACK");
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  healModel.classList.add("visible");
  setTimeout(() => {
    healModel.classList.remove("visible");
  }, 1000);
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentPlayerHealth,
    currentCoronaHealth
  );

  //Player attacking CORONA
  const coronaDamage = dealCoronaDamage(STRONG_ATTACK_VALUE);
  currentCoronaHealth -= coronaDamage;
  writeToLog(
    LOG_EVENT_PLAYER_STRONG_ATTACK,
    STRONG_ATTACK_VALUE,
    currentPlayerHealth,
    currentCoronaHealth
  );
  endRound();
}

function vaccineHandler() {
  vaccineCount += 1;

  if (vaccineCount == 1) {
    vaccinated = true;

    writeToLog(
      LOG_EVENT_PLAYER_VACCINATED,
      "BONUS LIFE GRANTED",
      currentPlayerHealth,
      currentCoronaHealth
    );
    alert("Vaccinated!!");
  } else {
    alert("Vaccine Bonus already used !!");
  }
}

function displayLog() {
  console.log(battleLog);
}

/*
function scoreBoard(){
  maskAttack :
  SanitizerAttack:
  VaccineBonus:
  HealedUp:
}
*/

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
//logBtn.addEventListener("click", displayLog);
walkBtn.addEventListener("click", walkHandler);
vaccineBtn.addEventListener("click", vaccineHandler);


/* SCOREBOARD SCREEN*/
const scoreBoardScreen = document.getElementById('screen-three');
const restartGame = () => {
  scoreBoardScreen.classList.remove("visible");
  homeScreen.classList.add("visible");
};
const restartGameButton = scoreBoardScreen.querySelector(".btn--passive");
restartGameButton.addEventListener("click", restartGame);