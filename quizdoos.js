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

const GAME_MODE_NORMAL = 1;


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
	constructor(ID, pinID, debounce) {
		this.ID = ID;
		this.pinID = pinID ? pinID : null;
		this.debounce = debounce ? debounce : OFF;
		this.debouncing = false;

		this.gpio = new Gpio(this.pinID, { mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.RISING_EDGE, alert: this.debounce } );
		if( this.debounce ) {
			this.gpio.glitchFilter(100000);
			this.gpio.on('alert', (level) => { level == 1 ? game.buttonPressed( this.ID, level, this.pinID ) : null; } );
		}
		else {
			this.gpio.on('interrupt', (level) => { level == 1 ? game.buttonPressed( this.ID, level, this.pinID ) : null; } );
		}	
	}



}

class BUTTON {
	constructor(ID,LEDPin,SwitchPin,debounce){
		this.ID = ID;
		this.LED = LEDPin ? new LED(ID, LEDPin) : undefined;
		this.BUTTON = SwitchPin ? new SWITCH(ID, SwitchPin, debounce) : undefined;
	}
}



class GAME {
	constructor(MODE) {
		this.mode = MODE ? MODE : GAME_MODE_NORMAL;
		this.buttonsPressed = {};
		this.buttonsPressedOrder = [];
		this.currentDisplayOrderId = 0;
	};	

	init() {
		allLEDOON();
		setTimeout(allLEDOFF, 500 );
		setTimeout(game.reset, 700 );
	}

	reset() {
		// Clear the buttonPressed Array
		this.buttonsPressed = {};
		this.currentDisplayOrderId = 0;
		this.buttonsPressedOrder = [];

		allBlinkStop();

		// Set all ButtonStates and LEDs to OFF
		allLEDOFF();

		buttons.C1.LED.BLINK_TYPE = BLINK_FADE_OUT;
		buttons.C1.LED.BLINK = ON;

		buttons.C2.LED.BLINK_TYPE = BLINK_FADE_IN;
		buttons.C2.LED.BLINK = ON;

		buttons.C3.LED.BLINK_TYPE = BLINK_FADE_OUT;
		buttons.C3.LED.BLINK = ON;
	}

	buttonPressed(which, level, pinID) {
		// bounce

		// console.log(which, level, pinID );

			switch(which) {
			case 'C1' : {
				this.reset();
				buttons[which].LED.BLINK_TYPE = BLINK_FADE_OUT;
				buttons[which].LED.BLINK = ON;
				break;
			}

			case 'C2' : {
				this.showPreviousPressed();
				buttons[which].LED.BLINK_TYPE = BLINK_FADE_OUT;
				buttons[which].LED.BLINK = ON;
				break;
			}

			case 'C3' : {
				this.showNextPressed();
				buttons[which].LED.BLINK_TYPE = BLINK_FADE_OUT;
				buttons[which].LED.BLINK = ON;
				break;
			}

			default : {
				this.playerPressed(which);
			}
		}

		this.displayCurrentFirstPressed();
	}


	displayCurrentFirstPressed() {
		if ( this.buttonsPressedOrder.length ) {
			// blink 'm
			buttons[this.buttonsPressedOrder[this.currentDisplayOrderId]].LED.BLINK_TYPE = BLINK_CONTINUOUSLY;
			buttons[this.buttonsPressedOrder[this.currentDisplayOrderId]].LED.BLINK = ON;
		}
	}

	showNextPressed() {

		// Set the next one
		if ( (this.currentDisplayOrderId + 1) < this.buttonsPressedOrder.length ) {
			// stop blinking on current one
			buttons[this.buttonsPressedOrder[this.currentDisplayOrderId]].LED.BLINK = OFF;
			buttons[this.buttonsPressedOrder[this.currentDisplayOrderId]].LED.gpio.digitalWrite(OFF);

			this.currentDisplayOrderId++;
		}
		else {
			this.showError();
		}	

	}

	showPreviousPressed() {

		// Set the next one
		if ( this.currentDisplayOrderId > 0  ) {
			// stop blinking on current one
			buttons[this.buttonsPressedOrder[this.currentDisplayOrderId]].LED.BLINK = OFF;
			buttons[this.buttonsPressedOrder[this.currentDisplayOrderId]].LED.gpio.digitalWrite(OFF);

			this.currentDisplayOrderId--;
		}
		else {
			this.showError();
		}	

	}

	playerPressed(which) {
		// allready pressed this turn ( ignore it )
		if ( !this.buttonsPressed[which] ) {
			// Set the LED on the button to on.
			buttons[which].LED.gpio.digitalWrite(ON);
			// Add this button to the order as last and not that is has been pressed
			this.buttonsPressedOrder.push(which);
			this.buttonsPressed[which] = ON;
			// Make the status LED go Blank
			buttons.C2.LED.gpio.digitalWrite(OFF);
		}	
	}

	showError() {
		buttons.C1.LED.BLINK_TYPE = BLINK_ONCE;
		buttons.C1.LED.BLINK = ON;
	}

}




function allLEDOON() {
	for (var ID in buttons) {
		buttons[ID].LED.gpio.digitalWrite(ON);
	}
}

function allLEDOFF() {
	for (var ID in buttons) {
		buttons[ID].LED.gpio.digitalWrite(OFF);
	}
}


function allBlinkStop() {
	for (var ID in buttons) {
		buttons[ID].LED.BLINK = OFF;
	}
}


//


// INIT SET THE WIRES
let buttons = {};
buttons.C1 = new BUTTON('C1',4,18,true);
buttons.C2 = new BUTTON('C2',17,23,true);
buttons.C3 = new BUTTON('C3',27,24,true);
buttons.P1 = new BUTTON('P1',22,25)
buttons.P2 = new BUTTON('P2',5,12);
buttons.P3 = new BUTTON('P3',6,16);
buttons.P4 = new BUTTON('P4',13,20);
buttons.P5 = new BUTTON('P5',19,21);


// All LEDS OFF
allLEDOFF();


// IF I quit take ALL LEDS DOWN
process.on('beforeExit', (code) => {allLEDOFF();});


// interval for blink with fade 
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
				    buttons[ID].LED.BLINK = OFF;
				    buttons[ID].LED.BLINK_FASE = 0
				  }
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_IN_CONTINUOUSLY ) {
				    buttons[ID].LED.BLINK_FASE = 0;
			  	}	
		  	}

			  if (buttons[ID].LED.BLINK_FASE < 0) {
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT ) {
				    buttons[ID].LED.BLINK = OFF;
				    buttons[ID].LED.BLINK_FASE = 255
				  }
			  	if (buttons[ID].LED.BLINK_TYPE == BLINK_FADE_OUT_CONTINUOUSLY ) {
				    buttons[ID].LED.BLINK_FASE = 255;
			  	}	
		  	}

		  }
		}
	}
}, 30);



// interval for normal blink on/off

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
},250);




// startup 
let game = new GAME();
game.init();
















