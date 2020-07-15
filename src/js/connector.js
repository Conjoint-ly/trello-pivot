/**
 * Converts string from .env to array
 * @param str
 * @returns {string[]}
 */
const commasToArray = (str) => str.split(',').map(item => item.trim());


/**
 * Filters lists by range
 * @param lists
 * @param range
 * @returns {Object[]}
 */
const getListsFromRange = (lists, range) => {
  const listsNames = lists.map(list => list.name);
  const firstListIndex = listsNames.indexOf(range[0]);
  const lastListIndex = listsNames.indexOf(range[1]);
  return lists.slice(firstListIndex, lastListIndex + 1);
}

/**
 * Filters cards by lists
 * @param cards
 * @param lists
 * @returns {Object[]}
 */
const getCardsFromLists = (cards, lists) => {
  const listsIds = lists.map(list => list.id);
  return cards.filter(card => listsIds.includes(card.idList));
}

/**
 * Filters cards by labels
 * @param cards
 * @param labels
 * @returns {Object[]}
 */
const applyLabelsForCards = (cards, labels) => {
  const labelsIds = labels.map(label => label.id);
  return cards.filter(card => {
    const cardLabelsIds = card.labels.map(label => label.id);
    return cardLabelsIds.some(cardLabelsId => labelsIds.includes(cardLabelsId));
  })
};

/**
 * Adds id for custom field
 * @param customField
 * @param customFieldItems
 * @returns {*}
 */
const addIdForCustomField = (customField, customFieldItems) => {
  const customFieldItem = customFieldItems
    .filter(item => item.name === customField.label);
  customField.id = customFieldItem[0].id;
  return customField;
}

/**
 * Adds custom field as member's property
 * @param members
 * @param cards
 * @param customField
 * @returns {Object[]}
 */
const applyCustomFieldCountForMembers = (members, cards, customField) => {
  members.forEach(member => {
    if (!member.hasOwnProperty(customField.name)) {
      member[customField.name] = 0;
    }
    cards.forEach(card => {
      const cardMembersIds = card.members.map(cardMember => cardMember.id);
      if (cardMembersIds.includes(member.id)) {
        member[customField.name] += card.customFieldItems
          .filter(item => item.idCustomField === customField.id)
          .reduce((a, b) => {
            const aNumber = typeof a === 'number' ? a : Number(a.value.number);
            const bNumber = typeof b === 'number' ? b : Number(b.value.number);
            return aNumber + bNumber;
          }, 0);
      }
    });
  })
  return members;
}


window.TrelloPowerUp.initialize({
  'board-buttons': function() {
    return [
      {
        icon: 'https://conjoint-ly.github.io/trello-pivot/logo.png',
        text: 'Pivot table',
        callback: function(t) {
          t.board('all').then(async function(board) {
            let customFieldObject = board.customFields;
            let listStore = await t.lists('all');
            window.listStore = listStore;
            window.customFieldObjectStore = customFieldObject;
            window.cardData = listStore.map(function(C) {
              return C.cards.map(function(B) {
                let customMap = {
                  "Card ID": B.id,
                  "Card Name": B.name,
                  "List": C.name,
                  "Members": B.members.map(A => A.fullName).join(", "),
                  "Labels": B.labels.map(A => A.name).join(", ")
                };
                B.customFieldItems.forEach(function(A) {
                  customMap[board.customFields.filter(B => B.id == A.idCustomField)[0].name] = Number(A.value.number)
                });
                return customMap;
              });
            }).flat(1);
            localStorage.setItem('cardData'+ board.id, JSON.stringify(window.cardData));
            return t.modal({
              url: 'https://conjoint-ly.github.io/trello-pivot/modal.html?boardID='+board.id,
              args: {
                boardID: board.id
              },
              accentColor: '#F2D600',
              fullscreen: true,
              callback: () => console.log('Pivot table closed.'),
              actions: [{
                icon: 'https://conjoint-ly.github.io/trello-pivot/conjointly.png',
                url: 'https://conjointly.com/',
                alt: 'Leftmost',
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
