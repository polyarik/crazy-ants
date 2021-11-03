class World {
	constructor(settings) {
		if ( this.initPlanes(settings['planes'], settings['antsRender'], settings['cellSizeRounding']) )
			this.initUpdate( settings['speed'] );
	}
	
	initPlanes(planeSettings, antsRender, cellSizeRounding) {
		this.Planes = [];
		this.donePlanes = [];

		for (let i in planeSettings) {
			this.Planes.push( new Plane(planeSettings[i], antsRender, cellSizeRounding) );
		}

		this.initResize();
		return true;
	}

	initResize() {
		window.onresize = () => {
			for (let i in this.Planes) {
				this.Planes[i].resizeCanvas();
			}

			for (let i in this.donePlanes) {
				this.donePlanes[i].resizeCanvas();
			}
        }
	}

	initUpdate(speed) {
		this.speed = speed;
		this.startTime = Date.now();
		//this.pauseTime
		//this.finishTime
		
		this.setInterval();
	}

	setInterval() {
		this.interval = window.setInterval(() => {
			// no planes with live ants
			if (!this.step()) {
				window.clearInterval(this.interval);

				//TODO: nice alert window
				this.finishTime = Date.now() - this.startTime;
				console.log("All planes are done in:", this.finishTime);
				appInterface.showEndMenu(); //TEMP
			}
		}, this.stepDelay);
	}
	
	step() {
		let undonePlanes = false;

		for (let i = 0, l = this.Planes.length; i < l; i++) {
			if ( this.Planes[i] ) {
				if ( this.Planes[i].moveAnts() )
					undonePlanes = true;
				else {
					this.donePlanes[i] = this.Planes[i];
					delete this.Planes[i];
				}
			}
		}

		return undonePlanes;
	}

	pause() {
		// all planes're done
		if (this.finishTime)
			return true;
			//return this.pauseTime = !this.pauseTime;

		// world isn't on pause
		if (!this.pauseTime) {
			window.clearInterval(this.interval);
			this.pauseTime = Date.now();
		} else {
			this.setInterval();
			this.startTime += (Date.now() - this.pauseTime);
			this.pauseTime = undefined;
		}

		return this.pauseTime;
	}

	destroy() {
		if (!this.finishTime)
			window.clearInterval(this.interval);

		//delete this.Planes;
		//delete this.donePlanes;
	}

	set speed(speed) {
		this.stepDelay = 1000 / speed;
	}

	get speed() {
		return Math.round(1000 / this.stepDelay);
	}
	
	//
}
