// Добавить объект
export function addObject(storage, column_name, card_name, objectType) {
    if (objectType === 'card') {
        for (let columns in storage) {
            if (storage[columns].get('name') === column_name) {

                if (storage[columns].has('cards')) {
                    storage[columns].get('cards').push(card_name);
                } else {
                    storage[columns].set('cards', [card_name]);
                }
            }
        }
    } else if (objectType === 'column') {
        storage.push(new Map([
            ['name', column_name]
        ]));
    }
    return storage
}


// Удалить объект
export function removeObject(storage, column_name, card_name, objectType) {
    for (let columns in storage) {
        if (storage[columns].get('name') === column_name) {
            if (objectType === 'column') {
                storage.splice(columns, 1);
            } else if (objectType === 'card') {
                storage[columns].get('cards').splice(card_name, 1);
            }
        }
    }
    return storage
}


// Переименовать объект
export function renameObject(storage, column_name, card_name, objectType, new_name) {
    for (let columns in storage) {
        if (storage[columns].get('name') === column_name) {
            if (objectType === 'column') {
                storage[columns].set('name', new_name);
            } else if (objectType === 'card') {
                let cards = storage[columns].get('cards');
                for (let card in cards) {
                    if (cards[card] === card_name) {
                        storage[columns].get('cards').splice(card, 1, new_name);
                    }
                }
            }
        }
    }
    return storage
}
