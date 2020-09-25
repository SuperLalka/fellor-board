var operationObject;
var waitingForRenaming;


$(".customization").click(function () {
    $(".popup").css({"display": "block"});
    $(".popup__customization").css({"display": "block"});
});


function closePopUp() {
    $(".popup").css({"display": "none"});
    $(".popup > *").css({"display": "none"});
}


$(".popup__close-button").on('click', closePopUp);


$(".customization-form").submit(function (e) {
    e.preventDefault();
    let $form = $(this);
    $form.find('.error').remove();

    if ($form.find('input[id="name_field"]').val() !== '') {
        $(".info-block__table-name").text($form.find('input[id="name_field"]').val());
    }
    if ($form.find('input[id="bgcolor_field"]').val() !== '') {
        let color = $form.find('input[id="bgcolor_field"]').val();
        $(".table").css({"background-color": color});
    }

    closePopUp()
});


function addCart() {
    operationObject = $(this);
    $(".popup").css({"display": "block"});
    $(".popup__add-card").css({"display": "block"});
}

$(".column__add-card").on('click', addCart);


$(".add-card-form").submit(function (e) {
    e.preventDefault();
    let $form = $(this);
    $form.find('.error').remove();

    if ($form.find('input[id="add_card_field"]').val() !== '') {
        let cardName = $form.find('input[id="add_card_field"]').val();
        let newCard = $('<a>', {
            'text': cardName,
            'class': 'column__card card',
            'href': '#'
        });
        newCard.on('click', openCard);
        $(operationObject).siblings('.column__list-cards').append(newCard)
    }

    closePopUp()
});


function openCard() {
    operationObject = $(this);
    $(".popup").css({"display": "block"});
    $(".popup__editing-object").css({"display": "block"});
    $(".popup__title-text").text('в колонке ' + operationObject.parent().siblings('.column__name').text());
    $(".object-block__title").text(operationObject.text());
}


$(".card").on('click', openCard);


$(".actions__delete-button").click(function () {
    $(operationObject).remove();
    closePopUp()
});


$(".object-block__title-editing").click(function () {
    if (!waitingForRenaming) {
        $(this).siblings('.object-block__title').css({"display": "none"});
        $(this).siblings('.card-rename-form').css({"display": "block"});
        waitingForRenaming = true;
    } else {
        let form = $('.card-rename-form');
        if (form.find('input[id="card_rename"]').val() !== '') {
            let newName = form.find('input[id="card_rename"]').val();
            $(operationObject).text(newName);
        }

        // openCard()

        $(this).siblings('.object-block__title').css({"display": "block"});
        $(this).siblings('.card-rename-form').css({"display": "none"});
        waitingForRenaming = false;
    }
});


function columnToMoveCard() {
    let nameColumn = this.textContent;
    $(".column__name:contains(" + nameColumn + ")").siblings('.column__list-cards').append($(operationObject));
    $(".popup__additional-settings").css({"display": "none"});
}


$(".actions__copy-button").click(function () {
    $(".popup__additional-settings").css({"display": "block"});
    if ($(".additional-settings__choice-item").length === 0) {
        $(".column__name").each(function () {
            let columnForChoice = $('<div>', {
                'text': $(this).text(),
                'class': 'additional-settings__choice-item'
            });
            columnForChoice.on('click', columnToMoveCard);
            $('.additional-settings__block').append(columnForChoice);
        });
    }
});


$(".add-column__text").click(function () {
    $(".add-column__text").css({"display": "none"});
    $(".add-column__form").css({"display": "block"});
});


$(".add-column__form").submit(function (e) {
    e.preventDefault();
    let $form = $(this);
    $form.find('.error').remove();

    if ($form.find('input[id="add_column_field"]').val() !== '') {
        let newColumnName = $form.find('input[id="add_column_field"]').val();
        let newColumn = ($('<li>', {
            'class': 'table__column column'
        })).append($('<p>', {
            'text': newColumnName,
            'class': 'column__name'
        })).append($('<div>', {
            'class': 'column__list-cards'
        })).append($('<p>', {
            'text': '+ Добавить карточку',
            'class': 'column__add-card'
        }));
        newColumn.find('.column__add-card').on('click', addCart);
        newColumn.find('.column__name').append($('<span>', {
            'text': '...',
            'class': 'column__editing'
        })).on('click', columnEditing);
        $('.table__list-columns li:last').after(newColumn)
    }

    closeAddNewColumn()
});


function closeAddNewColumn() {
    $(".add-column__text").css({"display": "block"});
    $(".add-column__form").css({"display": "none"});
}


$(".add-column__close-button").on('click', closeAddNewColumn);


function columnEditing() {
    operationObject = $(this);
    $(".context-menu").css({
        "display": "block",
        "position": "absolute",
        "top": this.offsetTop + 30,
        "left": this.offsetLeft
    });
}


$(".column__editing").on('click', columnEditing);


function closeContextMenu() {
    $(".context-menu").css({"display": "none"});
}

$(".context-menu__close-button").on('click', closeContextMenu);


$(".action-item__rename-button").click(function () {
    if (!waitingForRenaming) {
        $('.action-item__rename-form').css({"display": "block"});
        waitingForRenaming = true;
    } else {
        let form = $('.action-item__rename-form');
        if (form.find('input[id="rename_column_field"]').val() !== '') {
            let newName = form.find('input[id="rename_column_field"]').val();
            $(operationObject).parent(".column__name").text(newName);
        }
        form.css({"display": "none"});
        waitingForRenaming = false;
    }
});


function columnToMove() {
    let nameColumn = this.textContent;
    $(".column__name:contains(" + nameColumn + ")").parents('.table__column').before($(operationObject).parents(".column"));
    closePopUp()
}


$(".action-item__copy-button").click(function () {
    $(".popup").css({"display": "block"});
    $(".popup__additional-settings").css({"display": "block"});
    if ($(".additional-settings__choice-item").length === 0) {
        $(".column__name").each(function () {
            let columnForChoice = $('<div>', {
                'text': $(this).text(),
                'class': 'additional-settings__choice-item'
            });
            columnForChoice.on('click', columnToMove);
            $('.additional-settings__block').append(columnForChoice);
        });
    }
});


$(".action-item__delete-button").click(function () {
    $(operationObject).parents(".column").remove();
    closeContextMenu()
});

