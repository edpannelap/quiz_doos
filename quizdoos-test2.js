// QUIZ DOOS van Edwin
// 2019

const Gpio = require('pigpio').Gpio;


const OFF = 0;
const ON = 1;

const BLINK_ONCE = 1;
const BLINK_CONTINUOUSLY = 2;
const BLINK_FADE_IN = 3;
const BLINK_FADE_OUT = 4;
const BLINK_FADE_IN_CONTINUOUSLY = 5;
const BLINK_FADE_OUT_CONTINUOUSLY = 6;



class LED {
	constructor(ID, pinID, BLINK,BLINK_SPEED,BLINK_TYPE,BLINK_FASE) {
		this.ID = ID;
		this.pinID = pinID ? pinID : null;
		this.BLINK = BLINK ? BLINK : 0;
		this.BLINK_SPEED = BLINK_SPEED ? BLINK_SPEED : null;
		this.BLINK_TYPE = BLINK_TYPE ? BLINK_TYPE : 1;
		this.BLINK_FASE = BLINK_FASE ? BLINK_FASE : 0;
		
		this.gpio = new Gpio(this.pinID, {mode: Gpio.OUTPUT})
	}
}

class SWITCH {
	constructor(ID, pinID) {
		this.ID = ID;
		this.pinID = pinID ? pinID : null;

		this.gpio = new Gpio(this.pinID, { mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.RISING_EDGE } );
		this.gpio.on('interrupt', (level) => {  console.log(level, this.pinID, this.ID ) } );
	}
}

class BUTTON {
	constructor(ID,LEDPin,SwitchPin){
		this.ID = ID;
		this.LED = LEDPin ? new LED(ID, LEDPin) : undefined;
		this.BUTTON = SwitchPin ? new SWITCH(ID, SwitchPin) : undefined;
	}
}


function allLEDOON() {
	for (var ID in buttons) {
		buttons[ID].LED.gpio.digitalWrite(ON);
	}
}

function allLEDOOFF() {
	for (var ID in buttons) {
		buttons[ID].LED.gpio.digitalWrite(OFF);
	}
}


// INIT SET THE WIRES

let buttons = {};
buttons.C1 = new BUTTON('C1',4,18);
buttons.C2 = new BUTTON('C2',17,23);
buttons.C3 = new BUTTON('C3',27,24);
buttons.P1 = new BUTTON('P1',22,25)
buttons.P2 = new BUTTON('P2',5,12);
buttons.P3 = new BUTTON('P3',6,16);
buttons.P4 = new BUTTON('P4',13,20);
buttons.P5 = new BUTTON('P5',19,21);

// INIT THE OBJECTS
let buttonsPressed = [];



// All LEDS OFF
allLEDOOFF();



// startup show all lights on and off
allLEDOON();
setTimeout(allLEDOOFF, 500 );
setTimeout(init, 1100 );



// blink met fade 

setInterval(() => {

	for (var ID in buttons) {
		if ( buttons[ID].LED.BLINK ) {
			if ( buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN || buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN_CONTINUOUSLY || buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT || buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT_CONTINUOUSLY) {
				buttons[ID].LED.gpio.pwmWrite(buttons[ID].LED.BLINK_FASE);

				if ( buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN || buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN_CONTINUOUSLY ) { 
			  	buttons[ID].LED.BLINK_FASE += 5;
			  }	
				if ( buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT || buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT_CONTINUOUSLY ) { 
			  	buttons[ID].LED.BLINK_FASE -= 5;
			  }	

			  if (buttons[ID].LED.BLINK_FASE > 255) {
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN ) {
				    buttons[ID].LED.BLINK_FASE = 0
				    buttons[ID].LED.BLINK = OFF;
				  }
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN_CONTINUOUSLY ) {
				    buttons[ID].LED.BLINK_FASE = 0;
			  	}	
		  	}

			  if (buttons[ID].LED.BLINK_FASE < 0) {
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT ) {
				    buttons[ID].LED.BLINK_FASE = 255
				    buttons[ID].LED.BLINK = OFF;
				  }
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT_CONTINUOUSLY ) {
				    buttons[ID].LED.BLINK_FASE = 255;
			  	}	
		  	}

		  }
		}
	}
}, 20);



// blink on/off

setInterval(() => {
	for (var ID in buttons) {

		if ( buttons[ID].LED.BLINK ) {
			if ( buttons[ID].LED.BLINK_TYPE == BLINK_ONCE || buttons[ID].LED.BLINK_TYPE == BLINK_CONTINUOUSLY ) {
				buttons[ID].LED.BLINK_FASE = buttons[ID].LED.BLINK_FASE == ON ? OFF : ON;
				buttons[ID].LED.gpio.digitalWrite(buttons[ID].LED.BLINK_FASE);
				if ( buttons[ID].LED.BLINK_TYPE == BLINK_ONCE && buttons[ID].LED.BLINK_FASE == OFF) {
			    buttons[ID].LED.BLINK = OFF;
				}
			}
		}

	}
},500);





function init() {

	buttons.C1.LED.BLINK = 1;
	buttons.C1.LED.BLINK_TYPE = BLINK_FADE_OUT_CONTINUOUSLY;

	buttons.C2.LED.BLINK = 1;
	buttons.C2.LED.BLINK_TYPE = BLINK_FADE_IN_CONTINUOUSLY;

	buttons.C3.LED.BLINK = 1;
	buttons.C3.LED.BLINK_TYPE = BLINK_CONTINUOUSLY;

	buttons.P1.LED.BLINK = 1;
	buttons.P1.LED.BLINK_TYPE = BLINK_FADE_IN_CONTINUOUSLY;
	buttons.P1.LED.BLINK_FASE = 125;

	buttons.P2.LED.BLINK = 1;
	buttons.P2.LED.BLINK_TYPE = BLINK_FADE_IN_CONTINUOUSLY;

	buttons.P3.LED.BLINK = 1;
	buttons.P3.LED.BLINK_TYPE = BLINK_FADE_IN;

	buttons.P4.LED.BLINK = 1;
	buttons.P4.LED.BLINK_TYPE = BLINK_CONTINUOUSLY;
	buttons.P4.LED.BLINK_FASE = ON;

	buttons.P5.LED.BLINK = 1;
	buttons.P5.LED.BLINK_TYPE = BLINK_CONTINUOUSLY;
	buttons.P5.LED.BLINK_FASE = OFF;

}





function resetAll() {
	// Clear the buttonPressed Array
	buttonsPressed = [];
	
	// Set all ButtonStates and LEDs to OFF
	allLEDOOFF();


}

function displayPressed() {
	if ( buttonsPressed.length ) {

	}
}

function shownNextPressed() {

}


function playerButtonPressed(which){
	buttonsPressed.push(which);
	displayPressed();	
}










