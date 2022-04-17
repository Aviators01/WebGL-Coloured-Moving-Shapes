/*
Timothy Queva
CS3110 Midterm Exam
Nov. 4, 2020
*/

//This is for midterm question 2

var VSHADER_SOURCE =
	'attribute vec4 a_position;\n' +
	'attribute vec4 a_Color;\n' +
	'varying vec4 v_Color;\n' +
	'attribute mat4 rotMatrix;\n' +
	'uniform mat4 u_modelMatrix;\n' +
	'void main(){ \n' +
	'	gl_Position = u_modelMatrix * a_position;\n' +
	'	v_Color = a_Color;\n' +
	'}\n';

var FSHADER_SOURCE =
	'precision mediump float;\n' +
	'varying vec4 v_Color;\n' +
	'void main(){ \n' +
	'	gl_FragColor = v_Color;\n' +
	'}\n';

function main(){
	//Gets the canvas
	var canvas = document.getElementById('Midterm');
	
	//Gets the WebGL rendering context in order for us to use the webgl system
	var gl = getWebGLContext(canvas);
	
	//This initializes the shaders. Parameters are (rendering context,vshader,fshader)
	var stat;
	stat = initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	if(!stat) console.log("Shaders failed to initialize");
	
	//This code section gets the memory location of the WebGL variables we specified earlier(a_position,u_FragColor)
	//Parameters are (program,name)
	var a_Color = gl.getAttribLocation(gl.program,'a_Color');
	var a_position = gl.getAttribLocation(gl.program,'a_position');
	var u_modelMatrix = gl.getUniformLocation(gl.program,'u_modelMatrix');

	//Clears the canvas. ie. cleans the drawing area.
	gl.clearColor(0.0,0.0,0.0,0.5);	//This specifies the color
	gl.clear(gl.COLOR_BUFFER_BIT);	//This actually cleans the canvas with the specified color
	
	var modelMat = new Matrix4();
	modelMat.setIdentity();
	
	var vertexCount = 360;
	var verticesNColour = new Float32Array(makeCircleVertices(-0.1,0.1,0.3,vertexCount));
	var verticesNColour2 = new Float32Array(makeCircleVertices(-0.1,0.1,0.3,vertexCount));
	
	var angle=0.0;
	var tick = function(){
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		circleTL(gl,a_position,a_Color,angle,modelMat,u_modelMatrix,verticesNColour);
		circleTR(gl,a_position,a_Color,angle,modelMat,u_modelMatrix,verticesNColour2);
		circleBL(gl,a_position,a_Color,angle,modelMat,u_modelMatrix,verticesNColour2);
		circleBR(gl,a_position,a_Color,angle,modelMat,u_modelMatrix,verticesNColour);
		
		angle += 1;
		if(angle>360) angle=0;
		
		requestAnimationFrame(tick,canvas);
	}
	tick();
}

function circleTL(gl,position,colour,angle,modelMat,u_modelMatrix,verticesNColour){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	gl.bufferData(gl.ARRAY_BUFFER,verticesNColour,gl.STATIC_DRAW);
	
	//
	var FSIZE = verticesNColour.BYTES_PER_ELEMENT;
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,FSIZE*5,0);
	
	//5. Enable the assignment (position)
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for rotating/transformation and transfers to WebGL system
	modelMat.setTranslate(-0.5,0.5,0);
	modelMat.rotate(angle,0,0,1);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//4./5. Enable the assignment (colour)
	gl.vertexAttribPointer(colour, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(colour);
	
	//Draws the circle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN,0,360);
}

function circleTR(gl,position,colour,angle,modelMat,u_modelMatrix,verticesNColour){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	gl.bufferData(gl.ARRAY_BUFFER,verticesNColour,gl.STATIC_DRAW);
	
	//
	var FSIZE = verticesNColour.BYTES_PER_ELEMENT;
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,FSIZE*5,0);
	
	//5. Enable the assignment (position)
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for rotating/transformation and transfers to WebGL system
	modelMat.setTranslate(0.5,0.5,0);
	modelMat.rotate(angle,0,0,1);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//5. Enable the assignment (colour)
	gl.vertexAttribPointer(colour, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(colour);
	
	//Draws the circle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN,0,360);
}

function circleBL(gl,position,colour,angle,modelMat,u_modelMatrix,verticesNColour){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	gl.bufferData(gl.ARRAY_BUFFER,verticesNColour,gl.STATIC_DRAW);
	
	//
	var FSIZE = verticesNColour.BYTES_PER_ELEMENT;
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,FSIZE*5,0);
	
	//5. Enable the assignment (position)
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for rotating/transformation and transfers to WebGL system
	modelMat.setTranslate(-0.5,-0.5,0);
	modelMat.rotate(angle,0,0,1);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//5. Enable the assignment (colour)
	gl.vertexAttribPointer(colour, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(colour);
	
	//Draws the circle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN,0,360);
}

function circleBR(gl,position,colour,angle,modelMat,u_modelMatrix,verticesNColour){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	gl.bufferData(gl.ARRAY_BUFFER,verticesNColour,gl.STATIC_DRAW);
	
	//
	var FSIZE = verticesNColour.BYTES_PER_ELEMENT;
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,FSIZE*5,0);
	
	//5. Enable the assignment (position)
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for rotating/transformation and transfers to WebGL system
	modelMat.setTranslate(0.5,-0.5,0);
	modelMat.rotate(angle,0,0,1);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//5. Enable the assignment (colour)
	gl.vertexAttribPointer(colour, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(colour);
	
	//Draws the circle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN,0,360);
}

function makeCircleVertices(centerX,centerY,radius,vertexCount){
	var circleData=[];
	
	for(var i=0;i<=vertexCount;i++){
		var angle = i/vertexCount*2*Math.PI;
		circleData.push(centerX+radius*Math.cos(angle));
		circleData.push(centerY+radius*Math.sin(angle));
		circleData.push(Math.random());
		circleData.push(Math.random());
		circleData.push(Math.random());
	}
	return circleData;
}