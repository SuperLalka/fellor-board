var storage = [];
var current_board_index;


// Получить хранилище объектов целиком
export function getStorage() {
    return storage
}


// Установить актуальную доску
export function setCurrentBoard(board_index) {
    current_board_index = board_index;
}


// Получить конкретную доску
export function getCurrentBoard(current_board) {
    let board = current_board_index ? current_board_index : 0;
    return storage[board].content;
}


// Добавить новую доску
export function addBoard(board_name) {
    storage.push({'board_name': board_name, 'content': []});
    return storage
}


// Добавить объект
export function addObject(object_name, object_type, column_index) {
    let current_board = getCurrentBoard();
    if (object_type === 'card') {
        if (current_board[column_index].has('cards')) {
            current_board[column_index].get('cards').push({'name': object_name});
        } else {
            current_board[column_index].set('cards', [{'name': object_name}]);
        }
    } else if (object_type === 'column') {
        let index = column_index ? column_index : current_board.length;
        current_board.splice(index, 0, new Map([
            ['name', object_name]
        ]));
    }
    return current_board
}


// Переименовать объект
export function renameObject(column_index, card_index, object_type, new_name) {
    let current_board = getCurrentBoard();
    if (object_type === 'column') {
        current_board[column_index].set('name', new_name);
        return current_board
    }
    current_board[column_index].get('cards')[card_index].name = new_name;
    return current_board
}


// Копировать объект
export function copyObject(column_index, card_index, object_type) {
    let current_board = getCurrentBoard();
    if (object_type === 'column') {
        let element = current_board[column_index];
        current_board.splice(column_index + 1, 0, element);
    } else if (object_type === 'card') {
        let element = current_board[column_index].get('cards')[card_index];
        current_board[column_index].get('cards').splice(card_index + 1, 0, element);
    }
    return current_board
}


// Переместить объект
export function moveObject(old_column_index, new_column_index, card_index, object_type) {
    let current_board = getCurrentBoard();

    if (object_type === 'column') {
        let element = current_board[old_column_index];
        current_board.splice(old_column_index, 1);
        current_board.splice(new_column_index, 0, element);
    } else if (object_type === 'card') {
        let old_column_cards = current_board[old_column_index].get('cards');
        let element = old_column_cards[card_index].name;

        old_column_cards.splice(card_index, 1);
        addObject(element, object_type, new_column_index);
    }
    return current_board
}


// Удалить объект
export function removeObject(column_index, card_index, object_type) {
    let current_board = getCurrentBoard();

    if (object_type === 'column') {
        current_board.splice(column_index, 1);
    } else if (object_type === 'card') {
        current_board[column_index].get('cards').splice(card_index, 1);
    }
    return current_board
}


// Добавить комментарий к карточке
export function addComment(column_index, card_index, comment_text) {
    let current_board = getCurrentBoard();
    let element = current_board[column_index].get('cards')[card_index];

    if (element.comments) {
        element.comments.unshift(comment_text);
    } else {
        element.comments = [comment_text];
    }
}


// Получить комментарии карточки
export function getCardsComments(column_index, card_index) {
    let current_board = getCurrentBoard();
    let element = current_board[column_index].get('cards')[card_index];

    return (element.comments) ? element.comments : false;
}
