var score  = 0;
var lastUpdate = Date.now();
var deltaTime = 0;
var time_1000 = Date.now();
var floor_is_made_out_of_floor = 1;
var game_speed = 1000;
var bullet = {
	x: 0,
	y: 0,
	height: 10,
	width: 10,
	speed: 1,
	angle: 0
};
var mouse = {
	x: 0,
	y: 0
};

//canvases
const ctx = document.querySelector("canvas").getContext("2d", { alpha:false, desynchronized:false });

ctx.canvas.width = document.documentElement.clientWidth;
ctx.canvas.height = document.documentElement.clientHeight;
ctx.imageSmoothingEnabled = false;
ctx.font = "30px Arial";

//keyboard
const keyboard = {
	up: false,
	down: false,
	left: false,
	right: false,
	shift: false
};
window.addEventListener('keydown', function(event){
	switch(event.code){
		case "KeyW":
			keyboard.up = true;
			break;
		case "KeyA":
			keyboard.left = true;
			break;
		case "KeyS":
			keyboard.down = true;
			break;
		case "KeyD":
			keyboard.right = true;
			break;
		case "ShiftLeft":
			keyboard.shift = true;
			break;
		default:
			break;
	}
});
window.addEventListener('keyup', function(event){
	switch(event.code){
		case "KeyW":
			keyboard.up = false;
			break;
		case "KeyA":
			keyboard.left = false;
			break;
		case "KeyS":
			keyboard.down = false;
			break;
		case "KeyD":
			keyboard.right = false;
			break;
		case "ShiftLeft":
			keyboard.shift = false;
			break;
		default:
			break;
	}
});
window.addEventListener('mousemove', function(event){
	mouse.x = event.offsetX;
	mouse.y = event.offsetY;
})

//load images
var player_sprite = new Image();
player_sprite.src = "data/c.png";
var enemy1_sprite = new Image();
enemy1_sprite.src = "data/js1.png";
var enemy2_sprite = new Image();
enemy2_sprite.src = "data/js2.png";
var enemy3_sprite = new Image();
enemy3_sprite.src = "data/js3.png";
var save_sprite = new Image();
save_sprite.src = "data/ts.png";

//player
var player = {
	x: ctx.canvas.width/2,
	y: ctx.canvas.height/2,
	width: 100,
	height: 100,
	speed: 0.5
}

class Enemy{
	constructor(x, y, type){
		this.type = type;
		this.x = x;
		this.y = y;
		this.height = 100;
		this.width = 100;
		this.speed = 0.2;
		this.time_before_getting_executed = 500;
	}
	draw(){
		switch(this.type){
			case 0:
				ctx.drawImage(enemy1_sprite,
					0, 0,
					enemy1_sprite.width, enemy1_sprite.height,
					this.x, this.y,
					this.width, this.height);
				break;
			case 1:
				ctx.drawImage(enemy2_sprite,
					0, 0,
					enemy2_sprite.width, enemy2_sprite.height,
					this.x, this.y,
					this.width, this.height);
				break;
			case 2:
				ctx.drawImage(enemy3_sprite,
					0, 0,
					enemy3_sprite.width, enemy3_sprite.height,
					this.x, this.y,
					this.width, this.height);
				break;
			case 3:
				ctx.drawImage(save_sprite,
					0, 0,
					save_sprite.width, save_sprite.height,
					this.x, this.y,
					this.width, this.height);
			default:
				break;
		}
	}
	update(){
		if(this.type != 3 &&
		bullet.x > this.x &&
		bullet.y > this.y &&
		bullet.x < this.x + this.height &&
		bullet.y < this.y + this.height){
			this.type = 3;
			score++;
		}
		if(this.type != 3 &&
		player.x + player.width > this.x &&
		player.y + player.height > this.y &&
		player.x < this.x + this.height &&
		player.y < this.y + this.height){
			this.type = 3;
			score -= 5;
		}
		if(this.type == 3 && floor_is_made_out_of_floor){
			floor_is_made_out_of_floor = floor_is_made_out_of_floor;
			this.time_before_getting_executed -= deltaTime;
		}
		else{
			this.x += this.speed * deltaTime * Math.cos(Math.atan2(player.y - this.y, player.x-this.x));
			this.y += this.speed * deltaTime * Math.sin(Math.atan2(player.y - this.y, player.x-this.x));
		}
	}
}

var enemies = [];

function updateSomeStuff(){
	if(time_1000 + game_speed < Date.now()){

		switch(Math.floor(Math.random()*4)){
			case 0:
				enemies.push(new Enemy(0,
				Math.floor(Math.random()*ctx.canvas.height),
				Math.floor(Math.random()*3)));
				break;
			case 1:
				enemies.push(new Enemy(ctx.canvas.width,
				Math.floor(Math.random()*ctx.canvas.height),
				Math.floor(Math.random()*3)));
				break;
			case 2:
				enemies.push(new Enemy(Math.floor(Math.random()*ctx.canvas.width),
				0,
				Math.floor(Math.random()*3)));
				break;
			case 3:
				enemies.push(new Enemy(Math.floor(Math.random()*ctx.canvas.width),
				ctx.canvas.height,
				Math.floor(Math.random()*3)));
				break;
			default:
				break;
		}

		bullet.x = player.x + player.width/2;
		bullet.y = player.y + player.height/2;
		bullet.angle = Math.atan2(mouse.y - bullet.y, mouse.x - bullet.x);

		if(game_speed > 100)
			game_speed-=10;
		time_1000 += game_speed;
	}

	for(let i = 0; i < enemies.length; i++){
		enemies[i].update();
		enemies[i].draw();
		if(enemies[i].time_before_getting_executed < 0)
			enemies.splice(i, 1);
	}

	bullet.x += bullet.speed * deltaTime * Math.cos(bullet.angle) * 1000/game_speed;
	bullet.y += bullet.speed * deltaTime * Math.sin(bullet.angle) * 1000/game_speed;
	ctx.fillStyle = "black";
	ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}










//main
function main(){
	deltaTime = Date.now() - lastUpdate;
	lastUpdate = Date.now();
	if(keyboard.left)  player.x -= player.speed * deltaTime;
	if(keyboard.right) player.x += player.speed * deltaTime;
	if(keyboard.up)    player.y -= player.speed * deltaTime;
	if(keyboard.down)  player.y += player.speed * deltaTime;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	updateSomeStuff();
	ctx.fillText("score: " + score, 10, 50);
	ctx.drawImage(player_sprite,
		0, 0,
		player_sprite.width, player_sprite.height,
		player.x, player.y,
		player.width, player.height);

	window.requestAnimationFrame(main);
}
main();
