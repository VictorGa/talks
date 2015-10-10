var TweenMax = require('gsap/src/uncompressed/TweenMax.js');
window.$ = require('jquery/dist/jquery');

function Master() {
	Reveal.initialize({
		controls: true,
		progress: true,
		history: true,
		center: true,

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

	//var socket = io();
	var socket = io('ngodup.mediamonks.local:1212');
	Reveal.addEventListener( 'slidechanged', function( event ) {
    	socket.emit('slideChanged', event);
	});

	socket.on('obtainCurrentState',function(){
		socket.emit('setCurrentState', {slide:Reveal.getState()});
	});

	socket.on('connect',function(){
		socket.emit('currentSlide', {slide:Reveal.getState()});
		socket.emit('masterConnected', {slide:Reveal.getState()});
		console.log('connected')
	});


	//Logic for render steps
	$('.render-steps > .step').on('click', function(event){
			$(event.currentTarget).addClass('clicked');
			var step = $(event.currentTarget).attr('data-step');
			socket.emit('render-steps', {step: step})
	});

	$('.wrapper-budget > .letter-wrapper').on('click', function(event){
		$(event.currentTarget ).removeClass('disabled');
	});




}

new Master();