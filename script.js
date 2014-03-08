(function () {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var W, H;
	var start = new Date().getTime();
	var bees = [new Bee, new Bee, new Bee];

	function dim() {
		W = window.getComputedStyle(document.body).width;
		H = window.getComputedStyle(document.body).height;
		canvas.setAttribute('width', W);
		canvas.setAttribute('height', H);
		W = parseInt(W);
		H = parseInt(H);
	}

	function draw() {

		ctx.clearRect(0, 0, W, H);
		sky();
		sun1();
		grass();
		// butterfly();
		bee();
	}

	function sky() {
		var seed = Math.floor(Math.random() * 10 + 200);
		var color = 'rgb(' + seed + ',' + seed +', 255)';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, W, H);
	}

	function sun1() {  
		var rad = Math.floor(Math.random() * 5 + Math.min(W,H) * 0.2);  
		var seed = Math.floor(- Math.random() * 10 + 250);  
		var color = 'rgb(' + seed + ',' + seed + ', 90)';  
		ctx.fillStyle = color;  
		ctx.arc(W, 0, rad, 0, Math.PI * 2, true);
		ctx.fill(); 

		rad = Math.floor(Math.random() * 10 + Math.min(W,H) * 0.2);  
		ctx.beginPath();
		ctx.moveTo(W - rad, H * 0.01 + 1 * Math.random());
		ctx.lineTo(W - rad - 2 * rad, H * 0.05);
		ctx.lineTo(W - rad - 2 * rad + rad * 0.3, H * 0.17);
		ctx.lineTo(W - rad, H * 0.01);
		ctx.fill();

		rad = Math.floor(Math.random() * 35 + Math.min(W,H) * 0.17);  
		ctx.beginPath();
		ctx.moveTo(W - rad, H * 0.10);
		ctx.lineTo(W - rad - 1.2 * rad, H * 0.26);
		ctx.lineTo(W - rad - 0.8 * rad, H * 0.36);
		ctx.lineTo(W - rad, H * 0.1);
		ctx.fill();

		rad = Math.floor(Math.random() * 25 + Math.min(W,H) * 0.2);  
		ctx.beginPath();
		ctx.moveTo(W - 0.5 * rad, H * 0.20);
		ctx.lineTo(W - rad - 0.3 * rad, H * 0.40);
		ctx.lineTo(W - 0.87 * rad, H * 0.48);
		ctx.lineTo(W - 0.5 * rad, H * 0.2);
		ctx.fill();

		rad = Math.floor(Math.random() * 25 + Math.min(W,H) * 0.21);  
		ctx.beginPath();
		ctx.moveTo(W - 0.05 * rad, rad + rad * 0.1);
		ctx.lineTo(W - 0.3 * rad, rad + 1.2 * rad);
		ctx.lineTo(W + 0.3 * rad, rad + 1.2 * rad);
		ctx.lineTo(W - 0.05 * rad, rad + rad * 0.1);
		ctx.fill();
	}

	function grass() {
		var peeks = 223;

		var color = 'rgb(51, 101, 0)';
		ctx.fillStyle = color;

		var peek_space = W / peeks;

		ctx.beginPath();
		var first = {x: 0, y: H - 2 * Math.random()}
		var last = first;
		ctx.moveTo(last.x, last.y);
		for (var i = 0; i < peeks; i++) {
			ctx.lineTo(last.x + peek_space / 2 + Math.random() * 4 * W * 0.01, H - (Math.random() * 15 * H * 0.01 + H * 0.1));
			last = {x: last.x + peek_space, y: H - 10 * Math.random()};
			ctx.lineTo(last.x, last.y);
		}

		ctx.lineTo(first.x, first.y);
		ctx.fill();

		ctx.fillRect(0, H * 0.98, W, H);
	}

	function bee() {
		bees.forEach(function (bee) {bee.move()});
	}

	function Bee() {
		this.x = 0; // rel
		this.y = 0.5; // rel
		this.direction = 1;
	}

	Bee.prototype.move = function () {
		if (this.x * W >= 2.1 * W || this.x * W < -1.1 * W) {
			this.end();
		}

		var delta_x = this.direction * Math.abs(0.07 - Math.random() * 0.1);
		var delta_y = (Math.random() > 0.5 ? -1 : 1) * 0.02;

		this.x += delta_x;
		this.y += delta_y;

		console.log(this.x, this.y);
		this.draw();
	};

	Bee.prototype.end = function () {
		this.direction = - this.direction;
	};

	Bee.prototype.draw = function () {
		var unit = 0.01;
		ctx.save();

		var color = 'rgb(230,230,0)';
		ctx.fillStyle = color; 
		ctx.rotate(2 * Math.PI * 0.02 * this.direction);

		// Body
		ctx.beginPath();
		ctx.moveTo((this.x - 1 * unit) * W, H * this.y);
		ctx.bezierCurveTo((this.x - 0.5 * unit) * W,  H * (this.y + unit), (this.x + 0.5 * unit) * W, H * (this.y + unit), (this.x + 1 * unit) * W, this.y * H);
		ctx.bezierCurveTo((this.x + 0.5 * unit) * W,  H * (this.y - unit), (this.x - 0.5 * unit) * W, H * (this.y - unit), (this.x - 1 * unit) * W, this.y * H);
		ctx.fill();

		color = 'rgb(0, 0, 0)';
		ctx.fillStyle = color;

		// Stripes

		ctx.fillRect((this.x - unit * 0.2) * W, (this.y - unit * 0.7) * H, 0.4 * unit * W, unit * 1.4 * H);
		ctx.fillRect((this.x - unit * 0.6) * W, (this.y - 0.5 * unit) * H, 0.2 * unit * W, unit * 1 * H);
		ctx.fillRect((this.x + unit * 0.4) * W, (this.y - 0.5 * unit) * H, 0.2 * unit * W, unit * 1 * H);

		// Head
		ctx.beginPath();
		ctx.arc((this.x + this.direction * unit) * W, (this.y) * H, 0.5 *  unit * Math.min(W, H), 0, Math.PI * 2, true);
		ctx.fill();
		
		// Wings
		color = 'rgb(255,255,255)';
		ctx.fillStyle = color;

		ctx.beginPath();
		ctx.moveTo(this.x * W, (this.y - unit) * H);
		ctx.bezierCurveTo((this.x - 0.5 * unit) * W, (this.y - 4 * unit) * H, (this.x - 1.5 * unit) * W, (this.y - 1.5 * unit) * H, (this.x - 0.7 * unit) * W, (this.y - 1 * unit) * H);
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(this.x * W, (this.y - unit) * H);
		ctx.bezierCurveTo((this.x + 0.5 * unit) * W, (this.y - 4 * unit) * H, (this.x + 1.5 * unit) * W, (this.y - 1.5 * unit) * H, (this.x + 0.7 * unit) * W, (this.y - 1 * unit) * H);
		ctx.fill();
		
		ctx.restore();
	};

	setInterval(function () { dim(); draw();}, 150);
})();