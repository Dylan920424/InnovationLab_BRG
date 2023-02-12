$(document).ready(function() {
    $(".accept-clause-button").click(function(event) {
      event.preventDefault();
      var text = $(".main_contract textarea").val();
      text += "\n\n" + $(".next_clause textarea").val();
      $(".main_contract textarea").val(text);
      $(".next_clause textarea").val("");
    });
  });

$(document).ready(function() {
    $(".apply-change-button").click(function(event) {
      event.preventDefault();
      var text = $(".main_contract textarea").val();
      $(".main_contract textarea").val(text);
      $(".next_clause textarea").val("This is the next clause altered");
      $(".changes").val("");
    });
  });

$(document).ready(function() {
  $(".main_contract").submit(function(event) {
    event.preventDefault();
    var text = "generate the next clause in this contract given the current contract\n\n" + $(".main_contract textarea").val();
    $.ajax({
      url: "/generate-next-clause",
      type: "POST",
      data: {
        main_contract: text,
        next_clause: "This is the next clause"
      },
      success: function(data) {
        $(".next_clause textarea").val(data.next_clause);
      }
    });
  });
});
  