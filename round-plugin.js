jsPsych.plugins["round"] = (function() {

	var plugin = {};


	plugin.trial = function(display_element, trial) {

	// Default value for trial/advice type parameter (no advice)
	trial.advice_type = trial.advice_type || 0
	trial.total_score = trial.total_score 


	trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

	// Here starts code from the html file
	var base_html =
	'<div id="round" style="width:800px; height: 400px; position: relative;">'+
	'<div id="score"></div>'+
	'<div id="card_text"></div>'+
	'</div>'

	display_element.innerHTML = base_html;

	var choice_history = []
	var rt_history = []


	var card_text = display_element.querySelector('#card_text');
	var hand = 0;

	var starting_hand = function() {
		return Math.floor( Math.random() * 9 ) + 11;
	}

	var random_card = function() {
		return Math.floor( Math.random() * 9) + 1;
	}

	var safe_card = function() {
		return Math.floor( Math.random() * (21-hand)) + 1;
	}

	var unsafe_card = function() {
		return Math.floor( Math.random() * (32-hand)) + (22-hand);
	}

	function update_score(){
		display_element.querySelector('#score').innerHTML = "Your total score: "
		display_element.querySelector('#score').innerHTML += trial.total_score;
	}

	update_score();

	hand = starting_hand()


	var html = "<p>Your hand total is "+hand+". Do you want to draw another card? [Y/N]</p>";

	card_text.innerHTML = html;

	var draw_card_listener = function(info){
		if(info.key == 89){
			choice_history.push(info.key);
			rt_history.push(info.rt);
			if(trial.advice_type == 0) {
				card_text.innerHTML = "<img src='img/robot.png'></img>"
				card_text.innerHTML += "<p>I agree with your choice!</p><p> Press any key to continue.</p>"
				var keyListenerNext1 = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: next1,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
			}
			else if(trial.advice_type == 1){
				jsPsych.pluginAPI.cancelKeyboardResponse(keyListenerN);
				card_text.innerHTML = "<img src='img/robot.png'></img>"
				card_text.innerHTML += "<p>I disagree with your choice! I would stop drawing cards.</p>"
				card_text.innerHTML += "<p>Will you change your decision and stop drawing cards? [Y/N]</p>"
				
				var keyListenerGS = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: good_stop_listener,
					valid_responses: ['y', 'n'],
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
			}
			else if(trial.advice_type == 2){
				jsPsych.pluginAPI.cancelKeyboardResponse(keyListenerN);
				card_text.innerHTML = "<img src='img/robot.png'></img>"
				card_text.innerHTML += "<p>I disagree with your choice! I would stop drawing cards.</p>"
				card_text.innerHTML += "<p>Will you change your decision and stop drawing cards? [Y/N]</p>"
				var keyListenerBS = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: bad_stop_listener,
					valid_responses: ['y', 'n'],
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
			}
		}
		else if(info.key == 78){
			choice_history.push(info.key);
			rt_history.push(info.rt);
			if(trial.advice_type == 0) {
				card_text.innerHTML = "<img src='img/robot.png'></img>"
				card_text.innerHTML += "<p>I agree with your choice!</p><p> Press any key to continue.</p>"
				var keyListenerNext2 = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: next2,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});

			}
			else if(trial.advice_type == 1){
				jsPsych.pluginAPI.cancelKeyboardResponse(keyListenerN);
				card_text.innerHTML = "<img src='img/robot.png'></img>"
				card_text.innerHTML += "<p>I disagree with your choice! I would draw another card.</p>"
				card_text.innerHTML += "<p>Will you change your decision and draw another card? [Y/N]</p>"
				var keyListenerGD = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: good_draw_listener,
					valid_responses: ['y', 'n'],
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});

			}
			else if(trial.advice_type == 2){
				jsPsych.pluginAPI.cancelKeyboardResponse(keyListenerN);
				card_text.innerHTML = "<img src='img/robot.png'></img>"
				card_text.innerHTML += "<p>I disagree with your choice! I would draw another card.</p>"
				card_text.innerHTML += "<p>Will you change your decision and draw another card? [Y/N]</p>"
				var keyListenerBD = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: bad_draw_listener,
					valid_responses: ['y', 'n'],
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
			}
		}
		update_score();
	}

	// Stopping is a good idea
	var good_stop_listener = function(info){
		if(info.key == 89){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    trial.total_score = trial.total_score + hand
		    var new_text = "<p> You changed your decision. You stopped drawing cards. " + hand + ' will be added to your total score. </p>'
		    card_text.innerHTML = new_text
		    card_text.innerHTML += "Your total score is now "
		    card_text.innerHTML += trial.total_score
		    new_text = ". The next card would have been " + unsafe_card() + ", pushing you over 21."
		    card_text.innerHTML += new_text
		    card_text.innerHTML += "<p>Get ready for the next round!</p><p> Press any key to continue.</p>"
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});

		} else if(info.key == 78){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    var new_text = "<p>You did not change your decsion. You drew: " + unsafe_card()
		    card_text.innerHTML = new_text
		    card_text.innerHTML += ". You exceeded 21! No points are added to your total score. "
		    card_text.innerHTML += "Get ready for the next round!</p><p> Press any key to continue.</p>"
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});

		}
	}

