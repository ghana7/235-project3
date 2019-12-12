class InventorySpace extends PIXI.Container {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

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
            this.addChild(item);
        }
    }

    removeItem() {
        this.removeChild(this.item);
        this.item = null;
    }
}

class InventoryItem extends PIXI.Sprite {
    constructor(texture, x, y, width, height) {
        super(texture);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    sellPrice() {
        return 0;
    }
}

class Crop extends InventoryItem {
    constructor(plantType, x, y, width, height) {
        super(plantTextures[plantType], x, y, width, height);
        this.plantData = plantDict[plantType];
        this.itemType = "crop";
        this.isSellable = true;
    }

    sellPrice() {
        return this.plantData.value;
    }
}

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