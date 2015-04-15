function CssMask(){
}

CssMask.prototype.init = function() {
	this.element = document.getElementsByClassName("masked-content")[0];
	this.animationFrameTag = "animation-frames-";
	this.currentAnimationFrameIndex = 0;
	this.animationMode = "";
	this.cols = 6;

	this.addEventListeners();
}

CssMask.prototype.addEventListeners = function() {
	var self = this;
	this.element.addEventListener("mouseenter", function(e){
		self.playAnimation();
	});

	this.element.addEventListener("mouseleave", function(e){
		self.reverseAnimation();
	});


	this.element.addEventListener("webkitAnimationEnd", function(e){

		console.log('frame ' + self.element.className + ' mode ' + self.animationMode);
		if(!self.currentAnimationFrameIndex && self.animationMode === 'reverse') return;


		switch(self.animationMode)
		{
			case "normal":
				self.currentAnimationFrameIndex++;
				break;
			case "reverse":
				self.currentAnimationFrameIndex--;
				break;
			default:
				break;
		}
		self.element.className = "masked-content " + self.animationFrameTag + self.currentAnimationFrameIndex;


	});
}

CssMask.prototype.playAnimation = function() {
	this.animationMode = "";
	this.animationFrameTag = "animation-frames-";
	this.element.className = "masked-content " + this.animationFrameTag + this.currentAnimationFrameIndex;
	this.animationMode = "normal";
}

CssMask.prototype.reverseAnimation = function() {
	this.animationMode = "";
	this.animationFrameTag = "animation-frames-reverse-";
	this.animationMode = "reverse";
	if(this.currentAnimationFrameIndex === this.cols) this.currentAnimationFrameIndex--;
	this.element.className = "masked-content " + this.animationFrameTag + this.currentAnimationFrameIndex;
}

/*
window.onload = function(){
	var CssMask = new CssMask();
	CssMask.init();
}
	*/