// Stopping is a bad idea
	var bad_stop_listener = function(info){
		if(info.key == 89){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    trial.total_score = trial.total_score + hand
		    var new_text = "<p> You changed your decision. You stopped drawing cards. " + hand + ' will be added to your total score. </p>'
		    card_text.innerHTML = new_text
		    card_text.innerHTML += "Your total score is now "
		    card_text.innerHTML += trial.total_score
		    new_text = ". The next card would have been " + safe_card() + ", which would have been safe."
		    card_text.innerHTML += new_text
		    card_text.innerHTML += "<p> Get ready for the next round!</p><p> Press any key to continue.</p>"
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});

		}
		else if(info.key == 78){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    drawn = safe_card()
		    trial.total_score = trial.total_score + hand + drawn
		    var new_text = "<p>You did not change your decsion. You drew: " + drawn + ". Your hand total is " +(hand+drawn) +". </p>" 
		    card_text.innerHTML = new_text
		    var new_text2 = "<p>" + (hand+drawn)  + '<p> will be added to your total score. Your total score is now ' + trial.total_score + ". The next card would have been " + unsafe_card() + ', pushing you over 21.</p>'
		    card_text.innerHTML += new_text2
		    card_text.innerHTML += '<p>Get ready for the next round!</p><p> Press any key to continue.</p>'
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
		}
	}

// Drawing is a good idea
	var good_draw_listener = function(info){
		if(info.key == 89){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    drawn = safe_card()
		    trial.total_score = trial.total_score + hand + drawn
		    var new_text = "<p>You changed your decision. You drew: " + drawn + ". Your hand total is " + (hand+drawn) + ". </p>" 
		    card_text.innerHTML = new_text
		    var new_text2 = '<p>' + (hand+drawn) + ' will be added to your total score. Your total score is now ' + trial.total_score + ".</p>"
		    card_text.innerHTML +=new_text2
		    card_text.innerHTML +=  "<p>Get ready for the next round!</p><p> Press any key to continue.</p>"
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()

		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});

		}
		else if(info.key == 78){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    trial.total_score = trial.total_score + hand 
		    card_text.innerHTML = "<p> You did not change your decision. You stopped drawing cards. " 
		    var new_text = hand  + ' will be added to your total score. Your total score is now ' + trial.total_score + '.</p>'
		    card_text.innerHTML += new_text
		    var new_text2 = '<p>The next card would have been ' + safe_card() +', which would have been safe!</p>'
		    card_text.innerHTML += new_text2
		    card_text.innerHTML += '<p>Get ready for the next round!</p><p> Press any key to continue.</p>'
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
		}
	}

// Drawing is a bad idea
	var bad_draw_listener = function(info){
		if(info.key == 89){
			choice_history.push(info.key);
			rt_history.push(info.rt);
		    var new_text = "<p>You changed your decsion. You drew: " + unsafe_card() + ".</p>"
		    card_text.innerHTML = new_text
		    card_text.innerHTML += "<p>You exceeded 21! No points are added to your total score. </p>"
		    card_text.innerHTML += "<p>Get ready for the next round!</p><p> Press any key to continue.</p>"
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
		}
		else if(info.key == 78){
		    //Record reaction time, decision
		    choice_history.push(info.key);
			rt_history.push(info.rt);
		    trial.total_score = trial.total_score + hand 
		    card_text.innerHTML = "<p> You did not change your decision. You stopped drawing cards.</p>" 
		    var new_text = "<p>" + hand + ' will be added to your total score. Your total score is now ' + trial.total_score + '. The next card would have been ' + unsafe_card() +', pushing you over 21.'
		    card_text.innerHTML += new_text
		    card_text.innerHTML += '<p>Get ready for the next round!</p><p> Press any key to continue.</p>'
		    jsPsych.pluginAPI.cancelAllKeyboardResponses()
		    
		    var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
		}
	}

	var keyListenerN = jsPsych.pluginAPI.getKeyboardResponse({
		callback_function: draw_card_listener,
		valid_responses: ['y', 'n'],
		rt_method: 'date',
		persist: false,
		allow_held_key: false
	});



	var next1 = function(info){
		var drawn = random_card()
		hand = hand + drawn
		var drawn_text = "<p>You drew: " + drawn + ". Your hand total is " + hand + ". </p>"
		card_text.innerHTML = drawn_text
		if(hand>21){
			card_text.innerHTML += "<p>You exceeded 21! No points are added to your total score.</p>"
			card_text.innerHTML += "<p>Get ready for the next round!</p><p> Press any key to continue.</p>"
		} else {
			trial.total_score = trial.total_score + hand
			var txt = "<p>" +hand + " will be added to your total score. Your total score is now " + trial.total_score + ".</p>" 
			card_text.innerHTML += txt
			card_text.innerHTML += "<p>Get ready for the next round!</p><p> Press any key to continue.</p>"
		}
		jsPsych.pluginAPI.cancelAllKeyboardResponses()
		var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
			callback_function: endtrial,
			valid_responses: jsPsych.ALL_KEYS,
			rt_method: 'date',
			persist: false,
			allow_held_key: false
		});
	}

	var next2 = function(info){
		trial.total_score = trial.total_score + hand
				card_text.innerHTML = "<p>You stopped drawing cards. ";
				card_text.innerHTML += hand
				card_text.innerHTML += " will be added to your total score.";
				var txt = "Your total score is now " + trial.total_score + ".</p>"
				card_text.innerHTML += txt
				card_text.innerHTML += "<p>Get ready for the next round!</p><p> Press any key to continue.</p>" 
				jsPsych.pluginAPI.cancelAllKeyboardResponses()
				

				var keyListenerEnd = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: endtrial,
					valid_responses: jsPsych.ALL_KEYS,
					rt_method: 'date',
					persist: false,
					allow_held_key: false
				});
	}



	function endtrial() {

		jsPsych.pluginAPI.cancelAllKeyboardResponses();
		
		// data saving
		var trial_data = {
			advice_type: trial.advice_type,
			choices_made: JSON.stringify(choice_history),
			reaction_times: JSON.stringify(rt_history),
			round_score: hand,
			whole_score: trial.total_score
		};
		// end trial
		jsPsych.finishTrial(trial_data)
	}


};


return plugin;
})();