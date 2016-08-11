for (var i = 0; i < data.length; i++) {
	if (data[i] === undefined) {
		console.log("the value %s is undefined", i);
	}
	else
	if (data[i] === null) {
		console.log("the value %s is null", i);
	}
	else {
		console.log("data[%s]=%s", i, data[i]);
	}
}
