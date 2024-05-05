window.TrelloPowerUp.initialize({
    'board-buttons': function () {
        return [
            {
                icon: 'https://conjoint-ly.github.io/trello-pivot/logo.png',
                text: 'Pivot table',
                callback: function (t) {
                    return t.modal({
                        url: 'https://conjoint-ly.github.io/trello-pivot/modal.html',
                        accentColor: '#000000',
                        fullscreen: true,
                        callback: () => console.log('Pivot table closed.'),
                        actions: [{
                            icon: 'https://conjoint-ly.github.io/trello-pivot/conjointly.png',
                            url: 'https://conjointly.com/?utm_campaign=trello-pivot-table&utm_medium=social&utm_source=trello',
                            alt: 'Check out Conjointly',
                            position: 'left',
                        }],
                        title: 'Pivot Table (by Conjointly)',
                    });
                }
            }
        ];
    },
});
