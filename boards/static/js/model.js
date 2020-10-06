import * as controlModule from './scripts.js';

var current_board_index;


// Получить список досок
export function getAllBoards() {
    let request = new XMLHttpRequest();
    request.open('GET', '/fellor-boards.ru/api/boards', false);
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
        url: "/fellor-boards.ru/api/boards",
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
    request.open('GET', `/fellor-boards.ru/api/boards/${current_board_index}`, false);
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
        url: `/fellor-boards.ru/api/boards/${current_board_index}`,
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
        url: `/fellor-boards.ru/api/boards/${board_id}`,
        success: function () {
            controlModule.refreshMainPage();
        }
    });
}


// Добавить объект
export function addObject(object_name, object_type, column_id) {
    if (object_type === 'card') {
        $.ajax({
            type: "POST",
            url: "/fellor-boards.ru/api/cards",
            data: {'card_name': object_name, 'column_id': column_id},
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "POST",
            url: "/fellor-boards.ru/api/columns",
            data: {'column_name': object_name, 'board_id': current_board_index},
            success: function () {
                controlModule.refreshBoard();
            }
        });
    }
}


// Переименовать объект
export function renameObject(object_id, object_type, new_name) {
    if (object_type === 'card') {
        $.ajax({
            type: "POST",
            url: `/fellor-boards.ru/api/cards/${object_id}`,
            data: {'new_name': new_name, 'card_id': object_id},
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "POST",
            url: `/fellor-boards.ru/api/columns/${object_id}`,
            data: {'new_name': new_name, 'column_id': object_id},
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    }
}


// Копировать/переместить объект
export function changeObject(object_id, new_column_id, object_type, operation) {
    if (operation === 'copy') {
        if (object_type === 'card') {
            $.ajax({
                type: "POST",
                url: `/fellor-boards.ru/api/cards/change/${object_id}`,
                data: {'object_id': object_id, 'operation': operation},
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        } else if (object_type === 'column') {
            $.ajax({
                type: "POST",
                url: `/fellor-boards.ru/api/columns/change/${object_id}`,
                data: {'object_id': object_id, 'operation': operation},
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        }
    } else if (operation === 'move') {
        if (object_type === 'card') {
            $.ajax({
                type: "POST",
                url: `/fellor-boards.ru/api/cards/change/${object_id}`,
                data: {'object_id': object_id, 'new_column_id': new_column_id, 'operation': operation},
                success: function () {
                    controlModule.refreshBoard();
                }
            });
        } else if (object_type === 'column') {
            $.ajax({
                type: "POST",
                url: `/fellor-boards.ru/api/columns/change/${object_id}`,
                data: {'object_id': object_id, 'new_column_id': new_column_id, 'operation': operation},
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
            url: `/fellor-boards.ru/api/cards/${object_id}`,
            data: {'object_id': object_id},
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "DELETE",
            url: `/fellor-boards.ru/api/columns/${object_id}`,
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
        url: `/fellor-boards.ru/api/cards/comments/${card_id}`,
        data: {'card_id': card_id, 'comment_text': comment_text},
        success: function () {
            controlModule.refreshBoard();
        }
    });
}


// Получить комментарии карточки
export function getCardsComments(card_id) {
    let request = new XMLHttpRequest();
    request.open('GET', `/fellor-boards.ru/api/cards/comments/${card_id}`, false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText)['comments'];
}


// Найти карточки по ключевому слову из поиска
export function searchCards(key) {
    let request = new XMLHttpRequest();
    request.open('GET', `/fellor-boards.ru/api/cards/search/${key}`, false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText)['found_cards'];
}