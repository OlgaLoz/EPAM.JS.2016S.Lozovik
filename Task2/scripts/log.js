function logData(data) {
	for (var i = 1; i <= 3; i++) {
		var count = 0;
		var method = "getCount" + i;
		
		for (var j = 0; j < data.length; j++) {
			if (method in data[j]) {
				count += data[j][method]();
			}
		}		
		
		console.log("count{%s}=%d", i, count);
	}
}