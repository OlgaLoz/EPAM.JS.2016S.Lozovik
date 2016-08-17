$(document).ready(function() {
    var divCount = 160;
    var numbers = [];

    touggleButton("#colorBtn");
    touggleButton("#resetBtn");

    $("#generateBtn").click(function() {
    	var divs = "";
        for (var i = 0; i < divCount; i++) {
            numbers[i] = random(1,100);
            divs += "<div class=\"small-block\">" + numbers[i] + "</div>";
        }

    	$(".content").append(divs);   

        touggleButton(this) 
        touggleButton("#colorBtn");
        touggleButton("#resetBtn");
    });

    $("#colorBtn").click(function() {
        $(".content .small-block").each(function(i) {
            $(this).addClass(getColor(numbers[i]));
        });

        touggleButton(this);
    });

    $("#resetBtn").click(function() {
        $(".content").empty();
        numbers = [];

        if (!$("#colorBtn").hasClass("disabled")) {
            touggleButton("#colorBtn");
        }       
        touggleButton(this);
        touggleButton("#generateBtn");
    });

    function touggleButton(name) {
        $(name).toggleClass("disabled");
    }

    function random(min, max) {
        return Math.floor((Math.random() * max) + min);
    }

    function getColor(value) {
        if (value > 75) {
            return "color-red";
        } 
        else if (value > 50) {
            return "color-orange";
        } 
        else if (value > 25) {
            return "color-green";
        }
    }
});