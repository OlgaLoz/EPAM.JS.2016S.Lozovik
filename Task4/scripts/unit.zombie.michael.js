Unit.Zombie.Michael = function($line) {
	var protectedFields = Unit.Zombie.call(this, $line);
	var $zombie = protectedFields.$zombie;
	var parentMove = this.move;
	
	this.health = 110;
	this.maxHealth = this.health;
	
	var parentStep = this.step;
	this.step = 3;
	var currentStep = this.step;

	$zombie.addClass("michael");
	
	this.move = function() {
		return parentMove.call(this, currentStep);
	}

	this.toggleStep = function() {
		currentStep = currentStep == parentStep ? this.step : parentStep;
	}
}