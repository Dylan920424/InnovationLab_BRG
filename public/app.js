$(document).ready(function() {
    $(".apply-change-button").click(function(event) {
      event.preventDefault();
      var text = $(".next_clause textarea").val();
      var instruction = $(".changes").val();
      var nextClause = $(".next_clause textarea").val();
      $.ajax({
        url: "/edit-clause",
        type: "POST",
        data: {
          Instruction: instruction,
          Input: text,
          next_clause: nextClause
        },
        success: function(data){
          $(".next_clause textarea").val(data.next_clause);
        }
      })
      $(".changes").val("");
    });
  });

$(document).ready(function() {
  $(".main_contract").submit(function(event) {
    event.preventDefault();
    var x = "";
    $("form :input").each(function() {
      var input = $(this);
      if (input.attr("type") == "radio") {
        if (input.is(":checked")) {
          x += input.attr("name") + ": " + input.val() + "\n";
        }
      } else if (input.attr("type") != "submit") {
        if (input.val()) {
          x += input.attr("name") + ": " + input.val() + "\n";
        }
      }
    });
    var text = "draft an employment agreement with the following information:\n\n" + x + "\n\nwith at least 2000 words.";
    var tokens = parseInt($("#maxToken").val());
    $.ajax({
      url: "/generate-next-clause",
      type: "POST",
      data: {
        main_contract: text,
        next_clause: "This is the next clause",
        max_tokens: tokens
      },
      success: function(data) {
        $(".next_clause textarea").val(data.next_clause);
      }
    });
  });
});

$(document).ready(function () {
  $("#maxToken").on("input", function () {
    $("#maxTokenValue").text($(this).val());
  });
});

$(document).ready(function() {
  $('#format-form').submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      url: '/save-file',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        console.log('File uploaded successfully');
        $("#file-input").val('')
      },
      error: function(error) {
        console.log('Error uploading file');
      }
    });
  });
});