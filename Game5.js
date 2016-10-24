window.onload = function ()
{
	// ** Variables **
	var canvas = document.getElementById("myCanvas"); // sets which div in the html the canvas will go in
	var widthCan = canvas.width;
	var heightCan = canvas.height;
	
	var context = canvas.getContext("2d"); // creates 2D canvas and calls it "context"
	var video = document.getElementById('video');
	video.loop = false;
	
	// ** Key Images **
	var displayKeys = true;
	
	var upImage = new Image();
	upImage.src = "assets/Up.gif";
	
	var downImage = new Image();
	downImage.src = "assets/Down.gif";
	
	var rightImage = new Image();
	rightImage.src = "assets/Right.gif";
	
	var leftImage = new Image();
	leftImage.src = "assets/Left.gif";
	
	var spacebarImage = new Image();
	spacebarImage.src = "assets/Space.gif";
	
	var enterImage = new Image();
	enterImage.src = "assets/Enter.gif";
	
	// ** PowerUp Images **
	var liveImage = new Image();
	liveImage.src = "assets/Live.gif";
	
	var oneBImage = new Image();
	oneBImage.src = "assets/OneB.gif";
	
	var twoBImage = new Image();
	twoBImage.src = "assets/TwoB.gif";
	
	var threeBImage = new Image();
	threeBImage.src = "assets/ThreeB.gif";
	
	var fourBImage = new Image();
	fourBImage.src = "assets/FourB.gif";
	
	var shieldImage = new Image();
	shieldImage.src = "assets/Shield.gif";
	
	var bot1Image = new Image();
	bot1Image.src = "assets/Bot1.gif";
	
	var bot2Image = new Image();
	bot2Image.src = "assets/Bot2.gif";
	
	var multiImage = new Image();
	multiImage.src = "assets/Multi.gif";
	
	// ** Player Images **
	var playerBulletImg = new Image();
	playerBulletImg.src = "assets/PlayerBullet1.gif";
	
	var playerImage = new Image();
	playerImage.src = "assets/Player1.gif";
	
	var playerRightImage = new Image();
	playerRightImage.src = "assets/PlayerRight1.gif";
	
	var playerLeftImage = new Image();
	playerLeftImage.src = "assets/PlayerLeft1.gif";
	
	var playerDamagedImage = new Image();
	playerDamagedImage.src = "assets/PlayerDamaged1.gif";
	
	var playerDamagedRightImage = new Image();
	playerDamagedRightImage.src = "assets/PlayerDamagedRight.gif";
	
	var playerDamagedLeftImage = new Image();
	playerDamagedLeftImage.src = "assets/PlayerDamagedLeft.gif";
	
	// ** Enemy Images **
	
	var enemyBulletImg = new Image();
	enemyBulletImg.src = "assets/EnemyBullet1.gif";
	
	var snd = new Audio("assets/click.wav"); // buffers automatically when created
	
	var game = false;
	var startUp = true;
	var settings = false;
	var gameover = false;
	//var menuArray = [0, 1, 2];
	
	var level = 1;
	var score = 0;
	var multiplier = 1;
	var lives = 5;
	
	var mText = '';
	var mTextX = 0;
	var mTextY = 0;
	
	// ** Player Variables **
	var player = {
		color: 'Green',
		x: (widthCan/2) - 15,
		y: (heightCan/2),
		width: 30,
		height: 30,
		speed: 2.5,
		bulletType: 'OneBull',
		bulletDamage: 1
	};
	
	var playerHit = false;
	
	var playerBullets = [];
	var playerBullShot = false;
	var playerBullDelay = 750;
	
	var powerUps = [];
	var playerPowerUps = [];
	
	// ** Bot Variables **
	
	var boolBot1 = false;
	var boolBot2 = false;
	
	var bot1 = {
		color: 'Purple',
		x: (player.x + (player.width/3)) + 40,
		y: (player.y + (player.height/3)) + 40,
		width: 15,
		height: 15,
		speed: 1
	};
	
	var bot2 = {
		color: 'Yellow',
		x: (player.x + (player.width/3)) - 40,
		y: (player.y + (player.height/3)) - 40,
		width: 15,
		height: 15,
		speed: 1
	};
	
	// ** Enemy Variables **
	
	var enemies = [];
	
	var eScore = '';
	var eScoreX = 0;
	var eScoreY = 0;
	
	var enemyBullets = [];
	var eBulletCount = 0;
	var eBulletDelay = 5000;
	
	var boolDrawLevel = false;
	var timeOutArray = [];
	var numOfEnemies = 5;
	var playGameOver = true;
	
	// ** Control Variables **
	
	var left = false;
	var right = false;
	var up = false;
	var down = false;
	var spacebar = false;
	var enter = false;
	
	// ** Event Listeners **
	
	window.addEventListener('keyup', function (key){
		
		if (key.which == 32){spacebar = false;}
		
		if (key.which == 37){left = false;}

		if (key.which == 39){right = false;}

		if (key.which == 38){up = false;}

		if (key.which == 40){down = false;}
		
		if (key.which == 13){enter = false;}

	});

	window.addEventListener('keydown', function (key){
		
		if (key.which == 32){spacebar = true;}
		
		if (key.which == 37){left = true;}

		if (key.which == 39){right = true;}

		if (key.which == 38){up = true;}

		if (key.which == 40){down = true;}
		
		if (key.which == 13){enter = true;}

	});
	
	// ** Collision Detection **
	
	function checkCollision()
	{
		// ** Enemy Loop **
		for (var i = 0; i < enemies.length; i++)
		{
			// Player
			if (playerHit == false)
			{
				if (player.x > (enemies[i].x - player.width) && 
					player.x < (enemies[i].x + enemies[i].width) && 
					player.y > (enemies[i].y - player.height) && 
					player.y < (enemies[i].y + enemies[i].height))
				{
					playerDamaged();
					if (lives <= 0)
					{
						game = false;
						startUp = false;
						gameover = true;
					}
				}
				else if (enemies[i].y > heightCan) 
				{
					// Checks if enemies are outOfBounds and remove from array
					enemies.splice(i, 1);
				}
			}
			
			if (enemies[i] != undefined && enemies[i].name == "Boss")
			{
				
				if (enemies[i].y == 200 && enemies[i].stop == false)
				{
					enemies[i].speedX = 1.5;
					enemies[i].speedY = 0;
					enemies[i].stop = true;
				}
				
				if (enemies[i].x >= (widthCan - (enemies[i].width * 3)) || enemies[i].x <= (0 + (enemies[i].width * 2)))
				{
					enemies[i].speedX *= -1;
				}
			}
			
			// Bullets
			for (var j = 0; j < playerBullets.length; j++)
			{
				if (enemies[i] != undefined)
				{
					if (playerBullets[j].x > (enemies[i].x - playerBullets[j].width) && 
						playerBullets[j].x < (enemies[i].x + enemies[i].width) &&
						playerBullets[j].y > (enemies[i].y - playerBullets[j].height) &&
						playerBullets[j].y < (enemies[i].y + enemies[i].height))
					{
						playerBullets.splice(j, 1);
						enemies[i].lives--;
						
						if (enemies[i].lives == 0)
						{
							if (enemies[i].name == "Boss") // Has the boss of the level been defeated
							{
								level++; // Increase level
								numOfEnemies = numOfEnemies + 5;
								timeOutArray = [];
								boolDrawLevel = false; // Draws next level
							}
							else if (enemies[i].name == "Bomb")
							{
								createEnemyBullets(enemies[i], enemies[i].bullType);
							}
							score += (enemies[i].score * multiplier);
							eScoreX = enemies[i].x;
							eScoreY = enemies[i].y;
							eScore = (enemies[i].score * multiplier);
							setTimeout(function() {
								eScore = '';
							}, 2000);
							enemies.splice(i, 1);
						}
					}
				}
			}
		}
		
		for (var i = 0; i < enemyBullets.length; i++)
		{
			// Player
			if (playerHit == false)
			{
				for (var s = 0; s < playerPowerUps.length; s++)
				{
					if (enemyBullets[i] != undefined)
					{
						if (playerPowerUps[s].x > (enemyBullets[i].x - playerPowerUps[s].width) && 
							playerPowerUps[s].x < (enemyBullets[i].x + enemyBullets[i].width) && 
							playerPowerUps[s].y > (enemyBullets[i].y - playerPowerUps[s].height) && 
							playerPowerUps[s].y < (enemyBullets[i].y + enemyBullets[i].height))
						{
							playerPowerUps[s].hit -= 1;
							enemyBullets.splice(i, 1);
							
							if (playerPowerUps[s].hit == 0)
							{
								playerPowerUps.splice(s, 1);
							}
						}
					}
					
				}
				
				if (enemyBullets[i] != undefined)
				{
					if (player.x > (enemyBullets[i].x - player.width) && 
						player.x < (enemyBullets[i].x + enemyBullets[i].width) && 
						player.y > (enemyBullets[i].y - player.height) && 
						player.y < (enemyBullets[i].y + enemyBullets[i].height))
					{
						playerDamaged();
						enemyBullets.splice(i, 1);
					}
					else if (enemyBullets[i].y > heightCan || enemyBullets[i].x > widthCan ||
							enemyBullets[i].y < 0 || enemyBullets[i].x < 0) 
					{
						// Checks if enemies are outOfBounds and remove from array
						enemyBullets.splice(i, 1);
					}
				}
			}
		}
		
		// Checks if bullets are outOfBounds and remove from array
		for (var j = 0; j < playerBullets.length; j++)
		{
			if (playerBullets[j] != undefined)
			{
				if (playerBullets[j].y > (heightCan + 60) || playerBullets[j].x > (widthCan + 60) ||
					playerBullets[j].y < -60 || playerBullets[j].x < -60)
				{
					playerBullets.splice(j, 1);
				}
			}
		}
		
		// Check collision with powerUps
		for (var k = 0; k < powerUps.length; k++)
		{
			if (powerUps[k] != undefined)
			{
				if (player.x > (powerUps[k].x - player.width) && 
					player.x < (powerUps[k].x + powerUps[k].width) && 
					player.y > (powerUps[k].y - player.height) && 
					player.y < (powerUps[k].y + powerUps[k].height))
				{
					switch (powerUps[k].name)
					{
						case 'live':
							lives += powerUps[k].increase;
							mText = '+' + 1;
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'multi':
							multiplier += powerUps[k].increase;
							mText = 'x' + multiplier;
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'speedUp':
							player.speed += powerUps[k].increase;
							break;
						case 'Bot1':
							boolBot1 = true;
							break;
						case 'Bot2':
							boolBot2 = true;
							break;
						case 'Shield':
							createShield();
							mText = 'Shield';
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'OneBull':
							player.bulletType = powerUps[k].name
							mText = 'OneBullet';
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'TwoBull':
							player.bulletType = powerUps[k].name
							mText = 'TwoBullet';
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'ThreeBull':
							player.bulletType = powerUps[k].name
							mText = 'ThreeBullet';
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'FourBull':
							player.bulletType = powerUps[k].name
							mText = 'FourBullet';
							mTextX = powerUps[k].x;
							mTextY = powerUps[k].y;
							break;
						case 'PowerUp':
							player.bulletDamage += powerUps[k].increase;
							break;
					}
					setTimeout(function() {
						mText = '';
					}, 1000);
					powerUps.splice(k, 1);
				}
			}
		}
	}
	
	function playerDamaged()
	{
		snd.play();
		lives -= 1;
		player.speed = 2.5;
		playerHit = true;
		multiplier = 1;
		// Immune for a few seconds
		setTimeout(function()
		{
			playerHit = false;
		}, 2000);
	}
	
	// ** Player Bullet Creation **
	
	function createPlayerBullet(type, object)
	{
		switch(type) {
			case 'OneBull':
				var oneBull = {
					color: 'Black',
					x: (object.x + (object.width/3)),
					y: object.y,
					width: 8,
					height: 8,
					speedX: 0,
					speedY: 3,
					degree: 0
				};
				playerBullets.push(oneBull);
				break;
			case 'TwoBull':
				var twoBull1 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: -1,
					speedY: 3,
					degree: 0
				};
				var twoBull2 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: 1,
					speedY: 3,
					degree: 0
				};
				playerBullets.push(twoBull1);
				playerBullets.push(twoBull2);
				break;
			case 'ThreeBull':
				var threeBull1 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: -1,
					speedY: 3,
					degree: 0
				};
				var threeBull2 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: 1,
					speedY: 3,
					degree: 0
				};
				var threeBull3 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: 0,
					speedY: 3,
					degree: 0
				};
				playerBullets.push(threeBull1);
				playerBullets.push(threeBull2);
				playerBullets.push(threeBull3);
				break;
			case 'FourBull':
				var threeBull1 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: -1.5,
					speedY: 3,
					degree: 0
				};
				var threeBull2 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: 1.5,
					speedY: 3,
					degree: 0
				};
				var threeBull3 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: 0.5,
					speedY: 3,
					degree: 0
				};
				var threeBull4 = {
					color: 'Black',
					x: (player.x + (player.width/3)),
					y: player.y,
					width: 8,
					height: 8,
					speedX: -0.5,
					speedY: 3,
					degree: 0
				};
				playerBullets.push(threeBull1);
				playerBullets.push(threeBull2);
				playerBullets.push(threeBull3);
				playerBullets.push(threeBull4);
				break;
			case 'SmallBull':
				var oneBull = {
					color: 'Black',
					x: (object.x + (object.width/3)),
					y: object.y,
					width: 5,
					height: 5,
					speedX: 0,
					speedY: 3,
					degree: 0
				};
				playerBullets.push(oneBull);
				break;
		}
		
		playerBullShot = true;
		setTimeout(function()
		{
			playerBullShot = false;
		}, playerBullDelay);
	}
	
	function drawPlayerBullets()
	{
		playerBullets.forEach(function(b) {
			b.x -= b.speedX;
			b.y -= b.speedY;
			
			context.drawImage(playerBulletImg, b.x, b.y, b.width, b.height);
			//context.fillStyle = b.color;
			//context.fillRect(b.x, b.y, b.width, b.height);
		});
	}
	
	// ** Create Power-ups **
	function createPowerUp(type, crx, cry)
	{
		switch(type) {
			case 'Live':
				var powerUp = {
					name: 'live',
					color: 'Pink',
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 1
				};
				powerUps.push(powerUp);
				break;
			case 'Multi':
				var powerUp = {
					name: 'multi',
					color: 'Red',
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 1
				};
				powerUps.push(powerUp);
				break;
			case 'Bot1':
				var powerUp = {
					name: 'Bot1',
					color: 'Purple',
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 1
				};
				powerUps.push(powerUp);
				break;
			case 'Bot2':
				var powerUp = {
					name: 'Bot2',
					color: 'Yellow',
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 1
				};
				powerUps.push(powerUp);
				break;
			case 'SpeedUp':
				var powerUp = {
					name: 'speedUp',
					color: 'Green',
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 0.5
				};
				powerUps.push(powerUp);
				break;
			case 'Shield':
				var powerUp = {
					name: 'Shield',
					color: "rgba(0, 0, 200, 0.5)",
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 0
				};
				powerUps.push(powerUp);
				break;
			case 'OneBullet':
				var powerUp = {
					name: 'OneBull',
					color: "rgba(100, 120, 200, 1)",
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 0
				};
				powerUps.push(powerUp);
			case 'TwoBullet':
				break;
				var powerUp = {
					name: 'TwoBull',
					color: "rgba(100, 140, 200, 1)",
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 0
				};
				powerUps.push(powerUp);
				break;
			case 'ThreeBullet':
				var powerUp = {
					name: 'ThreeBull',
					color: "rgba(100, 160, 200, 1)",
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 0
				};
				powerUps.push(powerUp);
				break;
			case 'FourBullet':
				var powerUp = {
					name: 'FourBull',
					color: "rgba(100, 180, 200, 1)",
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 0
				};
				powerUps.push(powerUp);
				break;
			case 'PowerUp':
				var powerUp = {
					name: 'PowerUp',
					color: "rgba(0, 200, 200, 0.5)",
					x: crx,
					y: cry,
					width: 15,
					height: 15,
					increase: 1
				};
				powerUps.push(powerUp);
				break;
		}
	}
	
	function createShield()
	{
		var shield = {
			name: 'shield',
			color: "rgba(0, 0, 200, 0.5)",
			x: (player.x - 5), 
			y: (player.y - 5),
			width: (player.width + 10),
			height: (player.height + 10),
			hit: 5
		};
		playerPowerUps.push(shield);
	}
	
	// ** Create Enemies **
	function createEnemy(type, crx, cry)
	{
		switch(type) {
			case 'Basic1':
				var basicEm = {
					name: 'Basic1',
					color: 'rgba(0, 0, 255, 1)',
					x: crx,
					y: cry,
					width: 20,
					height: 20,
					lives: 1,
					speedX: 0,
					speedY: 1,
					score: 10, 
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Basic2':
				var basicEm = {
					name: 'Basic2',
					color: 'rgba(0, 0, 205, 1)',
					x: crx,
					y: cry,
					width: 25,
					height: 25,
					lives: 2,
					speedX: 0,
					speedY: 1,
					score: 15, 
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Basic3':
				var basicEm = {
					name: 'Basic3',
					color: 'rgba(0, 0, 155, 1)',
					x: crx,
					y: cry,
					width: 30,
					height: 30,
					lives: 3,
					speedX: 0,
					speedY: 1,
					score: 20, 
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Basic4':
				var basicEm = {
					name: 'Basic4',
					color: 'rgba(0, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 35,
					height: 35,
					lives: 4,
					speedX: 0,
					speedY: 1,
					score: 25, 
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Boss1':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(20, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 50,
					height: 50,
					lives: 5,
					speedX: 0,
					speedY: 1,
					score: 100, 
					stop: false,
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Boss2':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(40, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 7,
					speedX: 0,
					speedY: 1,
					score: 200, 
					stop: false,
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Boss3':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(60, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 9,
					speedX: 0,
					speedY: 1,
					score: 300, 
					stop: false,
					bullets: false,
					bullType: 'OneShot',
					shootSpeed: 5000
				};
				enemies.push(basicEm);
				break;
			case 'Boss4':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(60, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 11,
					speedX: 0,
					speedY: 1,
					score: 400, 
					stop: false,
					bullets: true,
					bullType: 'OneShot',
					shootSpeed: 4000
				};
				enemies.push(basicEm);
				break;
			case 'Boss5':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(80, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 13,
					speedX: 0,
					speedY: 1,
					score: 500, 
					stop: false,
					bullets: true,
					bullType: 'OneShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'Boss6':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(100, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 15,
					speedX: 0,
					speedY: 1,
					score: 600, 
					stop: false,
					bullets: true,
					bullType: 'TwoShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'Boss7':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(120, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 18,
					speedX: 0,
					speedY: 1,
					score: 700, 
					stop: false,
					bullets: true,
					bullType: 'ThreeShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'Boss8':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(140, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 22,
					speedX: 0,
					speedY: 1,
					score: 800, 
					stop: false,
					bullets: true,
					bullType: 'FourShot',
					shootSpeed: 2350
				};
				enemies.push(basicEm);
				break;
			case 'Boss9':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(180, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 25,
					speedX: 0,
					speedY: 1,
					score: 900, 
					stop: false,
					bullets: true,
					bullType: 'FiveShot',
					shootSpeed: 2200
				};
				enemies.push(basicEm);
				break;
			case 'Boss10':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(200, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 30,
					speedX: 0,
					speedY: 1,
					score: 1000, 
					stop: false,
					bullets: true,
					bullType: 'BigShot',
					shootSpeed: 2100
				};
				enemies.push(basicEm);
				break;
			case 'Boss11':
				var basicEm = {
					name: 'Boss',
					color: 'rgba(200, 0, 105, 1)',
					x: crx,
					y: cry,
					width: 60,
					height: 60,
					lives: 40,
					speedX: 0,
					speedY: 1,
					score: 2000, 
					stop: false,
					bullets: true,
					bullType: 'BiggerShot',
					shootSpeed: 2000
				};
				enemies.push(basicEm);
				break;
			case 'Bomb1':
				var basicEm = {
					name: 'Bomb',
					color: 'rgba(250, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 20,
					height: 20,
					lives: 2,
					speedX: 0,
					speedY: 1,
					score: 30, 
					bullets: false,
					bullType: 'FiveShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'Bomb2':
				var basicEm = {
					name: 'Bomb',
					color: 'rgba(250, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 25,
					height: 25,
					lives: 3,
					speedX: 0,
					speedY: 1,
					score: 40, 
					bullets: false,
					bullType: 'SixShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'Bomb3':
				var basicEm = {
					name: 'Bomb',
					color: 'rgba(250, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 30,
					height: 30,
					lives: 3,
					speedX: 0,
					speedY: 1,
					score: 50, 
					bullets: false,
					bullType: 'EightShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'FastShooter1':
				var basicEm = {
					name: 'FastShooter1',
					color: 'rgba(50, 153, 51, 1)',
					x: crx,
					y: cry,
					width: 20,
					height: 20,
					lives: 1,
					speedX: 0,
					speedY: 1,
					score: 20, 
					bullets: true,
					bullType: 'OneShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'FastShooter2':
				var basicEm = {
					name: 'FastShooter2',
					color: 'rgba(50, 153, 51, 1)',
					x: crx,
					y: cry,
					width: 30,
					height: 30,
					lives: 2,
					speedX: 0,
					speedY: 1,
					score: 25, 
					bullets: true,
					bullType: 'TwoShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'FastShooter3':
				var basicEm = {
					name: 'FastShooter3',
					color: 'rgba(50, 153, 51, 1)',
					x: crx,
					y: cry,
					width: 40,
					height: 40,
					lives: 3,
					speedX: 0,
					speedY: 1,
					score: 30, 
					bullets: true,
					bullType: 'ThreeShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'FastShooter4':
				var basicEm = {
					name: 'FastShooter4',
					color: 'rgba(50, 153, 51, 1)',
					x: crx,
					y: cry,
					width: 45,
					height: 45,
					lives: 4,
					speedX: 0,
					speedY: 1,
					score: 40, 
					bullets: true,
					bullType: 'FourShot',
					shootSpeed: 2500
				};
				enemies.push(basicEm);
				break;
			case 'Shooter1':
				var basicEm = {
					name: 'Shooter1',
					color: 'rgba(50, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 20,
					height: 20,
					lives: 1,
					speedX: 0,
					speedY: 1,
					score: 20, 
					bullets: true,
					bullType: 'OneShot',
					shootSpeed: 4000
				};
				enemies.push(basicEm);
				break;
			case 'Shooter2':
				var basicEm = {
					name: 'Shooter2',
					color: 'rgba(50, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 30,
					height: 30,
					lives: 2,
					speedX: 0,
					speedY: 1,
					score: 25, 
					bullets: true,
					bullType: 'TwoShot',
					shootSpeed: 4000
				};
				enemies.push(basicEm);
				break;
			case 'Shooter3':
				var basicEm = {
					name: 'Shooter3',
					color: 'rgba(50, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 35,
					height: 35,
					lives: 3,
					speedX: 0,
					speedY: 1,
					score: 30, 
					bullets: true,
					bullType: 'ThreeShot',
					shootSpeed: 4000
				};
				enemies.push(basicEm);
				break;
			case 'Shooter4':
				var basicEm = {
					name: 'Shooter4',
					color: 'rgba(50, 153, 151, 1)',
					x: crx,
					y: cry,
					width: 40,
					height: 40,
					lives: 4,
					speedX: 0,
					speedY: 1,
					score: 35, 
					bullets: true,
					bullType: 'FourShot',
					shootSpeed: 4000
				};
				enemies.push(basicEm);
				break;
		}
	}
	
	// ** Create Enemy Bullets **
	function createEnemyBullets(enemy, type)
	{
		switch (type) {
			case 'OneShot':
				var bullet = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: 2
				};
				enemyBullets.push(bullet);
				break;
			case 'TwoShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1,
					speedY: 2
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				break;
			case 'ThreeShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1,
					speedY: 2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: 2
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				break;
			case 'FourShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1,
					speedY: -2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1,
					speedY: -2
				};
				var bullet4 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1,
					speedY: 2
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				enemyBullets.push(bullet4);
				break;
			case 'FiveShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1.5,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1.5,
					speedY: -2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1.5,
					speedY: -2
				};
				var bullet4 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1.5,
					speedY: 2
				};
				var bullet5 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: 2.5
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				enemyBullets.push(bullet4);
				enemyBullets.push(bullet5);
				break;
			case 'SixShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1.5,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1.5,
					speedY: -2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1.5,
					speedY: -2
				};
				var bullet4 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1.5,
					speedY: 2
				};
				var bullet5 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: -2
				};
				var bullet6 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: 2
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				enemyBullets.push(bullet4);
				enemyBullets.push(bullet5);
				enemyBullets.push(bullet6);
				break;
			case 'EightShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 2,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -2,
					speedY: -2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 2,
					speedY: -2
				};
				var bullet4 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -2,
					speedY: 2
				};
				var bullet5 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: -2
				};
				var bullet6 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: 2
				};
				var bullet7 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 2,
					speedY: 0
				};
				var bullet8 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -2,
					speedY: 0
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				enemyBullets.push(bullet4);
				enemyBullets.push(bullet5);
				enemyBullets.push(bullet6);
				enemyBullets.push(bullet7);
				enemyBullets.push(bullet8);
				break;
			case 'BigShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 2,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1,
					speedY: 2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 0,
					speedY: 2
				};
				var bullet4 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -2,
					speedY: 2
				};
				var bullet5 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1,
					speedY: 2
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				enemyBullets.push(bullet4);
				enemyBullets.push(bullet5);
				break;
			case 'BiggerShot':
				var bullet1 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 2,
					speedY: 2
				};
				var bullet2 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 1,
					speedY: 2
				};
				var bullet3 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: 3,
					speedY: 2
				};
				var bullet4 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -2,
					speedY: 2
				};
				var bullet5 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -1,
					speedY: 2
				};
				var bullet6 = {
					color: 'Red',
					x: (enemy.x + ((enemy.width/2) - 5)),
					y: (enemy.y + ((enemy.height/2) - 5)),
					width: 10,
					height: 10,
					speedX: -3,
					speedY: 2
				};
				enemyBullets.push(bullet1);
				enemyBullets.push(bullet2);
				enemyBullets.push(bullet3);
				enemyBullets.push(bullet4);
				enemyBullets.push(bullet5);
				enemyBullets.push(bullet6);
				break;
		}
		
		eBulletCount++;
		setTimeout(function()
		{
			eBulletCount = 0;
		}, eBulletDelay);
	}
	
	function drawEnemyBullets()
	{
		enemyBullets.forEach(function(b) {
			b.y += b.speedY;
			b.x += b.speedX;
			
			//context.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height);
			context.fillStyle = b.color;
			context.fillRect(b.x, b.y, b.width, b.height);
		});
	}
	
	// ** Draw **
	
	function drawLevel(currentLevel)
	{
		if (boolDrawLevel == false)
		{
			boolDrawLevel = true;
			// Clear emeneyBullets
			setTimeout(function()
			{
				var xPowerUp = 0;
				var yPowerUp = 0;
				var randomDelay = Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
				var randPower = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
				var timeSet = setTimeout(function()
				{	
					xPowerUp = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
					yPowerUp = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
					if (randPower == 1)
					{
						createPowerUp('Multi', xPowerUp, yPowerUp);
					}
					else if (randPower == 2)
					{
						createPowerUp('Shield', xPowerUp, yPowerUp);
					}
					else if (randPower == 3)
					{
						createPowerUp('OneBullet', xPowerUp, yPowerUp);
					}
					else if (randPower == 4)
					{
						createPowerUp('TwoBullet', xPowerUp, yPowerUp);
					}
					else if (randPower == 5)
					{
						createPowerUp('ThreeBullet', xPowerUp, yPowerUp);
					}
					else if (randPower == 6)
					{
						createPowerUp('FourBullet', xPowerUp, yPowerUp);
					}
					else
					{
						createPowerUp('Live', xPowerUp, yPowerUp);
					}
				}, randomDelay);
				timeOutArray.push(timeSet);
				
				switch(currentLevel) 
				{
					case 1:
						var xPosition = 100;
						var timeDelayer = 4000;
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								xPosition = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
								createEnemy('Basic1', xPosition, -100);
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 4000;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss1', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 2:
						var xPosition = 100;
						var timeDelayer = 4000;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (600 - 200 + 1)) + 200;
								if (randEnem <= 3)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else
								{
									createEnemy('Basic2', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 4000;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss2', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 3:
						var xPosition = 100;
						var timeDelayer = 4000;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Basic2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Basic3', xPosition, -100);
								}
								else
								{
									createEnemy('Basic4', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 4000;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss3', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 4:
						var xPosition = 100;
						var timeDelayer = 4000;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Shooter1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else
								{
									createEnemy('Basic2', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 4000;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss4', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 5:
						var xPosition = 100;
						var timeDelayer = 3000;
						var randEnem = 0;
						
						createPowerUp('Bot1', 380, 400);
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Shooter1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
								else
								{
									createEnemy('FastShooter2', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 3000;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss5', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 6:
						var xPosition = 100;
						var timeDelayer = 2500;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Shooter1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Basic2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
								else
								{
									createEnemy('Bomb1', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 2500;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss6', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 7:
						var xPosition = 100;
						var timeDelayer = 2500;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Bomb1', xPosition, -100);
								}
								else if (randEnem == 4)
								{
									createEnemy('Basic3', xPosition, -100);
								}
								else
								{
									createEnemy('Bomb2', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 2500;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss7', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 8:
						var xPosition = 100;
						var timeDelayer = 2300;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Basic2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Bomb1', xPosition, -100);
								}
								else if (randEnem == 4)
								{
									createEnemy('Bomb2', xPosition, -100);
								}
								else if (randEnem == 5)
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
								else if (randEnem == 6)
								{
									createEnemy('FastShooter3', xPosition, -100);
								}
								else if (randEnem == 7)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else
								{
									createEnemy('Shooter4', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 2300;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss8', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 9:
						var xPosition = 100;
						var timeDelayer = 2200;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Basic2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Bomb1', xPosition, -100);
								}
								else if (randEnem == 4)
								{
									createEnemy('Bomb2', xPosition, -100);
								}
								else if (randEnem == 5)
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
								else if (randEnem == 6)
								{
									createEnemy('FastShooter3', xPosition, -100);
								}
								else if (randEnem == 7)
								{
									createEnemy('Bomb3', xPosition, -100);
								}
								else if (randEnem == 8)
								{
									createEnemy('Basic4', xPosition, -100);
								}
								else if (randEnem == 9)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else
								{
									createEnemy('Shooter4', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 2200;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss9', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					case 10:
						var xPosition = 100;
						var timeDelayer = 2100;
						var randEnem = 0;
						
						createPowerUp('Bot2', 380, 400);
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Basic2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Basic3', xPosition, -100);
								}
								else if (randEnem == 4)
								{
									createEnemy('Bomb1', xPosition, -100);
								}
								else if (randEnem == 5)
								{
									createEnemy('Bomb3', xPosition, -100);
								}
								else if (randEnem == 6)
								{
									createEnemy('FastShooter3', xPosition, -100);
								}
								else if (randEnem == 7)
								{
									createEnemy('FastShooter4', xPosition, -100);
								}
								else if (randEnem == 8)
								{
									createEnemy('Shooter3', xPosition, -100);
								}
								else if (randEnem == 9)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else if (randEnem == 10)
								{
									createEnemy('Basic4', xPosition, -100);
								}
								else if (randEnem == 11)
								{
									createEnemy('Bomb2', xPosition, -100);
								}
								else
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 2100;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss10', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
					default:
						var xPosition = 100;
						var timeDelayer = 2000;
						var randEnem = 0;
						
						for (var i = 0; i < numOfEnemies; i++)
						{
							var timeSet = setTimeout(function()
							{	
								randEnem = Math.floor(Math.random() * (15 - 1 + 1)) + 1;
								xPosition = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
								if (randEnem == 1)
								{
									createEnemy('Basic1', xPosition, -100);
								}
								else if (randEnem == 2)
								{
									createEnemy('Basic2', xPosition, -100);
								}
								else if (randEnem == 3)
								{
									createEnemy('Basic3', xPosition, -100);
								}
								else if (randEnem == 4)
								{
									createEnemy('Basic4', xPosition, -100);
								}
								else if (randEnem == 5)
								{
									createEnemy('Bomb1', xPosition, -100);
								}
								else if (randEnem == 6)
								{
									createEnemy('Bomb2', xPosition, -100);
								}
								else if (randEnem == 7)
								{
									createEnemy('Bomb3', xPosition, -100);
								}
								else if (randEnem == 8)
								{
									createEnemy('FastShooter1', xPosition, -100);
								}
								else if (randEnem == 9)
								{
									createEnemy('FastShooter2', xPosition, -100);
								}
								else if (randEnem == 10)
								{
									createEnemy('FastShooter3', xPosition, -100);
								}
								else if (randEnem == 11)
								{
									createEnemy('FastShooter4', xPosition, -100);
								}
								else if (randEnem == 12)
								{
									createEnemy('Shooter1', xPosition, -100);
								}
								else if (randEnem == 13)
								{
									createEnemy('Shooter2', xPosition, -100);
								}
								else if (randEnem == 14)
								{
									createEnemy('Shooter3', xPosition, -100);
								}
								else
								{
									createEnemy('Shooter4', xPosition, -100);
								}
							}, timeDelayer);
							timeOutArray.push(timeSet);
							timeDelayer += 2000;
						}
						
						var timeSet = setTimeout(function()
						{	
							createEnemy('Boss10', 370, -100);
						}, timeDelayer);
						timeOutArray.push(timeSet);
						break;
				}
				
			}, 3000)
		}
		else
		{
			enemies.forEach(function(e) {
				e.y += e.speedY;
				e.x += e.speedX;
				
				context.fillStyle = e.color;
				context.fillRect(e.x, e.y, e.width, e.height);
				
				if (e.bullets == true)
				{
					e.bullets = false;
					createEnemyBullets(e, e.bullType);
					setTimeout(function() 
					{
						e.bullets = true;
					}, e.shootSpeed);
				}
			});
			
			drawEnemyBullets();
			
			powerUps.forEach(function(p) {
				
				if (p.name == 'live')
				{
					context.drawImage(liveImage, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'OneBull')
				{
					context.drawImage(oneBImage, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'TwoBull')
				{
					context.drawImage(twoBImage, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'ThreeBull')
				{
					context.drawImage(threeBImage, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'FourBull')
				{
					context.drawImage(fourBImage, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'Shield')
				{
					context.drawImage(shieldImage, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'Bot1')
				{
					context.drawImage(bot1Image, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'Bot2')
				{
					context.drawImage(bot2Image, p.x, p.y, p.width, p.height);
				}
				else if (p.name == 'multi')
				{
					context.drawImage(multiImage, p.x, p.y, p.width, p.height);
				}
				else
				{
					context.fillStyle = p.color;
					context.fillRect(p.x, p.y, p.width, p.height);
				}
			});
			
			playerPowerUps.forEach(function(s) {
				context.fillStyle = s.color;
				context.fillRect(player.x-5, player.y-5, s.width, s.height);
				s.x = player.x-5;
				s.y = player.y-5;
			});
		}
	}
	
	var s = Math.sin(0.025);
	var c = Math.cos(0.025);
	
	function draw()
	{
		setTimeout(function()
		{
			requestAnimationFrame(draw);
			context.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas
			
			if (game == true)
			{	
				// ** Draw Objects **
				if (playerHit == true && right)
				{
					context.drawImage(playerDamagedRightImage, player.x, player.y);
				}
				else if (playerHit == true && left)
				{
					context.drawImage(playerDamagedLeftImage, player.x, player.y);
				}
				else if (playerHit == true)
				{
					context.drawImage(playerDamagedImage, player.x, player.y);
				}
				else if (right)
				{
					context.drawImage(playerRightImage, player.x, player.y);
				}
				else if (left)
				{
					context.drawImage(playerLeftImage, player.x, player.y);
				}
				else
				{
					context.drawImage(playerImage, player.x, player.y);
				}
				
				if (boolBot1 == true)
				{
					var botX = c * (bot1.x - (player.x + (player.width/3))) - s * (bot1.y - (player.y + (player.height/3))) + (player.x + (player.width/3));
					var botY = s * (bot1.x - (player.x + (player.width/3))) + c * (bot1.y - (player.y + (player.height/3))) + (player.y + (player.height/3));
				
					bot1.x = botX;
					bot1.y = botY
					
					context.drawImage(bot1Image, bot1.x, bot1.y, bot1.width, bot1.height);
					//context.fillStyle = bot1.color;
					//context.fillRect(bot1.x, bot1.y, bot1.width, bot1.height);
				}
				
				if (boolBot2 == true)
				{
					var botX = c * (bot2.x - (player.x + (player.width/3))) - s * (bot2.y - (player.y + (player.height/3))) + (player.x + (player.width/3));
					var botY = s * (bot2.x - (player.x + (player.width/3))) + c * (bot2.y - (player.y + (player.height/3))) + (player.y + (player.height/3));
				
					bot2.x = botX;
					bot2.y = botY
					
					context.drawImage(bot2Image, bot2.x, bot2.y, bot2.width, bot2.height);
					//context.fillStyle = bot2.color;
					//context.fillRect(bot2.x, bot2.y, bot2.width, bot2.height);
				}
				
				drawLevel(level);
				drawPlayerBullets();
				
				
				// ** Text **
				context.fillStyle = "Black";
				context.font = "20px Verdana";
				
				context.fillText('Score: ' + score, 20, 40);
				context.fillText("Level: " + level, 350, 40);
				context.drawImage(liveImage, 660, 25, 15, 15);
				context.fillText('   x ' + lives, 660, 40);
				
				context.fillText("x" + multiplier, (widthCan/2), (heightCan - 40));
				
				context.fillText(eScore, eScoreX, eScoreY);
				context.fillText(mText, mTextX, mTextY);
				
				checkCollision();
				
				if (displayKeys)
				{
					context.drawImage(spacebarImage, 295, 550);
					context.fillText('To shot', 300, 600);
					
					context.drawImage(leftImage, 392, 550);
					context.drawImage(downImage, 422, 550);
					context.drawImage(rightImage, 452, 550);
					context.drawImage(upImage, 422, 520);
					context.fillText('To Move', 395, 600);
				}
				setTimeout(function() {
					displayKeys = false;
				}, 10000);
				
				context.stroke;
				
				// ** Controls **
				if (left)
				{
					player.x -= player.speed;
					bot1.x -= player.speed;
					bot2.x -= player.speed;
					
					if (player.x < 0) 
					{
						player.x = 0;
						bot1.x += player.speed;
						bot2.x += player.speed;
					}
				}
				
				if (right)
				{
					player.x += player.speed;
					bot1.x += player.speed;
					bot2.x += player.speed;
					
					if (player.x > (widthCan - player.width))
					{
						player.x = (widthCan - player.width)
						bot1.x -= player.speed;
						bot2.x -= player.speed;
					}
				}
				
				if (up)
				{
					player.y -= player.speed;
					bot1.y -= player.speed;
					bot2.y -= player.speed;
					
					if (player.y < 0) 
					{
						player.y = 0;
						bot1.y += player.speed;
						bot2.y += player.speed;
					}
				}
				
				if (down)
				{
					player.y += player.speed;
					bot1.y += player.speed;
					bot2.y += player.speed;
					
					if (player.y > (heightCan - player.height))
					{
						player.y = (heightCan - player.height)
						bot1.y -= player.speed;
						bot2.y -= player.speed;
					}
				}
				
				if (spacebar)
				{
					if (playerBullShot == false)
					{
						createPlayerBullet(player.bulletType, player);
						if (boolBot1 == true)
						{
							createPlayerBullet('SmallBull', bot1);
						}
						
						if (boolBot2 == true)
						{
							createPlayerBullet('SmallBull', bot2);
						}
					}
				}
			}
			else if (startUp)
			{
				context.fillStyle = "Black";
				context.font = "35px Verdana";
				
				context.fillText('SHOOTING', 295, 100);
				context.fillText('GAME', 340, 150);
				
				context.font = "25px Verdana";
				
				context.fillText('Shoot down the squares!', 260, 450);
				
				context.drawImage(enterImage, 360, 700);
				context.fillText('Press enter to play!', 280, 800);
				
				if (enter)
				{
					game = true;
					startUp = false;
					gameover = false;
				}
				
				context.stroke;
			}
			else if (gameover)
			{
				level = 1;
				score = 0;
				lives = 5;
				multiplier = 1;
				numOfEnemies = 5;
				boolDrawLevel = false;
				boolBot1 = false;
				boolBot2 = false;
				player.x = (widthCan/2) - 15
				player.y = (heightCan/2);
				enemies = [];
				enemyBullets = [];
				playerBullets = [];
				playerPowerUps = [];
				powerUps = [];
				
				timeOutArray.forEach(function(t) {
					clearTimeout(t);
				});
				
				timeOutArray = [];
				
				context.fillStyle = "Black";
				context.font = "25px Verdana";
				
				//context.fillText('GAME', 350, 60);
				//context.fillText('OVER', 350, 100);
				
				context.drawImage(enterImage, 360, 700);
				context.fillText('Press enter to try again!', 250, 800);
				
				if (playGameOver)
				{
					playGameOver = false;
					video.style.display = 'block';
					video.play();
				}
				
				if (enter)
				{
					playGameOver = true;
					video.style.display = 'none';
					video.pause();
					video.currentTime = 0;
					game = true;
					startUp = false;
					gameover = false;
				}
			}
			
		}, 1000 / 60);
	}
	draw();	
}