
$( ".customization" ).click(function() {
    $(".popup").css({"display":"block"});
    $(".popup__customization").css({"display":"block"});
});


function closePopUp() {
    $(".popup").css({"display":"none"});
    $(".popup > *").css({"display":"none"});
}


$( ".popup__close-button" ).on('click', closePopUp);


$( ".customization-form" ).submit(function(e) {
    e.preventDefault();
    const $form = $(this);
    $form.find('.error').remove();

    if ($form.find('input[id="name_field"]').val() !== '') {
        $(".info-block__table-name").text($form.find('input[id="name_field"]').val());
    }
    if ($form.find('input[id="bgcolor_field"]').val() !== '') {
        let color = $form.find('input[id="bgcolor_field"]').val();
        $(".table").css({"background-color":color});
    }

    closePopUp()
});

var colForAddCard;

$( ".column__add-card" ).click(function() {
    $(".popup").css({"display":"block"});
    $(".popup__add-card").css({"display":"block"});
    colForAddCard = $(this);
});


$( ".add-card-form" ).submit(function(e) {
    e.preventDefault();
    const $form = $(this);
    $form.find('.error').remove();

    if ($form.find('input[id="add_card_field"]').val() !== '') {
        let cardName = $form.find('input[id="add_card_field"]').val();
        $(colForAddCard).siblings('.column__list-cards').append($('<a>', {
            'text': cardName,
            'class': 'column__card card'
        }));
    }

    closePopUp()
});
