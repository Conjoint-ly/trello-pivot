$(window).load(function() {
  if (localStorage.pivotData === undefined) {
    let pivotData = {
      rows: ["List"],
      cols: ["Member"],
      aggregatorName: "Count",
      rendererName: "Table"
    };
  } else {
    let pivotData = JSON.parse(localStorage.cardData);
  }
  settings.onRefresh = function(config) {
    localStorage.setItem("pivotData", JSON.stringify(config));
    $(".pvtTable").css("width", "");
  };

  $("#output").pivotUI(JSON.parse(localStorage.cardData), pivotData);

});
