window.TrelloPowerUp.initialize({
    'board-buttons': function () {
        return [
            {
                icon: 'https://conjoint-ly.github.io/trello-pivot/logo.png',
                text: 'Pivot table',
                callback: function (t) {
                    t.board('all').then(async function (board) {
                        const listStore = await t.lists('all');
                        window.cardData = listStore.map(function (listItem, listIndex) {
                            return listItem.cards.map(function (cardItem) {
                                const customMap = {
                                    'Card ID': cardItem.id,
                                    'Card Name': cardItem.name,
                                    'List': listItem.name,
                                    'List index': listIndex + 1,
                                    'Members': cardItem.members.map(member => member.fullName).join(', '),
                                    'Labels': cardItem.labels.map(label => label.name).join(', ')
                                };
                                cardItem.customFieldItems.forEach(function (customFieldItem) {
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

                        t.set('board', 'shared', 'cardData', window.cardData);

                        return t.modal({
                            url: 'https://conjoint-ly.github.io/trello-pivot/modal.html?boardID=' + board.id,
                            args: {
                                boardID: board.id
                            },
                            accentColor: '#000000',
                            fullscreen: true,
                            callback: () => console.log('Pivot table closed.'),
                            actions: [{
                                icon: 'https://conjoint-ly.github.io/trello-pivot/conjointly.png',
                                url: 'https://conjointly.com/?utm_campaign=trello-pivot-table&utm_medium=social&utm_source=trello',
                                alt: 'Check out Conjoint.ly',
                                position: 'left',
                            }],
                            title: 'Pivot Table (by Conjoint.ly)',
                        });
                    })
                }
            }
        ];
    },
});
