import * as drawModule from './draw.js';
import * as modelModule from './model.js';

var close_bg;
var operationObject;
var operationObjectType
var waitingForRenaming;


// Обработчик, когда DOM будет полностью загружен
document.addEventListener("DOMContentLoaded", function () {

    refreshMainPage()

    // Поиск по названиям карт
    $(".header__search-input").on('change', searchByCards);
    $("input.header__search-input").on('focus', focusSearchByCards);

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
    // Переключение и обработка формы переименования
    $(".object-block__title-editing").on('click', toggleRenameForm);

    // Перемещение объекта
    $("button.actions__move-button").on('click', moveObject);

    // Копирование объекта
    $("button.actions__copy-button").on('click', copyObject);

    // Удаление объекта
    $("button.actions__delete-button").on('click', removeObject);

    // Преображает форму ввода комментария
    $(".comments-form__input").on('focus', focusInputComment);

    // Обработка формы добавления нового комментария
    $(".comments-block > .comments-form").on('submit', addComment);

    // Удаление комментария
    $(".comments-block__comment > .comments-block__comment-delete").on('click', removeComment);

    // Универсальная кнопка закрытия pop-up'a
    $(".popup__close-button").on('click', function () {
        popupToggle($(this).closest('div').attr("class"), close_bg = true)
    });

    // Отображает форму ввода названия новой колонки
    $(".add-column > .add-column__text").on('click', displayNameNewColumnForm);
    $(".add-column__form > .add-column__close-button").on('click', displayNameNewColumnForm);

    // Обработка формы ввода имени и создание новой колонки
    $(".add-column > .add-column__form").on('submit', createNewColumn);

    // Открытие главной страницы со списком досок
    $(".header > .header__home-page").on('click', openHomePage);

    // Pop-up добавления новой доски
    $(".boards > .boards__add-board").on('click', popupAddBoard);

    // Обработка формы ввода имени и создание новой доски
    $(".popup__add-board > .add-board-form").on('submit', createNewBoard);

    // Открытие выбранной доски
    $(".boards__items-list > .boards__item").on('click', openBoard);

});


// Функция поиска по названиям карт
function searchByCards() {
    let key = $(this).val().toLowerCase();

    if (key) {
        let results_storage = modelModule.searchCards(key);
        $('.header__search-reset').css({"visibility": "visible"});

        drawModule.drawSearchResults(results_storage);
    } else {
        resetSearchInput();
    }
}


// Функция преобразования формы поиска по названиям карт
function focusSearchByCards() {
    $(".header__search-input").addClass('header__search-input_focus');
}


// Функция очистки поля поиска
function resetSearchInput() {
    $(".header__search-input").removeClass('header__search-input_focus');
    $('.header__search-reset').css({"visibility": "hidden"});
    $(this).siblings('input[id="search_field"]').val('');
    refreshBoard();
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
    let new_name = $(this).find('input[id="name_field"]').val();
    let new_bg_color = $(this).find('input[id="bgcolor_field"]').val();
    let update_attr = {}

    if (new_name) {
        update_attr['name'] = new_name;
        $('.info-block__table-name').text(new_name);
        $(this).find('input[id="name_field"]').val('');
    }
    if (new_bg_color) {
        update_attr['bg_color'] = new_bg_color;
        $('.table').css('background-color', new_bg_color)
        $(this).find('input[id="bgcolor_field"]').val('');
    }
    modelModule.changeObject(
        false,
        'board',
        update_attr
    );
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
        modelModule.addCard(new_card_name, column_index);
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

    if (operationObjectType === 'card') {
        let card_id = ($(operationObject)).attr('data-card-id');
        let card_comments;

        card_comments = modelModule.getCardsComments(card_id);
        if (card_comments) {
            drawModule.drawComments(card_comments);
        }
    }
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
            let object_id = operationObject.attr(`data-${operationObjectType}-id`)

            modelModule.changeObject(
                object_id,
                operationObjectType,
                {'name': new_name}
            );
            $(form).find('input[id="object_rename_field"]').val('');
        }

        $(this).siblings('.object-block__title').css({"display": "block"}).text(new_name);
        $(this).siblings('.object-block__rename-form').css({"display": "none"});
        waitingForRenaming = false;
    }
}


