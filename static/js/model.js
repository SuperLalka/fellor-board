var storage = [];


// Добавить объект
export function addObject(object_name, object_type, column_index) {
    if (object_type === 'card') {
        for (let columns in storage) {
            if (columns === column_index) {

                if (storage[columns].has('cards')) {
                    storage[columns].get('cards').push(object_name);
                } else {
                    storage[columns].set('cards', [object_name]);
                }
            }
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
    for (let columns in storage) {
        if (columns === column_index) {
            if (object_type === 'column') {
                storage[columns].set('name', new_name);
            } else if (object_type === 'card') {
                let cards = storage[columns].get('cards');
                for (let card in cards) {
                    if (card === card_index) {
                        cards.splice(card, 1, new_name);
                    }
                }
            }
        }
    }
    return storage
}


// Копировать объект
export function copyObject(column_index, card_index, object_type, object_name) {
    for (let columns in storage) {
        if (columns === column_index) {
            if (object_type === 'column') {
                let element = storage[column_index];
                storage.splice(column_index + 1, 0, element);
            } else if (object_type === 'card') {
                storage[columns].get('cards').splice(card_index + 1, 0, object_name);
            }
        }
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
        let element = old_column_cards[card_index];

        old_column_cards.splice(card_index, 1);
        addObject(element, object_type, new_column_index)
    }
    return storage
}


// Удалить объект
export function removeObject(column_index, card_index, object_type) {
    for (let columns in storage) {
        if (columns === column_index) {
            if (object_type === 'column') {
                storage.splice(column_index, 1);
            } else if (object_type === 'card') {
                storage[columns].get('cards').splice(card_index, 1);
            }
        }
    }
    return storage
}


// Поиск по карточкам
export function searchByCards(key) {
    let results_storage = [];
    for (let columns in storage) {
        let cards = storage[columns].get('cards');
        if (cards) {
            for (let card in cards) {
                if (cards[card].toLowerCase().includes(key)) {
                    results_storage.push(cards[card]);
                }
            }
        }
    }
    return [storage, results_storage]
}
