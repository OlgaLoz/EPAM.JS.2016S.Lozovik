function random(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function createArray(length) {
	var result = [];
	for (var i = 0; i < length; i++) {
		var obj = { number:random(1,100) };	
		result[i] = obj;
	}
	
	return result;
}

function getColor(value){
	if (value > 75) {
		return "#f44336";
	} 
	else if (value > 50) {
		return "#ff9800";
	} 
	else if (value > 25) {
		return "#4caf50";
	}
	else {
		return "#ffffff";
	}
}

function setColors(array) {
	for (var i = 0; i < array.length; i++) {
		array[i].color = getColor(array[i].number);
	}
}