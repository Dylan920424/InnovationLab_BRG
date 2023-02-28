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
    var text = "draft an employment agreement with the following information:\n\n" + $(".main_contract textarea").val() + "\n\nWith at least 2000 words";
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