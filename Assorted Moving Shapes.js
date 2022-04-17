/* 
Timothy Queva
CS3110 Lab5
November 18, 2020
*/

/*
In this file, we will create four shapes: a "Z", triangle, circle, and triangle fan shape thing.
We will then animate them. The "Z" will be rotating, the circle will continuously scale over the
Z axis, and the other two will be continuously translating.
*/

/*Temp:
var xformMatrix = new Float32Array([
     cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
      0.0,  0.0, 1.0, 0.0,
      0.0,  0.0, 0.0, 1.0
  ]);
*/

var VSHADER_SOURCE =
	'attribute vec4 a_position;\n' +
	'attribute mat4 rotMatrix;\n' +
	'uniform mat4 u_modelMatrix;\n' +
	'void main(){ \n' +
	'	gl_Position = u_modelMatrix * a_position;\n' +
	'}\n';

var FSHADER_SOURCE =
	'precision mediump float;\n' +
	'uniform vec4 u_FragColor;\n' +
	'void main(){ \n' +
	'	gl_FragColor = u_FragColor;\n' +
	'}\n';

function main(){
	//Gets the canvas
	var canvas = document.getElementById('Lab4');
	
	//Gets the WebGL rendering context in order for us to use the webgl system
	var gl = getWebGLContext(canvas);
	
	//This initializes the shaders. Parameters are (rendering context,vshader,fshader)
	var stat;
	stat = initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE);
	if(!stat) console.log("Shaders failed to initialize");
	
	//This code section gets the memory location of the WebGL variables we specified earlier(a_position,u_FragColor)
	//Parameters are (program,name)
	var u_fragcolour = gl.getUniformLocation(gl.program,'u_FragColor');
	var a_position = gl.getAttribLocation(gl.program,'a_position');
	var u_modelMatrix = gl.getUniformLocation(gl.program,'u_modelMatrix');

	//Clears the canvas. ie. cleans the drawing area.
	gl.clearColor(0.0,0.0,0.0,0.5);	//This specifies the color
	gl.clear(gl.COLOR_BUFFER_BIT);	//This actually cleans the canvas with the specified color
	
	var angle = 0.0;
	var scale=0.7;
	var xform=0;
	var yform=0;
	var flag=true;
	var modelMat = new Matrix4();
	
	var tick = function(){
		//Clear canvas of previous images
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		alphabet(gl,a_position,u_fragcolour,angle,modelMat,u_modelMatrix);
		Triangle(gl,a_position,u_fragcolour,scale,modelMat,u_modelMatrix);
		circle(gl,a_position,u_fragcolour,xform,modelMat,u_modelMatrix);
		tfan(gl,a_position,u_fragcolour,yform,modelMat,u_modelMatrix);
		
		angle += 1;
		if(angle>360) angle=0;
		
		if(flag==true){
			scale += 0.01;
			if(scale>1.8) flag=false;
		}
		else{
			scale -= 0.01;
			if(scale<0.7) flag=true;
		}
		
		xform+=0.0045;
		if(xform>0.2)xform=0;
		
		yform+=0.0045;
		if(yform>0.2)yform=0;
		
		requestAnimationFrame(tick,canvas);
	}
	tick();
}

//Draws a black "Z"
function alphabet(gl,position,colour,angle,modelMat,u_modelMatrix){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	var vertices = new Float32Array([
		-0.17,0.17,		0.17,0.17,
		-0.17,-0.17,	0.17,-0.17
	]);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	//Assigning a colour to this shape
	gl.uniform4f(colour,0.0,0.0,0.0,1);
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
	
	//5. Enable the assignment
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for rotating and transfers to WebGL system
	modelMat.setTranslate(-0.5,0.5,0);
	modelMat.rotate(angle,0.0,0.0,1.0);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//Draws the lines for the "Z"
	gl.drawArrays(gl.LINE_STRIP,0,4);
}

//Draws a yellow triangle
function Triangle(gl,position,colour,scale,modelMat,u_modelMatrix){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	var vertices = new Float32Array([
		0.0,0.3,	-0.2,-0.1,	0.2,-0.1,
	]);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	//Assigning a colour to this shape
	gl.uniform4f(colour,1.0,1.0,0.0,1);
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
	
	//5. Enable the assignment
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for scaling and transfers to WebGL system
	modelMat.setTranslate(0.5,0.4,0);
	modelMat.scale(scale,scale,0);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//Draws the triangles
	gl.drawArrays(gl.TRIANGLES,0,3);
}

//Draws a green circle
function circle(gl,position,colour,xform,modelMat,u_modelMatrix){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	var vertexCount = 360;
	var vertices = new Float32Array(makeCircleVertices(0.0,0.0,0.35,vertexCount));
	
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	//Assigning a colour to this shape
	gl.uniform4f(colour,0.1,1.0,0.0,0.7);
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
	
	//5. Enable the assignment
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for scaling and transfers to WebGL system
	modelMat.setTranslate(-0.55,-0.5,0);
	modelMat.translate(xform,0.0,0.0);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//Draws the circle using TRIANGLE_FAN
	gl.drawArrays(gl.TRIANGLE_FAN,0,vertexCount);
}

function makeCircleVertices(centerX,centerY,radius,vertexCount){
	var circleData=[];
	
	for(var i=0;i<=vertexCount;i++){
		var angle = i/vertexCount*2*Math.PI;
		circleData.push(centerX+radius*Math.cos(angle));
		circleData.push(centerY+radius*Math.sin(angle));
	}
	return circleData;
}

//Draws the triangle fan
function tfan(gl,position,colour,yform,modelMat,u_modelMatrix){
	//1. Create the buffer object
	var vertexBuffer = gl.createBuffer();
	
	//2. Bind the buffer object to a target
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	
	//3. Write data to the buffer object
	var vertices = new Float32Array([
		0.1,-0.1,		0.8,-0.1,
		0.8,-0.8,		0.1,-0.1,
		0.8,-0.1,		0.1,-0.8
	]);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	//Assigning a colour to this shape
	gl.uniform4f(colour,1.0,0.0,0.0,0.7);
	
	//4. Assign the buffer object to an attribute variable
	gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
	
	//5. Enable the assignment
	gl.enableVertexAttribArray(position);
	
	//Sets model matrix for scaling and transfers to WebGL system
	modelMat.setTranslate(0.0,-0.1,0);
	modelMat.translate(0,yform,0.0);
	gl.uniformMatrix4fv(u_modelMatrix,false,modelMat.elements);
	
	//Draws the two triangle fans
	gl.drawArrays(gl.TRIANGLE_FAN,0,6);
}