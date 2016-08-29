Unit.Zombie.Strong = function($line) {
	var protectedFields = Unit.Zombie.call(this, $line);
	var $zombie = protectedFields.$zombie;
	var parentMove = this.move;

	this.health = 180;
	this.maxHealth = this.health;

	var parentStep = this.step;
	this.step = 2;
	var currentStep = this.step;

	$zombie.addClass("strong");	
	
	this.move = function() {
		return parentMove.call(this, currentStep);
	}

	this.toggleStep = function() {
		currentStep = currentStep == parentStep ? this.step : parentStep;
	}
}