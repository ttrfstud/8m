(function () {
	function Info(text, start_rel, start_y, cb) {
		this.idx = -1;
		this.text = text;
		this.start = start_rel;
		this.y = start_y;
		this.last = new Date().getTime();
		this.cb = cb;
	}

	Info.prototype.draw = function () {
		var fontsize = 72;
		var width = W * (1 - this.start);

		var acc = this.start * W;
		ctx.font = fontsize + 'px Arimo';
		ctx.fillStyle = 'white';

		for (var i = 0; i <= this.idx; i++) {
			var ch = this.text.charAt(i);
			ctx.save();
			ctx.rotate((Math.random() >= 0.5 ? -1 : 1) * Math.PI * 2 * 0.005);


			ctx.fillText(ch, acc, this.y * H);
			ctx.restore();
			acc += fontsize;
		}

		if (new Date().getTime() - this.last >= 1000) {
			this.last = new Date().getTime();
			if (this.idx < this.text.length) {
				this.idx++;
			}
		}

		if (this.idx >= this.text.length) {
			this.cb && this.cb.draw();
		}
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

	function Butterfly() {
		Bee.call(this);

		this.makeColor();
		this.factor = 1;
	}

	Butterfly.prototype = Object.create(Bee.prototype);
	Butterfly.prototype.constructor = Butterfly;

	Butterfly.prototype.makeColor = function () {
		this.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
	}

	Butterfly.prototype.draw = function () {
		var unit = 0.01;

		ctx.save();

		ctx.rotate(2 * Math.PI * 0.01 * this.direction);

		this.factor = this.factor === 1 ? 0.5 : 1;

		
		ctx.rotate(2 * Math.PI * 0.02 * this.direction);

		// Wings
		ctx.fillStyle = this.color;
		var start = {x: (this.x - 0.6 * unit), y: (this.y - 0.1 * unit)};
		var start_r = {x: (this.x + 0.6 * unit), y: (this.y - 0.1 * unit)};
		var start_l = {x: (this.x - 0.6 * unit), y: (this.y + 0.1 * unit)};
		var start_rl = {x: (this.x + 0.6 * unit), y: (this.y + 0.1 * unit)};

		var wing_high = 3 * this.factor;
		var wing_high_2 = 3.1 * this.factor;

		ctx.beginPath();
		ctx.moveTo(start.x * W, start.y * H);
		ctx.bezierCurveTo((start.x - unit) * W, (start.y - unit * wing_high) * H, (start.x + unit) * W, (start.y - unit * wing_high_2) * H,  (start.x + unit) * W, (start.y) * H);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(start_r.x * W, start_r.y * H);
		ctx.bezierCurveTo((start_r.x + unit) * W, (start_r.y - unit * wing_high) * H, (start_r.x - unit) * W, (start_r.y - unit * wing_high_2) * H,  (start_r.x - unit) * W, (start_r.y) * H);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(start_l.x * W, start_l.y * H);
		ctx.bezierCurveTo((start_l.x - unit) * W, (start_l.y + unit * wing_high) * H, (start_l.x + unit) * W, (start_l.y + unit * wing_high_2) * H,  (start_l.x + unit) * W, (start_l.y) * H);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(start_rl.x * W, start_rl.y * H);
		ctx.bezierCurveTo((start_rl.x + unit) * W, (start_rl.y + unit * wing_high) * H, (start_rl.x - unit) * W, (start_rl.y + unit * wing_high_2) * H,  (start_rl.x - unit) * W, (start_rl.y) * H);
		ctx.fill();

		var color = 'rgb(50, 50, 50)';
		ctx.fillStyle = color; 
		// Body
		ctx.beginPath();
		ctx.moveTo((this.x - 0.4 * unit) * W, H * this.y);
		ctx.bezierCurveTo((this.x - 0.2 * unit) * W,  H * (this.y + 0.3 * unit), (this.x + 0.2 * unit) * W, H * (this.y + 0.3 * unit), (this.x + 0.4 * unit) * W, this.y * H);
		ctx.bezierCurveTo((this.x + 0.2 * unit) * W,  H * (this.y - 0.3 * unit), (this.x - 0.2 * unit) * W, H * (this.y - 0.3 * unit), (this.x - 0.4 * unit) * W, this.y * H);
		ctx.fill();
		ctx.restore();
	}



	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var W, H;
	var start = new Date().getTime();
	var bees = [new Bee, new Bee, new Bee];
	var buterflies = [new Butterfly, new Butterfly, new Butterfly, new Butterfly];

	var info = new Info('КУПРИК', 0.2, 0.2, new Info('С 8-М МАРТА!', 0.14, 0.4));

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
		butterfly();
		bee();
		write();
	}

	function write() {
		if (new Date().getTime() - start >= 10000) {
			info.draw();
		}
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

	function butterfly() {
		if (new Date().getTime() - start > 10000) {
			buterflies.forEach(function (butterfly) { butterfly.move();});
		}
	}

	setInterval(function () { dim(); draw();}, 150);
})();