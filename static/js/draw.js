import * as controlModule from './scripts.js';

var newColumn;


// Функция отрисовки списка досок главной страницы
export function drawHomepage(storage) {
    let boards_block = $('.boards > .boards__items-list');
    boards_block.empty();
    for (let board in storage) {
        let board_object = $('<li>', {
            'text': storage[board].board_name,
            'class': 'boards__item'
        });

        board_object.attr({
            "data-board-id": board,
            "data-board-name": storage[board].board_name
        });
        board_object.on('click', controlModule.openBoard);

        boards_block.append(board_object);
    }
}


// Функция отрисовки доски
export function draw(storage) {
    $('.table__list-columns').empty();
    for (let column in storage) {
        createColumn(storage[column].get('name'), column);

        let cards = storage[column].get('cards');
        if (cards) {
            for (let card in cards) {
                createCard(cards[card], column, card)
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
function createCard(card, column_index, card_index) {
    let newCard = $('<div>', {
        'text': card.name,
        'class': 'column__card card'
    });

    newCard.on('click', function () {
        controlModule.openObject($(this))
    });
    newCard.attr({
        "data-column-id": column_index,
        "data-card-id": card_index,
        "data-object-name": card.name,
        "data-object-type": "card"
    });
    $(newColumn).find('.column__list-cards').append(newCard);
}


// Отрисовка комментариев карточки
export function drawComments(card_comments) {
    let comments_block = $('.comments-block__list-comments');
    comments_block.empty();
    for (let comment in card_comments) {
        comments_block.append($('<li>', {
            'text': card_comments[comment],
            'class': 'comments-block__comment'
        }));
    }
}
