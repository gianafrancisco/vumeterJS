var uvmeter;
var uvmeter2;
var uvmeter3;
function Init() {
	uvmeter = new VUMeter({
		value : .10,
		container : 'uvmeter',
		gscale : 1,
		width: 400,
		scale : 'lineal',
		tau: 100,
		min : 0,
		max : 380,
		unit: 'Volt',
		marks : [ 0, 100, 200, 300 ],
		values : [ 10, 100, 200, 300 ,380],
		label: "linear",
		theme: '1'
	});
	uvmeter2 = new VUMeter({
		value : 0.5,
		container : 'uvmeter2',
		gscale : 1,
		scale : 'logarithmic',
		min : 0.1,
		max : 380,
		tau: 70,
		unit: 'Volt',
		marks : [ 10, 100, 200,260, 360, 300 ],
		values : [0.1, 10, 100, 200,260,360, 300 ],
		label: "logarithmic",
		theme: '1'
	});
	uvmeter3 = new VUMeter({
		value : 1,
		container : 'uvmeter3',
		gscale : 1,
		scale : 'quadratic',
		min : 0,
		max : 380,
		tau: 90,
		unit: 'Volt',
		marks : [ 10, 100, 200, 300 ],
		values : [ 10, 100, 200, 300 ,380],
		label: "quadratic",
                theme: '1'
	});
	
//	setTimeout("uvmeter.setValue(1200)", 2000);
//	setTimeout("uvmeter.setValue(2000)", 2800);
//	setTimeout("uvmeter.setValue(1500)", 7000);
//	setTimeout("uvmeter.setValue(100)", 9000);
//	setTimeout("uvmeter.setValue(2400)", 9500);
//
//	setTimeout("uvmeter2.setValue(50)", 2000);
//	setTimeout("uvmeter2.setValue(200)", 4000);
//	setTimeout("uvmeter2.setValue(100)", 7000);
//
//	setTimeout("uvmeter3.setValue(100)", 2000);
//	setTimeout("uvmeter3.setValue(380)", 4000);
//	setTimeout("uvmeter3.setValue(200)", 7000);
}
