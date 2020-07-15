$(function() {
  if (localStorage.pivotData === undefined) {
    var pivotData = {
      rows: ["List"],
      cols: ["Member"],
      aggregatorName: "Count",
      rendererName: "Table"
    };
  } else {
    var pivotData  = JSON.parse(localStorage.pivotData);
    /*var pivotData = {
      rows: pivotDataRaw.rows,
      cols: pivotDataRaw.cols,
      aggregatorName: pivotDataRaw.aggregatorName,
      rendererName: pivotDataRaw.rendererName,
      vals: pivotDataRaw.vals      
    };*/
  }
  pivotData.onRefresh = function(config) {
    localStorage.setItem("pivotData", JSON.stringify(config));
    $(".pvtTable, table").css("width", "auto");
  };
  $("#output").pivotUI(JSON.parse(localStorage.cardData), pivotData);
  $(".pvtTable, table").css("width", "auto");
});
