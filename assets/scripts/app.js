var twister = {
	initialize: function(main_el, opts){
		this.options = $.extend({
			el: $(main_el),     
			counter: $(".count-down"),
			colors: ["red", "blue", "green", "yellow"], 
			bodyparts: ["left_foot", "right_foot", "right_hand", "left_hand"], 
			autostart: false, 
			interval: 8
		}, opts);         
		this.sounds = {};
		this.playing = this.options.autostart;
		this.second_counter = 0;
		this._setupSoundManager();  
		this._hookKeyboard();       
		var _t = this; 
		if(this.options.autostart){
			this.timer = setInterval(function(){
				if(_t.second_counter == 7){
					_t.second_counter = 0;
					_t.spin.apply(_t);					
				}                       
				_t.second_counter++;
				_t.options.counter.html("0"+_t.second_counter);
			}, 1000);
		}  
		return this;
	}, 
	spin: function(){
		var color = this.options.colors[Math.floor(Math.random()*4)];
		var body 	= this.options.bodyparts[Math.floor(Math.random()*4)];
		this.options.el.animate({'background-color':color});
		if(body == "left_foot" || body == "right_foot"){
			$("#hand").css({display:'none'});
			$("#foot").css({display:'block'});
		}else{
			$("#hand").css({display:'block'});
			$("#foot").css({display:'none'});
		}
		soundManager.play(body, {
			onfinish: function(){  
				soundManager.play(color);
			}
		})
	},        
	toggleState: function(){     
		if(this.playing){
			clearInterval(this.timer);
			window.document.title = "Twister - Paused";
		}else{
			var _t = this;
			window.document.title = "Twister - Playing...";
			this.timer = setInterval(function(){
				if(_t.second_counter == 7){
					_t.second_counter = 0;
					_t.spin.apply(_t);					
				}                       
				_t.second_counter++;
				_t.options.counter.html("0"+_t.second_counter);
			}, 1000);
		} 
		this.playing = !this.playing;
		this._mask(!this.playing);
	}, 
	_setupSoundManager: function(){
		if(soundManager.ok() && !this.options.sound){
			this.options.sound = true;
			var _t = this;
			var s = function(el){
				_t.sounds[el] = soundManager.createSound({
					id: el, 
					url: 'assets/sound/'+el+".wav", 
					autoLoad: true, 
					autoPlay: false, 
					volume: 50
				});
			}
			$.each(this.options.colors, function(i, el){s(el);});           
			$.each(this.options.bodyparts, function(i, el){s(el);});           
		}
	}, 
	_hookKeyboard: function(){
		var _t = this;
		$(window).on('keyup', function(e){
			if(e.which == 32){ 
				$(".pause-mask h1").html("PAUSAD");
				_t.toggleState.apply(_t);
			}
		})
	}, 
	_mask: function(){
		var _p = $(".pause-mask");
		if(typeof(arguments[0]) != "undefined"){
			if(arguments[0]){
				_p.css({display:'block'});				
			}else{
				_p.css({display:'none'});				
			}
		}else{
			_p.css({display:'block'});				
		}
	}
}

soundManager.setup({
  url: 'assets/swf/',
	waitForWindowLoad:true,
  flashVersion: 9, // optional: shiny features (default = 8)
  useFlashBlock: false, // optionally, enable when you're ready to dive in/**
  onready: function() {
		if(window.twister){
			window.twister._setupSoundManager();
		}
  }
});


$(function(){
	window.twister = Object.create(twister).initialize(".main", {});
});