//Toggle the todo completion
$("ul").on("click", "li", function () {
  $(this).toggleClass("completed");
});

//Remove the todo if cross is clicked
$("ul").on("click", "span", function (event) {
  $(this).parent().fadeOut(200, function () {
    $(this).remove();
  });
  event.stopPropagation();
});

//Add a new todo if enter key is pressed
$("input[type='text']").keypress(function (event) {
  if (event.which === 13) {
    var text = $(this).val();
    //create li and append to the div
    $(this).val("");
    $("ul").append("<li><span><i class='fa fa-trash'></i></span>" + text + "</li>")
  }
});

$(".fa-plus").click(function () {
  $("input[type='text']").fadeToggle();
});
