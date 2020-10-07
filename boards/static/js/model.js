import * as controlModule from './scripts.js';

var current_board_index;


// Получить список досок
export function getAllBoards() {
    let request = new XMLHttpRequest();
    request.open('GET',
        '/api/boards',
        false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText)['boards'];
}


// Добавить новую доску
export function addBoard(board_name) {
    $.ajax({
        type: "POST",
        url: "/api/boards",
        data: {'board_name': board_name},
        success: function () {
            controlModule.refreshMainPage();
        }
    });
}


// Установить актуальную доску
export function setCurrentBoard(board_index) {
    current_board_index = board_index;
}


// Получить объекты определённой доски
export function getBoardObjects() {
    let request = new XMLHttpRequest();
    request.open('GET',
        `/api/boards/${current_board_index}`,
        false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText);
}


// Внести изменения в доску
export function changeBoard(update_attr) {
    $.ajax({
        type: "POST",
        url: `/api/boards/${current_board_index}`,
        data: update_attr,
        dataType: 'json',
        success: function () {
            controlModule.refreshBoard();
        }
    });
}


// Удалить доску
export function removeBoard(board_id) {
    $.ajax({
        type: "DELETE",
        url: `/api/boards/${board_id}`,
        success: function () {
            controlModule.refreshMainPage();
        }
    });
}


// Добавить объект
export function addObject(object_name, object_type, object_id, column_id, operation) {
    if (object_type === 'card') {
        if (operation === 'add') {
            $.ajax({
                type: "POST",
                url: "/api/cards",
                data: {
                    'card_name': object_name,
                    'column_id': column_id,
                    'operation': operation
                },
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        } else if (operation === 'copy') {
            $.ajax({
                type: "POST",
                url: `/api/cards`,
                data: {
                    'card_id': object_id,
                    'operation': operation
                },
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        }
    } else if (object_type === 'column') {
        if (operation === 'add') {
            $.ajax({
                type: "POST",
                url: "/api/columns",
                data: {
                    'column_name': object_name,
                    'board_id': current_board_index,
                    'operation': operation
                },
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        } else if (operation === 'copy') {
            $.ajax({
                type: "POST",
                url: `/api/columns`,
                data: {
                    'column_id': object_id,
                    'operation': operation
                },
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        }
    }
}


// Изменить объект
export function changeObject(object_id, object_type, changes, operation) {
    if (object_type === 'card') {
        if (operation === 'rename') {
            $.ajax({
                type: "POST",
                url: `/api/cards/${object_id}`,
                data: {
                    'card_id': object_id,
                    ...changes,
                    'operation': operation
                },
                dataType: 'json',
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        } else if (operation === 'move') {
            $.ajax({
                type: "POST",
                url: `/api/cards/${object_id}`,
                data: {
                    'object_id': object_id,
                    ...changes,
                    'operation': operation
                },
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        }
    } else if (object_type === 'column') {
        if (operation === 'rename') {
            $.ajax({
                type: "POST",
                url: `/api/columns/${object_id}`,
                data: {
                    'column_id': object_id,
                    ...changes,
                    'operation': operation
                },
                dataType: 'json',
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        }
    }
}


// Удалить объект
export function removeObject(object_id, object_type) {
    if (object_type === 'card') {
        $.ajax({
            type: "DELETE",
            url: `/api/cards/${object_id}`,
            data: {'object_id': object_id},
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "DELETE",
            url: `/api/columns/${object_id}`,
            data: {'object_id': object_id},
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    }
}


// Добавить комментарий к карточке
export function addComment(card_id, comment_text) {
    $.ajax({
        type: "POST",
        url: `/api/cards/comments/${card_id}`,
        data: {
            'card_id': card_id,
            'comment_text': comment_text
        },
        success: function () {
            controlModule.refreshBoard();
        }
    });
}


// Получить комментарии карточки
export function getCardsComments(card_id) {
    let request = new XMLHttpRequest();
    request.open('GET',
        `/api/cards/comments/${card_id}`,
        false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText)['comments'];
}


// Найти карточки по ключевому слову из поиска
export function searchCards(key) {
    let request = new XMLHttpRequest();
    request.open('GET',
        `/api/cards/search/${key}`,
        false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText)['found_cards'];
}