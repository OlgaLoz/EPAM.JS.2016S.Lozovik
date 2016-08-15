function disableButton(name) {
    $(name).attr("disabled", true);
    $(name).addClass("disabled-button");
}

function enableButton(name) {
    $(name).attr("disabled", false);
    $(name).removeClass("disabled-button");
}

$(document).ready(function() {
    var divCount = 160;
    var numbers = [];

    disableButton("#colorBtn");
    disableButton("#resetBtn");

    $("#generateBtn").click(function() {
    	var divs = "";
        numbers = createArray(divCount);

    	for (var i = 0; i < divCount; i++) {
    		divs += "<div class=\"small-block\">" + numbers[i].number + "</div>";
    	}   

    	$(".content").append(divs);   

        disableButton(this) 
        enableButton("#colorBtn");
        enableButton("#resetBtn");
    });

    $("#colorBtn").click(function() {
        setColors(numbers);

        $(".content .small-block").each(function(i) {
            $(this).css("background-color", numbers[i].color);
        });

        disableButton(this);
    });

    $("#resetBtn").click(function() {
        $(".content").empty();

        numbers = [];

        disableButton("#colorBtn");
        disableButton(this);
        enableButton("#generateBtn");
    });
});