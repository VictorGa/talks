var TweenMax = require('gsap/src/uncompressed/TweenMax.js');
window.$ = require('jquery/dist/jquery');

const map = {"1_0":1 };

function Client() {

	//var socket = io();
	var socket = io('ngodup.mediamonks.local:1212');

	socket.on('connect',function(){
		console.log('connected')

		socket.on('slideChanged', function(data){
			Reveal.slide(data.indexh, data.indexv);
		});

		socket.on('currentSlide', function(data){
			console.log('specific gets', data);
			Reveal.setState(data.slide);
		});

		socket.emit('getCurrentState', {});

	});

	Reveal.initialize({
		controls: true,
		progress: true,
		history: true,
		center: false,
		touch: false,
		transition: 'slide', // none/fade/slide/convex/concave/zoom

		// Optional reveal.js plugins
		dependencies: [
			{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
			{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
			{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
			{ src: 'plugin/highlight/highlight.js', async: true, condition: function() { return !!document.querySelector( 'pre code' ); }, callback: function() { hljs.initHighlightingOnLoad(); } },
			{ src: 'plugin/zoom-js/zoom.js', async: true },
			{ src: 'plugin/notes/notes.js', async: true }
		]
	});


	//Logic for the render states
	var $box = $('.state-1').find('.box');
	var $options = $('.state-1').find('.option');
	var isSelected = false;
	var currentPosition = {x: 0, y:0};
	var then = window.performance.now();
	var fpsInterval = 1000/10;

	socket.on('render-step-changed', function(data){
		console.log('specific gets', data);
		executeRenderState(data.step);
	});

	$options.on('click', function(event){
		$options.removeClass('selected');
		var fps = parseInt($(event.currentTarget).attr('data-option'));
		fpsInterval = 1000/fps;
		$(event.currentTarget ).addClass('selected');
	});

	$box.on('touchstart', function(event){
		isSelected = true;
		console.log(event);
		event.stopImmediatePropagation();
	})

	$box.on('touchmove', function(event){
		if(isSelected)
		{
			currentPosition.x = event.originalEvent.touches[0].pageX;
			currentPosition.y = event.originalEvent.touches[0].pageY;
		}
		event.stopImmediatePropagation();
	});

	$box.on('touchcancel', function(event){
		isSelected = false;
		event.stopImmediatePropagation();
	});

	var draw = function(timestamp){
		// calc elapsed time since last loop
		var elapsed = timestamp - then;

		// if enough time has elapsed, draw the next frame
		if(elapsed > fpsInterval && isSelected)
		{
			TweenMax.set($box, {x: currentPosition.x - 50, y:currentPosition.y - 50});

			then = timestamp - (elapsed%fpsInterval);
		}

		requestAnimationFrame(draw);
	}
	draw();

	var $renderTitle = $('.state-2' ).find('.render-title');
	var $box = $('.state-2' ).find('.box');

	var executeRenderState = function(state){

		$wrapper.find('.ball' ).each(function(index, element){
			TweenMax.killTweensOf(element);
			element._gsTransform = null;
			element._gsTweenID = null;
		})
		$wrapper.find('.ball').removeAttr('style');

		switch(state)
		{
			case 'paint':
				TweenMax.staggerTo($wrapper.find('.ball'), 2, {borderRadius: "+=" + 5, width:  "+=" + 5, height:  "+=" + 5, ease:Elastic.easeOut, yoyo: true, repeat: 9999},0.01);
				break;
			case 'composite':
				TweenMax.staggerTo($wrapper.find('.ball'), 2, {scale:1.5, transformOrigin: "0% 0%", ease:Elastic.easeOut, force3D:true, parseTransform:true, clearProps:"transform", yoyo: true, repeat: 9999},0.01);
				break;
		}

		$renderTitle.html(state);
		$renderTitle.addClass(state);
	}

	var $wrapper = $('.state-2 > .wrapper');
	//Algorithm to draw balls to fit the screen
	var radius = 10;

	//Get amount of balls that fit in the screen
	var w = $wrapper.width();
	var h = $wrapper.height();

	var rows = Math.floor(w/(radius*2));
	var columns = Math.floor(h/(radius*2));
	var amount = (rows*columns)/2;
	while(amount--)
	{
		$wrapper.append($('<div/>' ).addClass('ball-wrapper').append($('<div/>' ).addClass('ball')));
	}

}
  
new Client();