// Функция вызова pop-up'a окна перемещения/копирования объекта
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
    let object_id = operationObject.attr(`data-${operationObjectType}-id`)

    if (new_column_index !== object_id) {
        modelModule.changeObject(
            object_id,
            operationObjectType,
            {'column_id': new_column_index},
        );
    }

    refreshBoard(); // ?
    $(".additional-settings__block").remove();
    popupToggle('popup__additional-settings', close_bg = true);
}


// Функция копирования объекта
function copyObject() {
    let object_name = operationObject.attr('data-object-name')

    if (operationObjectType === 'card') {
        let column_id = $(operationObject).closest('.column').attr(`data-column-id`)
        modelModule.addCard(object_name, column_id);
    } else if (operationObjectType === 'column') {
        let column_id = operationObject.attr('data-column-id')
        modelModule.addColumn(object_name, column_id);
    }

    refreshBoard(); // ?
    popupToggle('popup__editing-object', close_bg = true);
}


// Функция удаления объекта
function removeObject() {
    let object_id = operationObject.attr(`data-${operationObjectType}-id`)

    modelModule.removeObject(object_id, operationObjectType);
    popupToggle('popup__editing-object', close_bg = true);
}


// Функция преобразования формы ввода комментария
function focusInputComment() {
    $("#comment_field").toggleClass('comments-form__input_focus');
    $(".comments-form__submit-button").toggle();
}


// Функция обработки формы ввода комментария
function addComment(event) {
    event.preventDefault();
    let comment_text = $(this).find('textarea[id="comment_field"]').val();
    let card_id = ($(operationObject)).attr('data-card-id');

    if (comment_text) {
        modelModule.addComment(card_id, comment_text);
    }
    $(this).find('textarea[id="comment_field"]').val('');
    focusInputComment();

    popupToggle('popup__editing-object', close_bg = true);
    openObject($(operationObject))
}


// Функция удаления комментария
export function removeComment() {
    let object_id = $(this).closest('.comments-block__comment').attr(`data-comment-id`)

    modelModule.removeObject(object_id, 'comment');
    popupToggle('popup__editing-object', close_bg = true);
    openObject($(operationObject))
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
        modelModule.addColumn(new_column_name);
    }
    $(this).find('input[id="add_column_field"]').val('');
    displayNameNewColumnForm();
}


// Функция показа главной страницы и отрисовки списка досок
function openHomePage() {
    $('main.table').css({"visibility": "hidden", "display": "none"});
    $('main.board-selection').css({"visibility": "visible", "display": "block"});

    refreshMainPage();
}


// Функция переключения видимости формы ввода имени новой доски
function popupAddBoard() {
    popupToggle('popup__add-board', close_bg = true);
}


// Функция обработки формы ввода имени и создания новой доски
function createNewBoard(event) {
    event.preventDefault();
    let new_board_name = $(this).find('input[id="add_board_field"]').val();

    if (new_board_name) {
        modelModule.addBoard(new_board_name);
    }
    $(this).find('input[id="add_board_field"]').val('');
    popupToggle('popup__add-board', close_bg = true);
}


// Функция отрисовки доски
export function openBoard() {
    let board_name = $(this).attr('data-board-name');
    let current_board = $(this).attr('data-board-id');
    let board_bg = $(this).attr('data-board-bg-color');

    modelModule.setCurrentBoard(current_board)
    refreshBoard();

    $('.table').css('background-color', board_bg)
    $('.header > .header__search-form').css({"visibility": "visible"});
    $('.info-block__table-name').text(board_name);
    $('main.table').css({"visibility": "visible", "display": "block"});
    $('main.board-selection').css({"visibility": "hidden", "display": "none"});
}


// Функция обновления страницы
export function refreshBoard() {
    drawModule.draw(modelModule.getBoardObjects());
}


// Функция обновления главной страницы
export function refreshMainPage() {
    drawModule.drawHomepage(modelModule.getListObjects('board'));
}