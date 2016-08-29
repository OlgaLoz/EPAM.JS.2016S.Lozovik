Unit.Zombie.Balloon = function($line) {
	var protectedFields = Unit.Zombie.call(this, $line);
	var $zombie = protectedFields.$zombie;
	var parentMove = this.move;
	
	this.maxHealth = this.health;
	
	var parentStep = this.step;
	this.step = 4;
	var currentStep = this.step;
	
	$zombie.addClass("balloon");

	this.move = function() {
		return parentMove.call(this, currentStep);
	}

	this.toggleStep = function() {
		currentStep = currentStep == parentStep ? this.step : parentStep;
	}



}