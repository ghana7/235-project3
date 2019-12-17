class Inventory extends PIXI.Container {
    constructor(x, y, spacesX, spacesY, spaceWidth, spaceHeight, margin, backgroundColor) {
        super();
        this.x = x;
        this.y = y;
        this.width = spacesX * spaceWidth + (spacesX + 1) * margin;
        this.height = spacesY * spaceHeight + (spacesY + 1) * margin;
        this.xOffset = spaceWidth + margin;
        this.yOffset = spaceHeight + margin;

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = backgroundColor;
        this.background.width = spacesX * spaceWidth + (spacesX + 1) * margin;
        this.background.height = spacesY * spaceHeight + (spacesY + 1) * margin;

        this.buttonMode = true;
        this.interactive = true;

        this.addChild(this.background);

        this.on("pointerup", this.clickEvent);
        this.spaces = [];

        for (let y = 0; y < spacesY; y++) {
            this.spaces.push([]);
            for (let x = 0; x < spacesX; x++) {
                let s = new InventorySpace(x * spaceWidth + (x + 1) * margin,
                    y * spaceHeight + (y + 1) * margin,
                    spaceWidth,
                    spaceHeight);
                this.spaces[y].push(s);
                this.addChild(s);
            }
        }
    }

    getClickLocation(mouseX, mouseY) {
        let mouseGridX = Math.floor((mouseX - this.x) / (this.xOffset));
        let mouseGridY = Math.floor((mouseY - this.y) / (this.yOffset));
        return this.spaces[mouseGridY][mouseGridX];
    }

    clickEvent() {
    }
}

class GeneralInventory extends Inventory {
    clickEvent() {
        let clickedSpace = this.getClickLocation(mousePosition.x, mousePosition.y);

        if (heldItem != null) {
            if (clickedSpace.item == null) {

                clickedSpace.addItem(heldItem);
                heldItem = null;
            }

        }
        else {
            //if not holding item and clicked space has an item, pick that item up
            if (clickedSpace.item != null) {
                heldItem = clickedSpace.item;
                clickedSpace.removeItem();
            }
        }
    }
}


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
        if (this.item == null) {
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
        this.plantType = plantType;
        this.plantData = plantDict[plantType];
        this.itemType = "seed";
        this.isSellable = true;
    }

    sellPrice() {
        return this.plantData.seedPrice;
    }
}

class Fertilizer extends InventoryItem {
    constructor(x, y, width, height, speedModifier) {
        super(PIXI.loader.resources["images/fertilizer.png"].texture, x, y, width, height);
        this.speedModifier = speedModifier;
        this.itemType = "fertilizer";
        this.isSellable = true;
    }

    sellPrice() {
        return 15;
    }
}