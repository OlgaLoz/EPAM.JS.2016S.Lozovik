$(document).ready(function() {
	var zombies = [];
	var generatedZombies = 0;
	//once during this time zombie move on one step(in accordance with its speed)
	var zombieSpeed = 300;
	var gameState = {
		isPaused: false,
		isEnded: false, 
		isZombiesSlow: false
	};
	var timer = {
		generate: null,
		growOld: null,
		move: null,
		btnExplode: null,
		btnSlow: null,
		btnGrow: null
	};

	$("#btnExplode").addClass("disabled");
	$("#btnSlow").addClass("disabled");
	$("#btnGrow").addClass("disabled");

	$("#btnStart").on("click", startGame);
	$("#btnExplode").on("click", damage);
	$("#btnSlow").on("click", makeSlow);
	$("#btnGrow").on("click", growOld);

	$("html").keydown(function() { 
		var spaceCode = 32;
  		if (!gameState.isEnded && event.keyCode == spaceCode) { 
    		pauseGame();
  		}
	});

	$(window).blur(function(e) {
        if(!gameState.isPaused && !gameState.isEnded) {
            pauseGame();
        }
    });

	function startGame() {
		$("#field .text-container").remove();
		$("#btnStart").addClass("disabled");

		$("#btnExplode").removeClass("disabled");
		$("#btnSlow").removeClass("disabled");
		$("#btnGrow").removeClass("disabled");

		timer.move = setTimeout(moveZombies, 100);
		timer.generate = setTimeout(generateZombie, 0);
	}

	function generateZombie() {
		var time = 2500;
		var levelCharacteristic = 5;

		createZombie();
		generatedZombies++;

		//to know when change the level
		if (generatedZombies % levelCharacteristic == 0) {
			increaseLevel();
		}

		timer.generate = setTimeout(generateZombie, time);

		function createZombie() {
			var lineNumber = random(0, 5);
			var $line = $(".field-line").eq(lineNumber);
			
			var zombieNumber = random(0, 3);
			var zombie = null;

			switch (zombieNumber) {
				case 0:
					zombie = new Unit.Zombie.Michael($line);
					break;
				case 1:
					zombie = new Unit.Zombie.Strong($line);
					break;
				case 2:
					zombie = new Unit.Zombie.Balloon($line);
			}

			if (gameState.isZombiesSlow) {
				zombie.toggleStep();
			}

			zombies.push(zombie);
		}
	}

	function moveZombies() {
		for (var i = 0; i < zombies.length; i++) {
			if (!zombies[i].move()) {
				gameOver();
				return;
			}
		}

		timer.move = setTimeout(moveZombies, zombieSpeed);
	}

	function killZombies() {
		for (var i = 0; i < zombies.length; i++) {
			zombies[i].die();
		}

		zombies = [];
	}

	function makeSlow() {
		var time = 10000;
		
		gameState.isZombiesSlow = true;
		toggleButton("#btnSlow", time, 0.5);
	
		for (var i = 0; i < zombies.length; i++) {
			zombies[i].toggleStep();
		}

		timer.btnSlow = setTimeout(function() {
			for (var i = 0; i < zombies.length; i++) {
				zombies[i].toggleStep();
			}
			
			gameState.isZombiesSlow = false;
			
			if (!gameState.isEnded) {
				toggleButton("#btnSlow", 0, 1);
			}
		}, time);
	}

	function damage(argument) {
		var time = 2000;
		var healthDamage = 15;
		
		changeHealth(healthDamage);
		toggleButton("#btnExplode", time, 0.5);
		timer.btnExplode = setTimeout(function() {
			if (!gameState.isEnded) {
				toggleButton("#btnExplode", 0, 1);
			}
		}, time);
	}

	function changeHealth(value) {
		for (var i = 0; i < zombies.length; i++) {
			if (!zombies[i].changeHealth(value)) {
				zombies[i].die();
				zombies.splice(i, 1);
			}	
		}
	}

	function growOld() {
		var time = 10000;
		var healthDamage = 1;

		callback();

		toggleButton("#btnGrow", time, 0.5);
		timer.btnGrow = setTimeout(function() {
			clearTimeout(timer.growOld);
			if (!gameState.isEnded) {
				toggleButton("#btnGrow", 0, 1);
			}
		}, time);

		function callback() {
			changeHealth(healthDamage);
			timer.growOld = setTimeout(callback, 1000);		
		}	
	}

	function gameOver() {
		$("#btnStart").removeClass("disabled");

		disableButton("#btnExplode");
		disableButton("#btnSlow");
		disableButton("#btnGrow");

		clearTimeout(timer.move);
		clearTimeout(timer.generate);

		zombieSpeed = 300;
		generatedZombies = 0;
		gameState.isEnded = true;
		killZombies();
		createTextInfo("Game Over");

	}

	function pauseGame() {
		if (gameState.isPaused) {
			timer.move = setTimeout(moveZombies, 0);
			timer.generate = setTimeout(generateZombie, 2500);

			$("#btnExplode").removeClass("disabled");
			$("#btnSlow").removeClass("disabled");
			$("#btnGrow").removeClass("disabled");

			//to make zombies fast after pause
			if (gameState.isZombiesSlow) {
				for (var i = 0; i < zombies.length; i++) {
					zombies[i].toggleStep();
				}
				gameState.isZombiesSlow = false;
			}

			$(".pause").hide();
		}
		else {
			clearTimeout(timer.move);
			clearTimeout(timer.generate);
			clearTimeout(timer.growOld);
			clearTimeout(timer.btnExplode);
			clearTimeout(timer.btnSlow);
			clearTimeout(timer.btnGrow);

			$(".pause").show();
			disableButton("#btnExplode");
			disableButton("#btnSlow");
			disableButton("#btnGrow");
		}

		gameState.isPaused = !gameState.isPaused;
	}

	//to show "GameOver" and "NextWave" text
	function createTextInfo(text) {
		var $div = $("<div></div>").addClass("text-container");
		var $paragraph = $("<p></p>").text(text);
		
		$div.html($paragraph);
		$("#field").append($div);

		return $div;
	}

	//to disable buttons in the end of the game
	function disableButton(id) {
		var button = $(id);
		if (button.hasClass("disabled")) {
			button.stop();
			button.fadeTo(0, 1);
		}
		else {
			button.addClass("disabled");
		}
	}

	//to animate game buttons
	function toggleButton(id, time, value) {
		var button = $(id);
		button.toggleClass("disabled");
		button.fadeTo(time, value);
	}

	function increaseLevel() {
		var minSpeed = 50;
		var speedDifference = 20;

		if (zombieSpeed >= minSpeed) {
			zombieSpeed -= speedDifference;
			
			var $lastWaveDiv = createTextInfo("Next Wave");
			
			$lastWaveDiv.fadeTo(1000, 0, function() {
				this.remove();
			});
		}
	}
});