var close_bg;
var operationObject;
var operationObjectType
var waitingForRenaming;


// Обработчик, когда DOM будет полностью загружен
document.addEventListener("DOMContentLoaded", function() {

    // Поиск по названиям карт
    $(".header__search-input").on('change', searchByCards);

    // Pop-up кастомизации доски
    // Вызов pop-up окна кастомизации доски
    $(".info-block > .customization").on('click', function () {
        popupToggle("popup__customization", close_bg=true);
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
    $(".column__list-cards > .card").on('click', function () {
        openObject ($(this), 'card')});
    $(".column > .column__editing").on('click', function () {
        openObject ($(this), 'column')});

        // Переключение и обработка формы переименования
        $(".object-block__title-editing").on('click', toggleRenameForm);

        // Перемещение объекта
        $("button.actions__copy-button").on('click', moveObject);

        // Удаление объекта
        $("button.actions__delete-button").on('click', removeObject);

    // Универсальная кнопка закрытия pop-up'a
    $(".popup__close-button").on('click', function () {
        popupToggle($(this).closest('div').attr("class"), close_bg=true);
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
        let allCards = $(".column__card").toArray()
        for (let card in allCards) {
            if (!(allCards[card].outerText.toLowerCase().includes(key))) {
                $(allCards[card]).css({"visibility": "hidden"})
            }
        }
    } else {
        $(".column__card").css({"visibility": "visible"})
    }
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
    popupToggle('popup__customization', close_bg=true);
}


// Функция вызова pop-up'a окна добавления новой карточки, также определяет актуальную колонку в переменную
function popupAddCart() {
    operationObject = $(this);
    popupToggle('popup__add-card', close_bg=true);
}


// Функция обработки формы из pop-up'a добавления новой карточки
function addCardFormProcessing(event) {
    event.preventDefault();
    let add_card_field = $(this).find('input[id="add_card_field"]').val();

    if (add_card_field) {
        let newCard = $('<div>', {
            'text': add_card_field,
            'class': 'column__card card'
        });
        newCard.on('click', function () {openObject ($(this), 'card')});
        $(operationObject).siblings('.column > .column__list-cards').append(newCard)
    }

    popupToggle('popup__add-card', close_bg=true)
}


// Функция вызова pop-up'a окна редактирования карточки, также определяет актуальную карточку в переменную
function openObject(object, type) {
    operationObjectType = type;
    popupToggle('popup__editing-object', close_bg = true)
    if (operationObjectType === 'card') {
        operationObject = object;
        $(".object-block__title").text(operationObject.text());
    } else if (operationObjectType === 'column') {
        operationObject = object.closest('.column');
        $(".object-block__title").text(operationObject.find('.column__name').text());
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
        let object_rename_field = form.find('input[id="object_rename_field"]').val();

        if (object_rename_field) {

            if (operationObjectType === 'card') {
                $(operationObject).text(object_rename_field);
            } else if (operationObjectType === 'column') {
                $(operationObject).find('.column__name').text(object_rename_field);
            }
            $(form).find('input[id="object_rename_field"]').val('');
        }

        // openObject()

        $(this).siblings('.object-block__title').css({"display": "block"});
        $(this).siblings('.object-block__rename-form').css({"display": "none"});
        waitingForRenaming = false;
    }
}


// Функция вызова pop-up'a окна перемещения объекта
function moveObject() {
    $(".popup__additional-settings").css({"display": "block"}).append(
        $('<div>', {'class': 'additional-settings__block'}));

    $(".column__name").each(function () {
        let columnForChoice = $('<div>', {
            'text': $(this).text(),
            'class': 'additional-settings__choice-item'
        });
        columnForChoice.on('click', columnToMoveCard);
        $('.additional-settings__block').append(columnForChoice);
    });
    popupToggle('popup__editing-object');
}


// Функция перемещения объекта
function columnToMoveCard() {
    let nameColumn = this.textContent;
    if (operationObjectType === 'card') {
        $(".column__name:contains(" + nameColumn + ")").siblings('.column__list-cards').append($(operationObject));
    } else if (operationObjectType === 'column') {
        $(".column:contains(" + nameColumn + ")").before($(operationObject));
    }
    $(".additional-settings__block").remove();
    popupToggle('popup__additional-settings', close_bg=true);
}


// Функция удаления объекта
function removeObject() {
    $(operationObject).remove();
    popupToggle('popup__editing-object', close_bg=true);
}


// Функция переключения видимости формы ввода имени новой колонки
function displayNameNewColumnForm() {
    $(".add-column > .add-column__text").toggle();
    $(".add-column > .add-column__form").toggle();
}


// Функция обработки формы ввода имени и создания новой колонки
function createNewColumn(event) {
    event.preventDefault();
    let add_column_field = $(this).find('input[id="add_column_field"]').val();

    if (add_column_field) {
        let newColumn = ($('<li>', {
            'class': 'table__column column'
        })).append($('<p>', {
            'text': add_column_field,
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
        newColumn.find('.column__add-card').on('click', popupAddCart);
        newColumn.find('.column__editing').on('click', function () {
            openObject ($(this), 'column')});

        $('.table__list-columns li:last').after(newColumn)
    }

    displayNameNewColumnForm()
}
