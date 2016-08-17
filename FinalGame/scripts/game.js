$(document).ready(function() {

    var resourceTimer = null;
    var bombTimer = null;
    var game = false;
    var resources = ["coconut", "passion", "peach", "watermelon"];
    var bomb = "bomb";
    var resourceValues = [];
    for (var i = 0; i < resources.length; i++) {
        resourceValues[resources[i]] = (i + 1) * 10;
    };

    var points = [];
    for (var i = 0; i < resources.length; i++) {
        points[resources[i]] = 0;
    };

    var $gameField = $(".center");
    var fieldWidth = $gameField.width();
    var fieldHeight = $gameField.height();

    var bangRadius = 200;
    var resourceSize = 64;

    var levelData = {
        currentSpeed: 1,
        levelStep: 100,
        bombGenerate: 7000,
        bombExist: 2000,
        resourceGenerate: 1000,
        resourceExist: 7000
    };

    $("#controllButton").on("click", updateGameStatus);
    $("#stopButton").on("click", stopGame);
    $(".center").on("click", ".resource:not(.bomb)", increasePointCount);

    $(window).blur(function(e) {
        if(game) {
            updateGameStatus();
        }
    });

    function updateGameStatus() {
        if (!game) {
           startGame();
        }
        else {
            pauseGame();
        }
        game = !game;
    }

    function startGame() {
        $("#controllButton").addClass("pause-button");
       
        resourceTimer = setTimeout(generateResourceTick, levelData.resourceGenerate);
        bombTimer = setTimeout(generateBombTick, levelData.bombGenerate);
        
        //select resources without <p/> in them
        $(".center .resource:empty").each(function(i) {
            var $resource = $(this);
            var time = $resource.hasClass("bomb") 
                ? levelData.bombExist 
                : levelData.resourceExist;
            $resource.removeClass("avoid-clicks");          
            $resource.fadeTo(time, 1,  function() {
                if ($resource.hasClass("bomb")) {
                    bombBang($resource.position().top, $resource.position().left);
                }
                $resource.remove();
            });
        });
    }

    function pauseGame() {
        $("#controllButton").removeClass("pause-button");
        
        $(".center .resource:empty").each(function(i) {
            var $resource = $(this);
            $resource.addClass("avoid-clicks");
            $resource.stop();
        });
        
        clearTimeout(bombTimer);
        clearTimeout(resourceTimer);
    }

    function stopGame() {
        $("#controllButton").removeClass("pause-button");
        $(".center").empty();

        for (var i = 0; i < resources.length; i++) {
            points[resources[i]] = 0;
            $("#" + resources[i] + " p").text("-");
        };
        
        $(".score p").text(0);
        $(".level p").text(1);

        clearTimeout(bombTimer);
        clearTimeout(resourceTimer);
    }

    function generateResourceTick() { 
        var name = resources[random(resources.length)];
        var $resource = createResource(name, levelData.resourceExist);
        $resource.fadeTo(levelData.resourceExist, 1,  function() {
            $resource.remove();
        });

        resourceTimer = setTimeout(generateResourceTick, levelData.resourceGenerate);
    }

    function generateBombTick() {
        var $resource = createResource(bomb, levelData.resourceExist);
        $resource.fadeTo(levelData.bombExist, 1,  function() {
            bombBang($resource.position().top, $resource.position().left);
            $resource.remove();
        });  

        bombTimer = setTimeout(generateBombTick, levelData.bombGenerate);
    }

    function createResource(name, time) {
        var $resource = $("<div/>").addClass("resource " + name);

        $resource.css({
            "left": random(fieldWidth - resourceSize),
            "top": random(fieldHeight - resourceSize),
        });

        $resource.appendTo(".center");

        return $resource;
    }

    function increasePointCount() {
        var $resource = $(this);
        var name = getName($resource);

        points[name] += resourceValues[name];
        updatePointValue(name);
        showPointDifference($resource, "plus");
    }

    function decreasePointCount(resourceName){
        points[resourceName] -= resourceValues[resourceName];
        updatePointValue(resourceName);
    }

    //add <p/> in .resource to show obtained points
    function showPointDifference($resource, cssClass) {
        var name = getName($resource);

        $resource.css("opacity", "1");
        $resource.addClass("avoid-clicks");
        $resource.removeClass(name);
        $resource.stop();

        $resource.html("<p>" + resourceValues[name] + "</p>");
        if (cssClass) {
             $resource.addClass(cssClass);
        };
        
        $resource.fadeOut(500,  function() {
            $resource.remove();
        });   
    }

    function updatePointValue(resourceName) {
        var newText = points[resourceName];

        if (points[resourceName] <= 0) {
            points[resourceName] = 0;
            newText = "-";
        };

        var score = getTotalScore();

        $("#" + resourceName + " p").text(newText);
        $(".score p").text(score);

        if (score >= levelData.currentSpeed * levelData.levelStep) {
            generateNextLevel();
            $(".level p").text(levelData.currentSpeed);
        }
    }

    function bombBang(bombTop, bombLeft) {
        function isInBangZone($resource) {
            var position = $resource.position();

            //check if resource is in rectangle bangRadius x bangRadius
            if (position.top > top 
                && position.top < top + 2 * bangRadius
                && position.left > left
                && position.left < left + 2 * bangRadius) {
                
                return true;
            }

            return false;
        }
        
        var top = (bombTop > bangRadius) ? bombTop - bangRadius : 0;
        var left = (bombLeft > bangRadius) ? bombLeft - bangRadius : 0;

        $(".center .resource:empty").not(".bomb").each(function(i) {
            var $resource = $(this);
            if (isInBangZone($resource)) {
                decreasePointCount(getName($resource));
                showPointDifference($resource, "minus");
            }
        });
    }

    function getTotalScore() {
        var result = 0;
        for (var i = 0; i < resources.length; i++) {
            result += points[resources[i]];
        }

        return result;
    }

    function getName($resource) {
        var path = $resource.css("background-image");
        return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));   
    }

    function random(max) {
        return Math.floor(Math.random() * max);
    }

    function generateNextLevel() {
        levelData.currentSpeed++;
        levelData.bombGenerate -= (levelData.bombGenerate > 1000) ? 500 : 0;
        levelData.resourceGenerate -= (levelData.resourceGenerate > 500) ? 50 : 0;
        levelData.resourceExist -= (levelData.resourceExist > 1000) ? 500 : 0;
    }
});