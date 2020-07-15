$("#output").pivotUI(
 JSON.parse(localStorage.cardData), {
    rows: ["List"],
    cols: ["Member"],
    aggregatorName: "Count",
    rendererName: "Table"
  });
