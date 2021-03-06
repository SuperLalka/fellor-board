import * as controlModule from './scripts.js';

var newColumn;


// Функция отрисовки списка досок главной страницы
export function drawHomepage(list_boards) {
    let boards_block = $('.boards > .boards__items-list');
    boards_block.empty();

    for (let board in list_boards) {
        let board_object = $('<li>', {
            'text': list_boards[board]['name'],
            'class': 'boards__item'
        });

        board_object.css("background", list_boards[board]['bg_color'])
        board_object.attr({
            "data-board-id": list_boards[board]['id'],
            "data-board-name": list_boards[board]['name'],
            "data-board-bg-color": list_boards[board]['bg_color'],
        });
        board_object.on('click', controlModule.openBoard);

        boards_block.append(board_object);
    }
}


// Функция отрисовки доски
export function draw(board_objects) {
    $('.table__list-columns').empty();

    if (board_objects) {
        for (let column in board_objects) {
            createColumn(board_objects[column]);
            let column_cards = board_objects[column].cards;

            if (column_cards) {
                for (let card in column_cards) {
                    createCard(column_cards[card])
                }
            }
        }
    }
}


// Функция выделения карточек соответствующих запросу поиска
export function drawSearchResults(results_storage) {
    $('.card').css('background', 'none')
    for (let card in results_storage) {
        $(`.card[data-card-id="${results_storage[card].id}`).css('background', 'orange')
    }
}


// Отрисовка колонки
function createColumn(column_object) {
    newColumn = ($('<li>', {
        'class': 'table__column column'
    })).append($('<p>', {
        'text': column_object.name,
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
        "data-column-id": column_object.id,
        "data-object-name": column_object.name,
        "data-object-type": "column"
    });
    newColumn.find('.column__add-card').on('click', controlModule.popupAddCart);
    newColumn.find('.column__editing').on('click', function () {
        controlModule.openObject($(this).closest('.column'))
    });
    $('.table__list-columns').append(newColumn);
}


// Отрисовка карточки
function createCard(card_object) {
    let newCard = $('<div>', {
        'text': card_object.name,
        'class': 'column__card card'
    });

    newCard.on('click', function () {
        controlModule.openObject($(this))
    });

    newCard.attr({
        "data-card-id": card_object.id,
        "data-object-name": card_object.name,
        "data-object-type": "card"
    });
    $(`.column[data-column-id="${card_object.column_id}"]`).find(
        '.column__list-cards').append(newCard);
}


// Отрисовка комментариев карточки
export function drawComments(card_comments) {
    let comments_block = $('.comments-block__list-comments');
    comments_block.empty();
    for (let comment in card_comments) {
        comments_block.prepend($('<li>', {
            'text': card_comments[comment].text,
            'class': 'comments-block__comment'
        }).append($('<button>', {
            'text': 'X',
            'class': 'comments-block__comment-delete'
        })));

        comments_block.find('.comments-block__comment-delete').on(
            'click', controlModule.removeComment);

        comments_block.find('.comments-block__comment').attr({
            "data-comment-id": card_comments[comment].id
        });
    }
}
