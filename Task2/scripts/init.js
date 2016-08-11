function init() {
	var array = []; 
	for (var i = 0; i < 5; i++) {
		array[i] = createElement();
	}	
	logData(array);
}

function createElement() {
	var type = random(1, 3);
	var element = {};
	element.count = random(1, 10);
	element["getCount" + type] = function() {
		return this.count;
	};	
	return element;
}

init();