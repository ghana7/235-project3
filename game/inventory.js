//A single space in the inventory, holds a single item
//Very similar structurally to cropLocations
class InventorySpace extends PIXI.Container {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.itemSize = width - 8;

        //background rectangle - light gray
        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = 0xDDDDDD;
        this.background.width = width;
        this.background.height = height;
        this.addChild(this.background);

        this.item = null;
    }

    addItem(item) {
        if(this.item == null) {
            this.item = item;
            this.item.width = this.itemSize;
            this.item.height = this.itemSize;
            this.item.x = 4;
            this.item.y = 4;
            this.addChild(item);
        }
    }

    removeItem() {
        this.removeChild(this.item);
        this.item = null;
    }
}

//A base class for any item that can be put in an inventory
//Do not instantiate this, extend it if you have a new category
//of item that needs to be made
class InventoryItem extends PIXI.Sprite {
    constructor(texture, x, y, width, height) {
        super(texture);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    //Change this in children to denote the price
    //Also update isSellable
    sellPrice() {
        return 0;
    }
}

//A harvested crop that can be placed in the inventory or sold
class Crop extends InventoryItem {
    constructor(plantType, x, y, width, height) {
        super(plantTextures[plantType], x, y, width, height);
        this.plantData = plantDict[plantType];
        this.itemType = "crop";
        this.isSellable = true;
        this.plantType = plantType;
    }

    sellPrice() {
        return this.plantData.value;
    }
}

//A single unit of seeds, can be planted on a cropLocation in the field
//or stored in the inventory
class Seeds extends InventoryItem {
    constructor(plantType, x, y, width, height) {
        super(PIXI.loader.resources["images/seedbag.png"].texture, x, y, width, height);
        this.tint = mixHexColors(plantDict[plantType].color, 0xCCCCCC, 0.5);
        this.x = x; 
        this.y = y;
        this.width = width;
        this.height = height;
        this.plantType = plantType;
        this.plantData = plantDict[plantType];
        this.itemType = "seed";
        this.isSellable = true;
    }

    sellPrice() {
        return this.plantData.seedPrice;
    }
}