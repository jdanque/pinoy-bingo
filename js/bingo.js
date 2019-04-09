function initSelectionButtons() {
  let displayNone = "d-none";
  $(".selection").on("click", ".quicklink", function() {
    let value = $(this).attr("data-value");
    $(".bingo-container").toggleClass(displayNone, true);
    $(`.container.${value}`).toggleClass(displayNone, false);
  });
}

function initAddCardButton() {
  $(".btn-addcard").on("click", function() {});
}

$(document).ready(function() {
  initSelectionButtons();
  initAddCardButton();
});
