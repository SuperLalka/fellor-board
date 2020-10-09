import * as controlModule from './scripts.js';

var current_board_index;


// Установить актуальную доску
export function setCurrentBoard(board_index) {
    current_board_index = board_index;
}


// Получить объекты определённой доски
export function getBoardObjects() {
    var result = "";
    $.ajax({
        async: false,
        type: "GET",
        url: `/api/columns?board_id=${current_board_index}`,
        success: function (data) {
            result = data;
        }
    });
    return result
}


// Добавить новую доску
export function addBoard(object_name) {
    $.ajax({
        type: "POST",
        url: "/api/boards",
        data: {'name': object_name},
        success: function () {
            controlModule.refreshMainPage();
        }
    });
}


// Добавить колонку
export function addColumn(object_name) {
    $.ajax({
        type: "POST",
        url: "/api/columns",
        data: {
            'name': object_name,
            'board_id': current_board_index
        },
        dataType: 'json',
        success: function () {
            controlModule.refreshBoard();
        }
    });
}


// Добавить карточку
export function addCard(object_name, column_id) {
    $.ajax({
        type: "POST",
        url: "/api/cards",
        data: {
            'name': object_name,
            'column_id': column_id
        },
        dataType: 'json',
        success: function () {
            controlModule.refreshBoard();
        }
    });
}


// Получить список объектов
export function getListObjects(object_type) {
    var result = "";
    if (object_type === 'board') {
        $.ajax({
            async: false,
            type: "GET",
            url: "/api/boards",
            success: function (data) {
                result = data;
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            async: false,
            type: "GET",
            url: "/api/columns",
            success: function (data) {
                result = data;
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'card') {
        $.ajax({
            async: false,
            type: "GET",
            url: "/api/cards",
            success: function (data) {
                result = data;
                controlModule.refreshBoard();
            }
        });
    }
    return result
}


// Получить объект
export function getObject(object_id, object_type) {
    if (object_type === 'card') {
        $.ajax({
            type: "GET",
            url: `/api/cards/${object_id}`,
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "GET",
            url: `/api/columns/${object_id}`,
            success: function () {
                controlModule.refreshBoard();
            }
        });
    }
}


// Изменить объект
export function changeObject(object_id, object_type, changes) {
    if (object_type === 'board') {
        $.ajax({
            type: "PATCH",
            url: `/api/boards/${current_board_index}`,
            data: {
                'id': current_board_index,
                ...changes
            },
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "PATCH",
            url: `/api/columns/${object_id}`,
            data: {
                'id': object_id,
                ...changes
            },
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'card') {
        $.ajax({
            type: "PATCH",
            url: `/api/cards/${object_id}`,
            data: {
                'id': object_id,
                ...changes
            },
            success: function () {
                controlModule.refreshBoard();
            }
        });
    }
}


// Удалить объект
export function removeObject(object_id, object_type) {
    if (object_type === 'board') {
        $.ajax({
            type: "DELETE",
            url: `/api/boards/${object_id}`,
            success: function () {
                controlModule.refreshMainPage();
            }
        });
    } else if (object_type === 'card') {
        $.ajax({
            type: "DELETE",
            url: `/api/cards/${object_id}`,
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'column') {
        $.ajax({
            type: "DELETE",
            url: `/api/columns/${object_id}`,
            dataType: 'json',
            success: function () {
                controlModule.refreshBoard();
            }
        });
    } else if (object_type === 'comment') {
        $.ajax({
            async: false,
            type: "DELETE",
            url: `/api/comments/${object_id}`,
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
        async: false,
        type: "POST",
        url: `/api/comments`,
        data: {
            'card_id': card_id,
            'text': comment_text
        },
        success: function () {
            controlModule.refreshBoard();
        }
    });
}


// Получить список комментариев к карточке
export function getCardsComments(card_id) {
    let request = new XMLHttpRequest();
    request.open('GET',
        `/api/comments?card_id=${card_id}`,
        false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText);
}


// Найти карточки по ключевому слову из поиска
export function searchCards(key) {
    let request = new XMLHttpRequest();
    request.open('GET',
        `/api/cards?search=${key}`,
        false);
    request.send(null);

    if (request.status !== 200) {
        console.log('Error');
    }
    return JSON.parse(request.responseText);
}