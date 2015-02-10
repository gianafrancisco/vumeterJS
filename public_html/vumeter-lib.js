/*
   Copyright 2012 Francisco Giana <gianafrancisco@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

var VUMeter = function(options) {
	var settings = {
		width : (options.width === undefined ? 400 : options.width),
		height : 200,
		// height : (options.height == null ? 200 : options.height),
		value : (options.value === undefined ? 89 : options.value),
		graficarValores : (options.values === undefined ? [ 0.01, 0.1, 1, 10, 100,
				1000 ] : options.values),
		graficarLineas : (options.marks === undefined ? [ 0.01, 0.1, 1, 10, 100, 1000 ]
				: options.marks),
		container : (options.container === undefined ? 'VUmeter' : options.container),
		labelText : (options.label === undefined ? 'VUMeter' : options.label),
		// gscale : (options.gscale == null ? 1 : options.gscale),
		gscale : 1,
		min : (options.min === undefined ? 0.01 : options.min),
		max : (options.max === undefined ? 1000 : options.max),
		unit : (options.unit === undefined ? '%' : options.unit),
		tscale : (options.tscale === undefined ? 'lineal' : options.scale),
		tau : (options.tau === undefined ? 50 : options.tau),
		theme : (options.theme === undefined ? 1 : options.theme)
	/* lineal, logarithmic, quadratic */

	};
	settings.gscale = settings.width / 400;
	var min = settings.min;
	var max = settings.max;
	var w = 400 * settings.gscale;
	var h = settings.height * settings.gscale;
	// var w = settings.width * settings.gscale;
	// var h = settings.height * settings.gscale;
	var value = settings.value;
	var value_actual = min;
	var delta_value = value - min;
	var frameN = 0;
	var value_graficar = 0;
	var tau = settings.tau;
	var Indicador;
	var sLabelText;
	var sPorcentaje;
	var Escala;

	var theme = new Object();
	theme[1] = {
		Xpos : w / 2,
		Ypos : 1.5 * h,
		txtXpos : h * 0.7,
		unitXpos : h * 0.5,
		img_src : '1',
		angmin : 130,
		angmax : 50,
		radio_mayor : 250,
		radio_menor : 10
	};
	theme[2] = {
		Xpos : w / 2,
		Ypos : 1.5 * h,
		txtXpos : h * 0.8,
		unitXpos : h * 0.5,
		img_src : '2',
		angmin : 130,
		angmax : 50,
		radio_mayor : 250,
		radio_menor : 10
	};
	theme[3] = {
		Xpos : w / 2,
		Ypos : 1.5 * h,
		txtXpos : h * 0.7,
		unitXpos : h * 0.5,
		img_src : '3',
		angmin : 130,
		angmax : 50,
		radio_mayor : 250,
		radio_menor : 10
	};

	var angmin = theme[settings.theme].angmin;
	var angmax = theme[settings.theme].angmax;
	var radio_mayor = theme[settings.theme].radio_mayor * settings.gscale;
	var radio_menor = theme[settings.theme].radio_menor * settings.gscale;
	var Xpos = theme[settings.theme].Xpos;
	var Ypos = theme[settings.theme].Ypos;
	var txtXpos = theme[settings.theme].txtXpos;
	var unitXpos = theme[settings.theme].unitXpos;

	var val2deg = function(val) {
		var perCent;
		var min, max;
		min = settings.min;
		max = settings.max;

		val = (val < min) ? min : val;
		val = (val > max) ? max : val;

		if (settings.tscale === 'logarithmic') {
			min = Math.log(settings.min);
			max = Math.log(settings.max);
			val = Math.log(val);
		} else if (settings.tscale === 'quadratic') {
			min = Math.pow(settings.min, 2);
			max = Math.pow(settings.max, 2);
			val = Math.pow(val, 2);
		} else if (settings.tscale === 'square_root') {
			min = Math.sqrt(settings.min, 2);
			max = Math.sqrt(settings.max, 2);
			val = Math.sqrt(val, 2);
		}
		perCent = (val - min) * 100 / (max - min);
		return -(angmin - angmax) * perCent / 100 + angmin;
	};
	var ang_value = val2deg(settings.value);
	var grad2rad = function(grad) {
		return (-1) * grad * Math.PI / 180;
	};
	this.setValue = function(val) {
		if (val !== value) {
			value_actual = value_graficar;
			delta_value = val - value_graficar;
			frameN = 0;
			value = val;
			// stage.start();
		}

	};
	var stage = new Kinetic.Stage({
		container : settings.container,
		width : w,
		height : h
	});

	var layerBackground = new Kinetic.Layer();
	var layerEscala = new Kinetic.Layer();
	var layerEscala_Lineas = new Kinetic.Layer();
	var layerIndicador = new Kinetic.Layer();
	var layerText = new Kinetic.Layer();

	var image_fondo2 = new Image();

	var image_fondo;
	image_fondo2.onload = function() {
		image_fondo = new Kinetic.Image({
			x : 0,
			y : 0,
			image : image_fondo2,
			width : w,
			height : h
		});
		layerBackground.add(image_fondo);

		var image_base2 = new Image();
		image_base2.src = './images/' + theme[settings.theme].img_src
				+ '/base_vumeter.jpg';
		var image_base = new Kinetic.Image({
			x : 0,
			y : h * (1 - 0.11475),
			image : image_base2,
			width : w,
			height : h * 0.11475
		});

		Escala = new Kinetic.Shape({
			drawFunc : function() {
				var context = this.getContext();
				context.beginPath();
				context.arc(Xpos, Ypos, radio_mayor, grad2rad(angmin),
						grad2rad(angmax), false);
				this.fillStroke();
			},
			stroke : "black",
			strokeWidth : 2
		});
		layerEscala.add(Escala);
		var points = [
				{
					x : Xpos,
					y : Ypos
				},
				{
					x : ((radio_mayor + radio_menor) * Math
							.cos(grad2rad(ang_value)))
							+ Xpos,
					y : ((radio_mayor + radio_menor) * Math
							.sin(grad2rad(ang_value)))
							+ Ypos
				} ];

		Indicador = new Kinetic.Line({
			points : points,
			stroke : "black",
			strokeWidth : 2,
			lineCap : 'round',
			lineJoin : 'round'

		});

		layerIndicador.add(Indicador);

		layerIndicador.add(image_base);

		var lXX;
		var points2;
		points2 = [
				{
					x : (radio_mayor * Math.cos(grad2rad(val2deg(min)))) + Xpos,
					y : (radio_mayor * Math.sin(grad2rad(val2deg(min)))) + Ypos
				},
				{
					x : ((radio_mayor + radio_menor) * Math
							.cos(grad2rad(val2deg(min))))
							+ Xpos,
					y : ((radio_mayor + radio_menor) * Math
							.sin(grad2rad(val2deg(min))))
							+ Ypos
				} ];
		lXX = new Kinetic.Line({
			points : points2,
			stroke : "black",
			strokeWidth : 2,
			lineCap : 'round',
			lineJoin : 'round'

		});
		layerEscala_Lineas.add(lXX);
		points2 = [
				{
					x : (radio_mayor * Math.cos(grad2rad(val2deg(max)))) + Xpos,
					y : (radio_mayor * Math.sin(grad2rad(val2deg(max)))) + Ypos
				},
				{
					x : ((radio_mayor + radio_menor) * Math
							.cos(grad2rad(val2deg(max))))
							+ Xpos,
					y : ((radio_mayor + radio_menor) * Math
							.sin(grad2rad(val2deg(max))))
							+ Ypos
				} ];
		lXX = new Kinetic.Line({
			points : points2,
			stroke : "black",
			strokeWidth : 2,
			lineCap : 'round',
			lineJoin : 'round'

		});
		layerEscala_Lineas.add(lXX);
		for ( var k = 0; k < settings.graficarLineas.length; k++) {
			points2 = [
					{
						x : (radio_mayor * Math
								.cos(grad2rad(val2deg(settings.graficarLineas[k]))))
								+ Xpos,
						y : (radio_mayor * Math
								.sin(grad2rad(val2deg(settings.graficarLineas[k]))))
								+ Ypos
					},
					{
						x : ((radio_mayor + radio_menor) * Math
								.cos(grad2rad(val2deg(settings.graficarLineas[k]))))
								+ Xpos,
						y : ((radio_mayor + radio_menor) * Math
								.sin(grad2rad(val2deg(settings.graficarLineas[k]))))
								+ Ypos
					} ];
			lXX = new Kinetic.Line({
				points : points2,
				stroke : "black",
				strokeWidth : 2,
				lineCap : 'round',
				lineJoin : 'round'

			});
			layerEscala_Lineas.add(lXX);
		}

		for ( var i = 0; i < settings.graficarValores.length; i++) {

			var sXX = new Kinetic.Text(
					{
						x : (radio_mayor + radio_menor - 20 * settings.gscale)
								* Math
										.cos(grad2rad(val2deg(settings.graficarValores[i])))
								+ Xpos,
						y : (radio_mayor + radio_menor - 20 * settings.gscale)
								* Math
										.sin(grad2rad(val2deg(settings.graficarValores[i])))
								+ Ypos,
						text : settings.graficarValores[i],
						fontSize : 12 * settings.gscale,
						fontFamily : "Calibri",
						textFill : "black",
						align : "center",
						verticalAlign : "middle"
					});
			layerText.add(sXX);
		}
		sPorcentaje = new Kinetic.Text({
			x : Xpos,
			y : unitXpos,
			text : "[ " + settings.unit + " ]",
			fontSize : 16 * settings.gscale,
			fontFamily : "Calibri",
			textFill : "black",
			align : "center",
			verticalAlign : "middle"
		});
		layerText.add(sPorcentaje);
		sLabelText = new Kinetic.Text({
			x : Xpos,
			y : txtXpos,
			text : settings.labelText,
			fontSize : 16 * settings.gscale,
			fontFamily : "Calibri",
			textFill : "red",
			align : "center",
			verticalAlign : "middle"
		});
		layerText.add(sLabelText);

		// add the layer to the stage
		stage.add(layerBackground);
		stage.add(layerEscala);
		stage.add(layerText);
		stage.add(layerEscala_Lineas);
		stage.add(layerIndicador);
		stage.start();
	};

	image_fondo2.src = './images/' + theme[settings.theme].img_src
			+ '/vumeter.jpg';

	stage.onFrame(function(frame) {

		value_graficar = value_actual + delta_value
				* (1 - Math.exp(-1 * (frameN) / tau));

		points = [
				{
					x : Xpos,
					y : Ypos
				},
				{
					x : ((radio_mayor + radio_menor) * Math
							.cos(grad2rad(val2deg(value_graficar))))
							+ Xpos,
					y : ((radio_mayor + radio_menor) * Math
							.sin(grad2rad(val2deg(value_graficar))))
							+ Ypos
				} ];

		Indicador.setPoints(points);
		frameN++;
		layerIndicador.draw();
	});

};
