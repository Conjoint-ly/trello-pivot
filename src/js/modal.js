/**
 * Returns card data
 * @returns {Promise<any[]>}
 */
const getCardData = async () => {
    const iframe = window.TrelloPowerUp.iframe();
    const board = await iframe.board('all');
    const listStore = await iframe.lists('all');
    return listStore.map((listItem, listIndex) => {
        return listItem.cards.map(cardItem => {
            const customMap = {
                'Card ID': cardItem.id,
                'Card Name': cardItem.name,
                'List': listItem.name,
                'List index': listIndex + 1,
                'Members': cardItem.members.map(member => member.fullName).join(', '),
                'Labels': cardItem.labels.map(label => label.name).join(', ')
            };
            cardItem.customFieldItems.forEach(customFieldItem => {
                var field = board.customFields.filter(cardItem => cardItem.id === customFieldItem.idCustomField)[0];
                if (field.type === 'number') {
                    customMap[field.name] = Number(customFieldItem.value.number);
                } else if (field.type === "text") {
                    customMap[field.name] = customFieldItem.value.text;
                } else if (field.type === "date") {
                    customMap[field.name] = customFieldItem.value.date;
                } else if (field.type === "checkbox") {
                    customMap[field.name] = 1 * (customFieldItem.value.checked === true);
                } else if (field.type === "list") {
                    customMap[field.name] = field.options
                        .filter(option => option.id === customFieldItem.idValue)[0].value.text;
                }
            });
            return customMap;
        });
    }).flat(1);
};

/**
 * Loads either saved or default pivot settings
 * @returns {Promise<{aggregatorName: string, rows: [string], rendererName: string, cols: [string, string]}>}
 */
const getPivotSettings = async () => {
    let settings = await window.TrelloPowerUp.iframe().get('board', 'shared', 'pivotData');
    if (!settings) {
        settings = {
            rows: ['Members'],
            cols: ['List index', 'List'],
            aggregatorName: 'Count',
            rendererName: 'Table'
        };
    }
    if (settings.hasOwnProperty('aggregators')) {
        delete settings.aggregators;
    }
    if (settings.hasOwnProperty('renderers')) {
        delete settings.renderers;
    }
    return settings
}

(async () => {
    const cardData = await getCardData();
    const pivotSettings = await getPivotSettings();

    pivotSettings.onRefresh = async (data) => {
        await window.TrelloPowerUp.iframe().set('board', 'shared', 'pivotData', data);
        $('.pvtTable, table').css('width', 'auto');
    };

    $('#output').pivotUI(cardData, pivotSettings);
    $('.pvtTable, table').css('width', 'auto');
})();
