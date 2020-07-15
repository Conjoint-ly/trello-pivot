$(window).load(function() {
  if (localStorage.pivotData === undefined) {
    let pivotData = {
      rows: ["List"],
      cols: ["Member"],
      aggregatorName: "Count",
      rendererName: "Table"
    };
  } else {
    let pivotDataRaw  = await JSON.parse(localStorage.pivotData);
    let pivotData = {
      rows: pivotDataRaw.rows,
      cols: pivotDataRaw.cols,
      aggregatorName: pivotDataRaw.aggregatorName,
      rendererName: pivotDataRaw.rendererName,
      vals: pivotDataRaw.vals      
    };
  }
  pivotData.onRefresh = function(config) {
    localStorage.setItem("pivotData", JSON.stringify(config));
    $(".pvtTable").css("width", "");
    $("table").css("width", "");
  };
  $("#output").pivotUI(JSON.parse(localStorage.cardData), pivotData);
});
