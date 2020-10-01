import * as drawModule from './draw.js';
import * as modelModule from './model.js';

var close_bg;
var operationObject;
var operationObjectType
var waitingForRenaming;

var storage = [];


// Обработчик, когда DOM будет полностью загружен
document.addEventListener("DOMContentLoaded", function () {

    // Поиск по названиям карт
    $(".header__search-input").on('change', searchByCards);

    // Очистка поля формы поиска
    $(".header__search-reset").on('click', resetSearchInput);

    // Pop-up кастомизации доски
    // Вызов pop-up окна кастомизации доски
    $(".info-block > .customization").on('click', function () {
        popupToggle("popup__customization", close_bg = true);
    });

    // Обработка формы из pop-up'a кастомизации доски
    $(".popup__customization > .customization-form").on('submit', customizationFormProcessing);

    // Pop-up добавления новой карточки
    // Вызов pop-up окна добавления новой карточки
    $(".column > .column__add-card").on('click', popupAddCart);

    // Обработка формы из pop-up'a добавления новой карточки
    $(".popup__add-card > .add-card-form").on('submit', addCardFormProcessing);

    // Pop-up редактирования карточки или колонки
    // Вызов pop-up окна редактирования карточки или колонки
    // $(".column__list-cards > .card").on('click', function () {
    //     openObject($(this))
    // });
    // $(".column > .column__editing").on('click', function () {
    //     console.log($(this))
    //     openObject($(this).closest('.column'))
    // });

    // Переключение и обработка формы переименования
    $(".object-block__title-editing").on('click', toggleRenameForm);

    // Перемещение объекта
    $("button.actions__move-button").on('click', moveObject);

    // Копирование объекта
    $("button.actions__copy-button").on('click', copyObject);

    // Удаление объекта
    $("button.actions__delete-button").on('click', removeObject);

    // Универсальная кнопка закрытия pop-up'a
    $(".popup__close-button").on('click', function () {
        popupToggle($(this).closest('div').attr("class"), close_bg = true)
    });

    // Отображает форму ввода названия новой колонки
    $(".add-column > .add-column__text").on('click', displayNameNewColumnForm);
    $(".add-column__form > .add-column__close-button").on('click', displayNameNewColumnForm);

    // Обработка формы ввода имени и создание новой колонки
    $(".add-column > .add-column__form").on('submit', createNewColumn);

});


// Функция поиска по названиям карт
function searchByCards() {
    let key = $(this).val().toLowerCase();

    if (key) {
        let results;
        $('.header__search-reset').css({"visibility": "visible"});
        results = modelModule.searchByCards(key);
        drawModule.draw(...results);
    } else {
        $(".column__card").css({"visibility": "visible"});
        resetSearchInput();
        drawModule.draw(storage);
    }
}


// Функция очистки поля поиска
function resetSearchInput() {
    $(".column__card").css({"visibility": "visible"});
    $('.header__search-reset').css({"visibility": "hidden"});
    $(this).siblings('input[id="search_field"]').val('');
}


// Функция переключения pop-up'ов
function popupToggle(popupName, close_bg) {
    $("." + popupName).toggle();
    if (close_bg) {
        $('.background-popup').toggle();
    }
}


// Функция обработки формы из pop-up'a кастомизации доски
function customizationFormProcessing(event) {
    event.preventDefault();
    let name_field = $(this).find('input[id="name_field"]').val();
    let bgcolor_field = $(this).find('input[id="bgcolor_field"]').val();

    if (name_field) {
        $(".info-block__table-name").text(name_field);
    }
    if (bgcolor_field) {
        $(".table").css({"background-color": bgcolor_field});
    }
    popupToggle('popup__customization', close_bg = true);
}


// Функция вызова pop-up'a окна добавления новой карточки, также определяет объект колонки в переменную
export function popupAddCart() {
    operationObject = $(this).closest('.column');
    popupToggle('popup__add-card', close_bg = true);
}


// Функция обработки формы из pop-up'a добавления новой карточки
function addCardFormProcessing(event) {
    event.preventDefault();
    let new_card_name = $(this).find('input[id="add_card_field"]').val();
    let column_index = ($(operationObject)).attr('data-column-id');

    if (new_card_name) {
        storage = modelModule.addObject(new_card_name, 'card', column_index);
        drawModule.draw(storage);
    }
    $(this).find('input[id="add_card_field"]').val('');
    popupToggle('popup__add-card', close_bg = true);
}


