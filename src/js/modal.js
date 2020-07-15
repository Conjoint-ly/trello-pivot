$(function() {
  var $_GET = {};
  if (document.location.toString().indexOf('?') !== -1) {
    var query = document.location
      .toString()
      .replace(/^.*?\?/, '')
      .replace(/#.*$/, '')
      .split('&');
    for (var i = 0, l = query.length; i < l; i++) {
      var aux = decodeURIComponent(query[i]).split('=');
      $_GET[aux[0]] = aux[1];
    }
  }
  if (localStorage["pivotData" + $_GET["boardID"]] === undefined) {
    var pivotData = {
      rows: ["List"],
      cols: ["Members"],
      aggregatorName: "Count",
      rendererName: "Table"
    };
  } else {
    var pivotData = JSON.parse(localStorage["pivotData" + $_GET["boardID"]]);
    delete pivotData.aggregators;
  }
  pivotData.onRefresh = function(config) {
    localStorage.setItem("pivotData" + $_GET["boardID"], JSON.stringify(config));
    $(".pvtTable, table").css("width", "auto");
  };
  $("#output").pivotUI(JSON.parse(localStorage['cardData' + $_GET["boardID"]]), pivotData);
  $(".pvtTable, table").css("width", "auto");
});
