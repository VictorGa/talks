
/*
 STATIC ELEMENTS
 */
Main.FRAME_SIZE_WIDTH = 320;
Main.FRAME_SIZE_HEIGHT = 240;
Main.SPRITESHEET_WIDTH = 1920;
Main.SPRITESHEET_HEIGHT = 1680;
Main.SPRITESHEET_FRAMES = 41;
Main.COLS = 6;
Main.FPS = 23;
Main.NORMAL_DIRECTION = 1;
Main.INVERSE_DIRECTION = -1;


function Main()
{
	this.currentFrame = 0;
	this.counter = 0;
	this.direction = 1;
	this.spritesheet = new Image();
	this.animate = false;
	this.then = window.performance.now();
	this.fpsInterval = 1000/Main.FPS;
}

Main.prototype.init = function()
{
	this.video = this.createVideo( 'data/lake.mp4' );
	this.canvas = document.getElementById( 'main-canvas' );
	this.ctx = this.canvas.getContext( '2d' );
	this.spritesheet.src = 'image/mask.png';
	this.spriteProps = {x: 0, y: 0, iX: 0, iY: 0};
	this.animationLoop = this.onTimeUpdate.bind(this);
	this.addEventListeners();
	this.animationLoop();
}

Main.prototype.createVideo = function( src )
{
	var video = document.createElement( 'video' );
	video.preload = 'auto';
	video.controls = false;
	video.muted = true;
	video.loop = true;
	video.src = src;

	return video;
}

Main.prototype.addEventListeners = function()
{
	var self = this;
	this.canvas.addEventListener( 'mouseenter', function( e )
	{
		self.play();
	} );

	this.canvas.addEventListener( 'mouseleave', function( e )
	{
		self.reverse();
	} );
}

Main.prototype.play = function()
{
	this.direction = Main.NORMAL_DIRECTION;
	this.video.play();
	this.animate = true;
}

Main.prototype.reverse = function()
{
	this.direction = Main.INVERSE_DIRECTION;
	this.animate = true;
}

Main.prototype.onTimeUpdate = function(timestamp) {

	// calc elapsed time since last loop
	var elapsed = timestamp - this.then;

	// if enough time has elapsed, draw the next frame
	if(elapsed > this.fpsInterval)
	{
		this.drawVideo();
		if( this.animate )
		{
			this.calculateAnimationFrame();
		}
		this.then = timestamp - (elapsed%this.fpsInterval);
	}
	requestAnimationFrame(this.animationLoop);
}

Main.prototype.calculateAnimationFrame = function()
{
	//Get spritesheet frame position
	this.spriteProps.iX = this.currentFrame % Main.COLS;
	this.spriteProps.iY = Math.floor( this.currentFrame / Main.COLS );
	this.spriteProps.x = this.spriteProps.iX * Main.FRAME_SIZE_WIDTH;
	this.spriteProps.y = this.spriteProps.iY * Main.FRAME_SIZE_HEIGHT;

	if( (this.direction === 1 && this.currentFrame < Main.SPRITESHEET_FRAMES - 1) ||
		(this.direction === -1 && this.currentFrame > 0) )
	{
		this.currentFrame += this.direction;
	}
	else
	{
		//Done
		this.animate = false;
		if(this.direction === Main.INVERSE_DIRECTION)
		{
			//Pause video
			this.video.pause();
		}
	}

}

Main.prototype.drawVideo = function()
{
	// Reset operation to draw full video frame
	this.ctx.globalCompositeOperation = 'source-over';

	// Draw video frame
	this.ctx.drawImage( this.video, 0, 0, this.video.videoWidth, this.video.videoHeight );

	//Apply right operation
	this.ctx.globalCompositeOperation = 'destination-in';

	// Draw mask
	this.ctx.drawImage( this.spritesheet, this.spriteProps.x, this.spriteProps.y, Main.FRAME_SIZE_WIDTH, Main.FRAME_SIZE_HEIGHT, 0, 0, this.canvas.width, this.canvas.height );
}


window.onload = function()
{
	var main = new Main();
	main.init();
}