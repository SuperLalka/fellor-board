import * as controlModule from './scripts.js';

var newColumn;


// Функция отрисовки
export function draw(storage, search_results) {
    $('.table__list-columns').empty();
    for (let column in storage) {
        createColumn(storage[column].get('name'), column);

        let cards = storage[column].get('cards');
        if (cards) {
            for (let card in cards) {
                if (search_results) {
                    createCard(cards[card], column, card, search_results)
                } else {
                    createCard(cards[card], column, card, false)
                }
            }
        }
    }
}


// Отрисовка колонки
function createColumn(name, column_index) {
    newColumn = ($('<li>', {
        'class': 'table__column column'
    })).append($('<p>', {
        'text': name,
        'class': 'column__name'
    })).append($('<i>', {
        'text': '...',
        'class': 'column__editing'
    })).append($('<div>', {
        'class': 'column__list-cards'
    })).append($('<p>', {
        'text': '+ Добавить карточку',
        'class': 'column__add-card'
    }));

    newColumn.attr({
        "data-column-id": column_index,
        "data-object-name": name,
        "data-object-type": "column"
    });
    newColumn.find('.column__add-card').on('click', controlModule.popupAddCart);
    newColumn.find('.column__editing').on('click', function () {
        controlModule.openObject($(this).closest('.column'))
    });
    $('.table__list-columns').append(newColumn);
}


// Отрисовка карточки
function createCard(name, column_index, card_index, search_results) {
    let newCard = $('<div>', {
        'text': name,
        'class': 'column__card card'
    });
    if (search_results && search_results.includes(name)) {
        newCard.addClass('card_found');
    }

    newCard.on('click', function () {
        controlModule.openObject($(this))
    });
    newCard.attr({
        "data-column-id": column_index,
        "data-card-id": card_index,
        "data-object-name": name,
        "data-object-type": "card"
    });
    $(newColumn).find('.column__list-cards').append(newCard);
}
