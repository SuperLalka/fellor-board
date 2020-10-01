var storage = [];


// Получить хранилище объектов
export function getStorage() {
    return storage
}


// Добавить объект
export function addObject(object_name, object_type, column_index) {
    if (object_type === 'card') {
        if (storage[column_index].has('cards')) {
            storage[column_index].get('cards').push({'name': object_name});
        } else {
            storage[column_index].set('cards', [{'name': object_name}]);
        }
    } else if (object_type === 'column') {
        let index = column_index ? column_index : storage.length;
        storage.splice(index, 0, new Map([
            ['name', object_name]
        ]));
    }
    return storage
}


// Переименовать объект
export function renameObject(column_index, card_index, object_type, new_name) {
    if (object_type === 'column') {
        storage[column_index].set('name', new_name);
        return storage
    }
    storage[column_index].get('cards')[card_index].name = new_name;
    return storage
}


// Копировать объект
export function copyObject(column_index, card_index, object_type) {
    if (object_type === 'column') {
        let element = storage[column_index];
        storage.splice(column_index + 1, 0, element);
    } else if (object_type === 'card') {
        let element = storage[column_index].get('cards')[card_index];
        storage[column_index].get('cards').splice(card_index + 1, 0, element);
    }
    return storage
}


// Переместить объект
export function moveObject(old_column_index, new_column_index, card_index, object_type) {
    if (object_type === 'column') {
        let element = storage[old_column_index];
        storage.splice(old_column_index, 1);
        storage.splice(new_column_index, 0, element);
    } else if (object_type === 'card') {
        let old_column_cards = storage[old_column_index].get('cards');
        let element = old_column_cards[card_index].name;

        old_column_cards.splice(card_index, 1);
        addObject(element, object_type, new_column_index);
    }
    return storage
}


// Удалить объект
export function removeObject(column_index, card_index, object_type) {
    if (object_type === 'column') {
        storage.splice(column_index, 1);
    } else if (object_type === 'card') {
        storage[column_index].get('cards').splice(card_index, 1);
    }
    return storage
}
