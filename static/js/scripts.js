
$( ".customization" ).click(function() {
    $(".popup").css({"visibility":"visible"});
    $(".popup__customization").css({"visibility":"visible"});
});


function closePopUp() {
    $(".popup").css({"visibility":"hidden"});
    $(".popup > *").css({"visibility":"hidden"});
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
