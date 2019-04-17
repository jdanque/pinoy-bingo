const NUMS_B = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const NUMS_I = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const NUMS_N = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const NUMS_G = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const NUMS_O = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];

/**
 * General functions
 */
function getNumberIndex(n) {
  return n > 15 ? getNumberIndex(n - 15) : n;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getColumnCardNumbers(nums) {
  let arr = nums.slice(0),
    maxCardsLength = 5,
    i = 0,
    result = [];

  for (i = 0; i < maxCardsLength; i++) {
    let rIndex = getRandomInt(0, arr.length);
    result.push(arr[rIndex]);
    arr.splice(rIndex, 1);
  }
  return result;
}

function initSelectionButtons() {
  let displayNone = "d-none";
  $(".selection").on("click", ".quicklink", function() {
    let value = $(this).attr("data-value");
    if (!$(this).hasClass("or")) {
      $(".bingo-container").toggleClass(displayNone, true);
      $(`.bingo-container.${value}`).toggleClass(displayNone, false);
    }
  });
}
/**
 * Player functions
 */
var PLAYER = {
  initClickMarkCell: () => {
    $(".player-card-deck").on(
      "click",
      ".bingo-card tbody > tr > td",
      function() {
        let _this = $(this);
        if (!_this.hasClass("bingo-card__cell--free")) {
          _this.toggleClass("bingo-card__cell--marked");
        }
      }
    );
  },
  initCloseCardButton: () => {
    $(".player-card-deck").on("click", ".bingo-card__close", function() {
      $(this)
        .closest(".bingo-card")
        .remove();
    });
  },

  initAddCardButton: () => {
    $(".btn-addcard").on("click", function() {
      let cardColors = [
        "black",
        "red",
        "blue",
        "violet",
        "orange",
        "yellow",
        "green"
      ];
      let cardColor =
        cardColors[Math.floor(Math.random() * Math.floor(cardColors.length))];
      const BINGO_CARD = "bingo-card";

      let card = $(".bingo-card.bingo-card--sample").clone();
      card.toggleClass(`${BINGO_CARD}--sample d-none`, false);
      card.toggleClass(`${BINGO_CARD}--${cardColor}`, true);

      let cardNums = [
        getColumnCardNumbers(NUMS_B),
        getColumnCardNumbers(NUMS_I),
        getColumnCardNumbers(NUMS_N),
        getColumnCardNumbers(NUMS_G),
        getColumnCardNumbers(NUMS_O)
      ];

      for (var i = 0; i < 5; i++) {
        let cardRow = card.find(`tbody>tr:eq(${i})`);
        for (var j = 0; j < 5; j++) {
          let cardCell = cardRow.find(`td:eq(${j})`);
          if (!cardCell.hasClass("bingo-card__cell--free")) {
            cardCell.html(cardNums[j][i]);
          }
        }
      }

      $(".player-card-deck").append(card);
    });
  },

  init: () => {
    PLAYER.initAddCardButton();
    PLAYER.initCloseCardButton();
    PLAYER.initClickMarkCell();
  }
};

/**
 * Game functions
 */
var GAME = {
  balls: {
    available: [],
    unavailable: []
  },
  reset: () => {
    GAME.balls.available = [];
    GAME.balls.unavailable = [];

    GAME.addToAvailableBalls(NUMS_B, "B", 0);
    GAME.addToAvailableBalls(NUMS_I, "I", 1);
    GAME.addToAvailableBalls(NUMS_N, "N", 2);
    GAME.addToAvailableBalls(NUMS_G, "G", 3);
    GAME.addToAvailableBalls(NUMS_O, "O", 4);

    let $gameBoard = $(".caller-balls>table>tbody");
    $gameBoard.html("");

    let gameBoardHtml = "";
    gameBoardHtml += GAME.appendToGameBoardStr(NUMS_B, "B");
    gameBoardHtml += GAME.appendToGameBoardStr(NUMS_I, "I");
    gameBoardHtml += GAME.appendToGameBoardStr(NUMS_N, "N");
    gameBoardHtml += GAME.appendToGameBoardStr(NUMS_G, "G");
    gameBoardHtml += GAME.appendToGameBoardStr(NUMS_O, "O");
    $gameBoard.html(gameBoardHtml);
  },
  appendToGameBoardStr: (nums, letter) => {
    let headerTd = `<td class="gameBoardHeader">${letter}</td>`;
    let ballsTd = _.join(
      _.map(
        nums.slice(0),
        n => `<td><div class="ball">${letter}${n}</div></td>`
      ),
      ""
    );

    return `<tr>${headerTd}${ballsTd}</tr>`;
  },
  addToAvailableBalls: (nums, letter, letterIndex) => {
    GAME.balls.available = GAME.balls.available.concat(
      _.map(nums.slice(0), n => {
        return { value: `${letter}${n}`, letterIndex: letterIndex, number: n };
      })
    );
  },
  drawBall: () => {
    if (GAME.balls.available.length == 0) {
      return {};
    }

    let i = getRandomInt(0, GAME.balls.available.length);
    let ball = GAME.balls.available[i];

    GAME.balls.unavailable.push(ball);
    GAME.balls.available.splice(i, 1);

    return ball;
  },
  toggleGameBoardBall: (isDrawn, ball) => {
    let numberIndex = getNumberIndex(ball.number);
    $(
      `.caller-balls>table>tbody>tr:eq(${
        ball.letterIndex
      })>td:eq(${numberIndex}) .ball`
    ).toggleClass("ball--drawn", isDrawn);
  }
};

/**
 * Caller functions
 */
var CALLER = {
  drawGameBall: () => {
    if (GAME.balls.available.length > 0) {
      let ball = GAME.drawBall();
      $(".caller-deck .bigball").html(
        `<div class="ball-number" data-number="${ball.value}">`
      );
      GAME.toggleGameBoardBall(true, ball);
    }
  },
  initButtons: () => {
    $(".btn-reset").on("click", function() {
      GAME.reset();
      $(".caller-deck .bigball").html("");
    });

    $(".bigball").on("click", CALLER.drawGameBall);
  },

  init: () => {
    CALLER.initButtons();
    GAME.reset();
  }
};

$(document).ready(function() {
  initSelectionButtons();
  PLAYER.init();
  CALLER.init();
});
