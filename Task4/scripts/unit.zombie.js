Unit.Zombie = function($line) {
	var $zombie = $("<div></div>");
	var $healthProgress = createHealthProgress();
	
	this.step = 1;
	this.health = 80;
	this.maxHealth = this.health;

	$zombie.addClass("zombie");
	$zombie.appendTo($line);	

	this.die = function() {
		$zombie.remove();
	}

	this.move = function(step) {
		var leftPosition = $zombie.position().left;
		
		if(Math.floor(leftPosition) > 0) {
			$zombie.css("left", leftPosition - step);
			return true;
		}
		
		return false;
	}

	this.changeHealth = function(value) {
		this.health -= value;
		
		if (this.health <= 0) {
			this.die();
			return false;
		}
		else {
			changeHealthProgress.call(this);
			return true;
		}
	}

	function createHealthProgress() {
		var $progressLayout = $("<div></div>").addClass("progress");
		var $progressValue = $("<div></div>").addClass("progress-value");
		
		$progressValue.appendTo($progressLayout);
    	$progressLayout.appendTo($zombie);

    	return $progressValue;
	}

	function changeHealthProgress() {
		var newValue =  this.health / this.maxHealth * 100;		
		$healthProgress.width(newValue + "%");
	}

	return { $zombie: $zombie };
}