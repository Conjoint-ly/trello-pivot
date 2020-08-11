$(async function () {
    let t = window.TrelloPowerUp.iframe();
    let pivotData = await t.get('board', 'shared', 'pivotData');

    if (!pivotData) {
        pivotData = {
            rows: ['Members'],
            cols: ['List index', 'List'],
            aggregatorName: 'Count',
            rendererName: 'Table'
        };
    }

    if (pivotData.hasOwnProperty('aggregators')) {
        delete pivotData.aggregators;
    }
    if (pivotData.hasOwnProperty('renderers')) {
        delete pivotData.renderers;
    }

    pivotData.onRefresh = async (pivotData) => {
        await t.set('board', 'shared', 'pivotData', pivotData);
        $('.pvtTable, table').css('width', 'auto');
    };

    const cardData = await t.get('board', 'shared', 'cardData');

    $('#output').pivotUI(cardData, pivotData);
    $('.pvtTable, table').css('width', 'auto');
});
