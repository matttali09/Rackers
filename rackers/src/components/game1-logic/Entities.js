let player;

Entity = (type, id, x, y, width, height, img) => {
	const self = {
		type,
		id,
		x,
		y,
		width,
		height,
		img,
	};
	self.update = () => {
		self.updatePosition();
		self.draw();
	}
	self.draw = () => {
		ctx.save();
		let x = self.x - player.x;
		let y = self.y - player.y;
		
		x += WIDTH/2;
		y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		ctx.drawImage(self.img,
			0,0,self.img.width,self.img.height,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	}
	self.getDistance = entity2 => {	//return distance (number)
		const vx = self.x - entity2.x;
		const vy = self.y - entity2.y;
		return Math.sqrt(vx*vx+vy*vy);
	}

	self.testCollision = entity2 => {	//return if colliding (true/false)
		const rect1 = {
			x:self.x-self.width/2,
			y:self.y-self.height/2,
			width:self.width,
			height:self.height,
		};
		const rect2 = {
			x:entity2.x-entity2.width/2,
			y:entity2.y-entity2.height/2,
			width:entity2.width,
			height:entity2.height,
		};
		return testCollisionRectRect(rect1,rect2);
		
	}
	self.updatePosition = () => {}
	
	return self;
}

Player = () => {
	const self = Actor('player','myId',50,40,50*1.5,70*1.5,Img.player,10,1);
	self.maxMoveSpd = 10;
	self.pressingMouseLeft = false;
	self.pressingMouseRight = false;
	
	const super_update = self.update;
	self.update = () => {
		super_update();
		if(self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
			self.spriteAnimCounter += 0.2;
		if(self.pressingMouseLeft)
			self.performAttack();
		if(self.pressingMouseRight)
			self.performSpecialAttack();
	}	
	
	
	self.onDeath = () => {
		const timeSurvived = Date.now() - timeWhenGameStarted;		
		console.log(`You lost! You survived for ${timeSurvived} ms.`);		
		startNewGame();
	}
	
	
	
	return self;
	
}

Actor = (type, id, x, y, width, height, img, hp, atkSpd) => {
	const self = Entity(type,id,x,y,width,height,img);
	
	self.hp = hp;
	self.hpMax = hp;
	self.atkSpd = atkSpd;
	self.attackCounter = 0;
	self.aimAngle = 0;
	
	self.spriteAnimCounter = 0;
	
	self.pressingDown = false;
	self.pressingUp = false;
	self.pressingLeft = false;
	self.pressingRight = false;
	self.maxMoveSpd = 3;
	
	self.draw = () => {
		ctx.save();
		let x = self.x - player.x;
		let y = self.y - player.y;
		
		x += WIDTH/2;
		y += HEIGHT/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		const frameWidth = self.img.width/3;
		const frameHeight = self.img.height/4;
		
		let aimAngle = self.aimAngle;
		if(aimAngle < 0)
			aimAngle = 360 + aimAngle;
		
		let directionMod = 3;	//draw right
		if(aimAngle >= 45 && aimAngle < 135)	//down
			directionMod = 2;
		else if(aimAngle >= 135 && aimAngle < 225)	//left
			directionMod = 1;
		else if(aimAngle >= 225 && aimAngle < 315)	//up
			directionMod = 0;
		
		const walkingMod = Math.floor(self.spriteAnimCounter) % 3;//1,2
		
		ctx.drawImage(self.img,
			walkingMod*frameWidth,directionMod*frameHeight,frameWidth,frameHeight,
			x,y,self.width,self.height
		);
		
		ctx.restore();
	}
	
	self.updatePosition = () => {
		const leftBumper = {x:self.x - 40,y:self.y};
		const rightBumper = {x:self.x + 40,y:self.y};
		const upBumper = {x:self.x,y:self.y - 16};
		const downBumper = {x:self.x,y:self.y + 64};
		
		if(Maps.current.isPositionWall(rightBumper)){
			self.x -= 5;
		} else {
			if(self.pressingRight)
				self.x += self.maxMoveSpd;			
		}
		
		if(Maps.current.isPositionWall(leftBumper)){
			self.x += 5;
		} else {
			if(self.pressingLeft)
				self.x -= self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(downBumper)){
			self.y -= 5;
		} else {
			if(self.pressingDown)
				self.y += self.maxMoveSpd;
		}
		if(Maps.current.isPositionWall(upBumper)){
			self.y += 5;
		} else {
			if(self.pressingUp)
				self.y -= self.maxMoveSpd;
		}
		
		//ispositionvalid
		if(self.x < self.width/2)
			self.x = self.width/2;
		if(self.x > Maps.current.width-self.width/2)
			self.x = Maps.current.width - self.width/2;
		if(self.y < self.height/2)
			self.y = self.height/2;
		if(self.y > Maps.current.height - self.height/2)
			self.y = Maps.current.height - self.height/2;

	}
	
	const super_update = self.update;
	self.update = () => {
		super_update();
		self.attackCounter += self.atkSpd;
		if(self.hp <= 0)
			self.onDeath();
	}
	self.onDeath = () => {};
	
	self.performAttack = () => {
		if(self.attackCounter > 25){	//every 1 sec
			self.attackCounter = 0;
			Bullet.generate(self);
		}
	}
	
	self.performSpecialAttack = () => {
		if(self.attackCounter > 50){	//every 1 sec
			self.attackCounter = 0;
			/*
			for(var i = 0 ; i < 360; i++){
				Bullet.generate(self,i);
			}
			*/
			Bullet.generate(self,self.aimAngle - 5);
			Bullet.generate(self,self.aimAngle);
			Bullet.generate(self,self.aimAngle + 5);
		}
	}

	
	return self;
}

//#####

Enemy = (id, x, y, width, height, img, hp, atkSpd) => {
	const self = Actor('enemy',id,x,y,width,height,img,hp,atkSpd);
	Enemy.list[id] = self;
	
	self.toRemove = false;
	
	const super_update = self.update; 
	self.update = () => {
		super_update();
		self.spriteAnimCounter += 0.2;
		self.updateAim();
		self.updateKeyPress();
		self.performAttack();
	}
	self.updateAim = () => {
		const diffX = player.x - self.x;
		const diffY = player.y - self.y;
		
		self.aimAngle = Math.atan2(diffY,diffX) / Math.PI * 180
	}
	self.updateKeyPress = () => {
		const diffX = player.x - self.x;
		const diffY = player.y - self.y;

		self.pressingRight = diffX > 3;
		self.pressingLeft = diffX < -3;
		self.pressingDown = diffY > 3;
		self.pressingUp = diffY < -3;
	}
	
	
	const super_draw = self.draw; 
	self.draw = () => {
		super_draw();
		const x = self.x - player.x + WIDTH/2;
		const y = self.y - player.y + HEIGHT/2 - self.height/2 - 20;
		
		ctx.save();
		ctx.fillStyle = 'red';
		let width = 100*self.hp/self.hpMax;
		if(width < 0)
			width = 0;
		ctx.fillRect(x-50,y,width,10);
		
		ctx.strokeStyle = 'black';
		ctx.strokeRect(x-50,y,100,10);
		
		ctx.restore();
	
	}
	
	self.onDeath = () => {
		self.toRemove = true;
	}
	
}

Enemy.list = {};

Enemy.update = () => {
	if(frameCount % 100 === 0)	//every 4 sec
		Enemy.randomlyGenerate();
	for(var key in Enemy.list){
		Enemy.list[key].update();
	}
	for(var key in Enemy.list){
		if(Enemy.list[key].toRemove)
			delete Enemy.list[key];
	}
}

Enemy.randomlyGenerate = () => {
	//Math.random() returns a number between 0 and 1
	const x = Math.random()*Maps.current.width;
	const y = Math.random()*Maps.current.height;
	const height = 64*1.5;
	const width = 64*1.5;
	const id = Math.random();
	if(Math.random() < 0.5)
		Enemy(id,x,y,width,height,Img.bat,2,1);
	else
		Enemy(id,x,y,width,height,Img.bee,1,3);
}

//#####
Upgrade = (id, x, y, width, height, category, img) => {
	const self = Entity('upgrade',id,x,y,width,height,img);
	
	self.category = category;
	Upgrade.list[id] = self;
}

Upgrade.list = {};

Upgrade.update = () => {
	if(frameCount % 75 === 0)	//every 3 sec
		Upgrade.randomlyGenerate();
	for(const key in Upgrade.list){
		Upgrade.list[key].update();
		const isColliding = player.testCollision(Upgrade.list[key]);
		if(isColliding){
			if(Upgrade.list[key].category === 'score')
				score += 1000;
			if(Upgrade.list[key].category === 'atkSpd')
				player.atkSpd += 3;
			delete Upgrade.list[key];
		}
	}
}	

Upgrade.randomlyGenerate = () => {
	//Math.random() returns a number between 0 and 1
	const x = Math.random()*Maps.current.width;
	const y = Math.random()*Maps.current.height;
	const height = 32;
	const width = 32;
	const id = Math.random();
	
	if(Math.random()<0.5){
		var category = 'score';
		var img = Img.upgrade1;
	} else {
		var category = 'atkSpd';
		var img = Img.upgrade2;
	}
	
	Upgrade(id,x,y,width,height,category,img);
}

//#####
Bullet = (id, x, y, spdX, spdY, width, height, combatType) => {
	const self = Entity('bullet',id,x,y,width,height,Img.bullet);
	
	self.timer = 0;
	self.combatType = combatType;
	self.spdX = spdX;
	self.spdY = spdY
	self.toRemove = false;
	
	const super_update = self.update;
	self.update = () => {
		super_update();
		const toRemove = false;
		self.timer++;
		if(self.timer > 75)
			self.toRemove = true;
		
		
		if(self.combatType === 'player'){	//bullet was shot by player
			for(const key2 in Enemy.list){
				if(self.testCollision(Enemy.list[key2])){
					self.toRemove = true;
					Enemy.list[key2].hp -= 1;
				}				
			}
		} else if(self.combatType === 'enemy'){
			if(self.testCollision(player)){
				self.toRemove = true;
				player.hp -= 1;
			}
		}	
		if(Maps.current.isPositionWall(self)){
			self.toRemove = true;
		}
		
	}
	
	self.updatePosition = () => {
		self.x += self.spdX;
		self.y += self.spdY;
				
		if(self.x < 0 || self.x > Maps.current.width){
			self.spdX = -self.spdX;
		}
		if(self.y < 0 || self.y > Maps.current.height){
			self.spdY = -self.spdY;
		}
	}
	
	
	Bullet.list[id] = self;
}

Bullet.list = {};

Bullet.update = () => {
	for(const key in Bullet.list){
		const b = Bullet.list[key];
		b.update();
		
		if(b.toRemove){
			delete Bullet.list[key];
		}
	}
}

Bullet.generate = (actor, aimOverwrite) => {
	//Math.random() returns a number between 0 and 1
	const x = actor.x;
	const y = actor.y;
	const height = 24;
	const width = 24;
	const id = Math.random();
	
	let angle;
	if(aimOverwrite !== undefined)
		angle = aimOverwrite;
	else angle = actor.aimAngle;
	
	const spdX = Math.cos(angle/180*Math.PI)*5;
	const spdY = Math.sin(angle/180*Math.PI)*5;
	Bullet(id,x,y,spdX,spdY,width,height,actor.type);
}