// Функция вызова pop-up'a окна редактирования объекта, также определяет объект операции и его тип в переменную
export function openObject(object) {
    operationObject = object;
    operationObjectType = object.attr('data-object-type');
    popupToggle('popup__editing-object', close_bg = true);
    $(".object-block__title").text($(object).attr('data-object-name'));
}


// Функция переключения и обработки формы переименования
function toggleRenameForm() {
    if (!waitingForRenaming) {
        $(this).siblings('.object-block__title').css({"display": "none"});
        $(this).siblings('.object-block__rename-form').css({"display": "block"});
        waitingForRenaming = true;
    } else {
        let form = $(this).siblings('.object-block__rename-form');
        let new_name = form.find('input[id="object_rename_field"]').val();

        if (new_name) {
            let column_index = operationObject.attr('data-column-id');

            if (operationObjectType === 'card') {
                let card_index = operationObject.attr('data-card-id');
                storage = modelModule.renameObject(column_index, card_index, operationObjectType, new_name);
            } else if (operationObjectType === 'column') {
                storage = modelModule.renameObject(column_index, false, operationObjectType, new_name);
            }

            $(form).find('input[id="object_rename_field"]').val('');
            drawModule.draw(storage);
        }

        $(this).siblings('.object-block__title').css({"display": "block"});
        $(this).siblings('.object-block__rename-form').css({"display": "none"});
        waitingForRenaming = false;
        openObject($(operationObject), 'card')
    }
}


// Функция вызова pop-up'a окна перемещения объекта
function moveObject() {
    $(".popup__additional-settings").css({"display": "block"}).append(
        $('<div>', {'class': 'additional-settings__block'}));

    $(".column__name").each(function () {
        let columnID = $(this).closest('.column').attr('data-column-id');
        let columnForChoice = $('<div>', {
            'text': $(this).text(),
            'class': 'additional-settings__choice-item',
            'data-column-id': columnID
        });
        columnForChoice.on('click', columnToMoveObject);
        $('.additional-settings__block').append(columnForChoice);
    });
    popupToggle('popup__editing-object');
}


// Функция перемещения объекта
function columnToMoveObject() {
    let new_column_index = $(this).attr('data-column-id');
    let column_index = operationObject.attr('data-column-id');

    if (new_column_index !== column_index) {
        if (operationObjectType === 'card') {
            let card_index = operationObject.attr('data-card-id');
            storage = modelModule.moveObject(column_index, new_column_index, card_index, operationObjectType);
        } else if (operationObjectType === 'column') {
            storage = modelModule.moveObject(column_index, new_column_index, false, operationObjectType);
        }
    }

    drawModule.draw(storage);
    $(".additional-settings__block").remove();
    popupToggle('popup__additional-settings', close_bg = true);
}


// Функция копирования объекта
function copyObject() {
    let column_index = operationObject.attr('data-column-id');
    let object_name = operationObject.attr('data-object-name');

    if (operationObjectType === 'card') {
        let card_index = operationObject.attr('data-card-id');
        storage = modelModule.copyObject(column_index, card_index, operationObjectType, object_name);
    } else if (operationObjectType === 'column') {
        storage = modelModule.copyObject(column_index, false, operationObjectType, object_name);
    }
    drawModule.draw(storage);
    popupToggle('popup__editing-object', close_bg = true);
}


// Функция удаления объекта
function removeObject() {
    let column_index = operationObject.attr('data-column-id');

    if (operationObjectType === 'card') {
        let card_index = operationObject.attr('data-card-id');
        storage = modelModule.removeObject(column_index, card_index, operationObjectType);
    } else if (operationObjectType === 'column') {
        storage = modelModule.removeObject(column_index, false, operationObjectType);
    }
    drawModule.draw(storage);
    popupToggle('popup__editing-object', close_bg = true);
}


// Функция переключения видимости формы ввода имени новой колонки
function displayNameNewColumnForm() {
    $(".add-column > .add-column__text").toggle();
    $(".add-column > .add-column__form").toggle();
}


// Функция обработки формы ввода имени и создания новой колонки
function createNewColumn(event) {
    event.preventDefault();
    let new_column_name = $(this).find('input[id="add_column_field"]').val();

    if (new_column_name) {
        storage = modelModule.addObject(new_column_name, 'column', false);
        drawModule.draw(storage);
    }
    $(this).find('input[id="add_column_field"]').val('');
    displayNameNewColumnForm();
}
