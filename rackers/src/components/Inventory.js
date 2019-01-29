Inventory = () => {
    const self = {
        items:[] //{id:"itemId",amount:1}
    };
    self.addItem = (id, amount) => {
		for(let i = 0 ; i < self.items.length; i++){
			if(self.items[i].id === id){
				self.items[i].amount += amount;
				self.refreshRender();
				return;
			}
		}
		self.items.push({id,amount});
		self.refreshRender();
    }
    self.removeItem = (id, amount) => {
		for(let i = 0 ; i < self.items.length; i++){
			if(self.items[i].id === id){
				self.items[i].amount -= amount;
				if(self.items[i].amount <= 0)
					self.items.splice(i,1);
				self.refreshRender();
				return;
			}
		}    
    }
    self.hasItem = (id, amount) => {
		for(let i = 0 ; i < self.items.length; i++){
			if(self.items[i].id === id){
				return self.items[i].amount >= amount;
			}
		}  
		return false;
    }
	self.refreshRender = () => {
		let str = "";
		for(let i = 0 ; i < self.items.length; i++){
			let item = Item.List[self.items[i].id];
			let onclick = `Item.List['${item.id}'].event()`;
			str += `<button onclick="${onclick}">${item.name} x${self.items[i].amount}</button><br>`;
		}

		document.getElementById("inventory").innerHTML = str;
	}


	return self;
}


Item = (id, name, event) => {
	const self = {
		id,
		name,
		event,
	};
	Item.List[self.id] = self;
	return self;
}
Item.List = {};

Item("potion","Potion",() => {
	player.hp = 10;
	playerInventory.removeItem("potion",1);
});

Item("enemy","Spawn Enemy",() => {
	Enemy.randomlyGenerate();
});





