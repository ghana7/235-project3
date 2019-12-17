
//a class to store information that is the same for every plant
//of a given type (e.g. all corn takes the same amount of time to grow)
class PlantData {
    constructor(maxGrowth, harvestAmount, value, color, seedPrice, types, tier,
                name, description) {
        //how much growth the plant takes to be harvestable
        this.maxGrowth = maxGrowth;

        //how many of the plant you should get when you harvest it
        //
        //don't have to implement this right now, but it would be cool to have
        this.harvestAmount = harvestAmount;

        //the value of each individual plant when it is harvested and sold
        this.value = value;

        //a rgb color that is approximately the same as the plant itself,
        //for visual effects and tints and stuff
        this.color = color;

        //the price of this crop's seeds
        this.seedPrice = seedPrice;

        //the different plant types this plant is
        this.types = types;

        //the level of combination the plant is at
        //approximately a plant power level, but not exactly
        this.tier = tier;

        //the name of the plant
        this.name = name;

        //a short description of the plant
        this.description = description;
        Object.freeze(this);
    }
}

//a location where a plant grows
//contains the plant itself and a progress bar that shows
//the growth of the plant
class CropLocation extends PIXI.Container {
    constructor(type, x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.plant = null;
        this.growthSpeed = 1;

        //background rectangle - dark brown
        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = 0x432100;
        this.background.width = width;
        this.background.height = height;
        this.addChild(this.background);
        
        //removes a plant from the CropLocation
        //also hides the growth bar
        //
        // *** use this for harvesting crops
        this.removePlant = function() {
            this.removeChild(this.plant);
            this.plant = null;
            this.removeChild(this.growthBar);
            this.growthBar = null;
        }

        //adds a new plant to the CropLocation
        //type is the string name of the plant, all lowercase
        //
        // *** use this for planting crops
        this.addPlant = function(type) {
            this.removePlant();
            this.plant = new Plant(type, width/2, (height - 32) / 2, 64);
            this.addChild(this.plant);

            this.growthBar = new GrowthBar(4, this.width, this.width - 8, this.height - this.width - 4, this.plant, 0xFF0000, 0x00FF00);
            this.addChild(this.growthBar);

            this.growthBar.redrawBar();
        }


    }

    //grows the plant and updates the growth bar
    grow(deltaTime) {
        this.plant.grow(deltaTime * this.growthSpeed);
        this.growthBar.redrawBar(this.plant.growthPercent());
    }
}

//a plant itself
//stores information specific to the plant, such as position,
//size, and how much it has grown
//
//references plantDict for all general data that would be in PlantData
class Plant extends PIXI.Sprite {
    constructor(plantType, x, y, size) {
        super(plantTextures[plantType]);
        this.plantType = plantType;
        this.x = x;
        this.y = y;
        this.width = size;
        this.height = size;
        this.maxSize = size;
        this.anchor.set(0.5);
        this.plantData = plantDict[plantType];
        this.currentGrowth = 0;
        this.growthSpeed = this.plantData.growthSpeed;
    }

    //grows the plant
    //delta Time is in seconds
    grow(deltaTime) {
        this.currentGrowth += deltaTime;
        if(this.currentGrowth > this.plantData.maxGrowth) {
            this.currentGrowth = this.plantData.maxGrowth;
        }
        if(this.growthPercent() < 0.2) {
            this.texture = PIXI.loader.resources["images/seeds.png"].texture;
            this.width = this.maxSize;
            this.height = this.maxSize;
        } else {
            this.texture = plantTextures[this.plantType];
            this.width = this.maxSize * this.growthPercent();
            this.height = this.maxSize * this.growthPercent();
        }
    }

    //returns how far the plant is on its overall growth
    //from 0 to 1
    growthPercent() {
        return this.currentGrowth / this.plantData.maxGrowth;
    }
}


//the bar that visually shows how much the plant has grown
//pretty much just rectangles
//eventually i'll add a number and some fancy gradients
class GrowthBar extends PIXI.Container {
    constructor(x, y, width, height, plant, color1, color2) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.plant = plant;
        this.rgb1 = hexToRgb(color1);
        this.rgb2 = hexToRgb(color2);

        this.backBar = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.backBar.x = 0;
        this.backBar.y = 0;
        this.backBar.width = width;
        this.backBar.height = height;
        this.backBar.tint = 0x000000;

        this.frontBar = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.frontBar.x = 4;
        this.frontBar.y = 4;
        this.frontBar.width = width - 8;
        this.frontBar.height = height - 8;
        this.frontBar.tint = color1;

        this.text = new PIXI.Text("",{
            fontFamily: 'Arial',
            fontSize: height - 8,
            fill: 0xFFFFFF,
            align: "center"
        });
        this.text.anchor.set(0.5);
        this.text.x = width/2;
        this.text.y = height/2;

        this.maxWidth = width - 8;

        this.addChild(this.backBar);
        this.addChild(this.frontBar);
        this.addChild(this.text);
    }

    //redraws the bar to be a certain percent filled
    //again, percent goes from 0 to 1
    redrawBar(fraction) {
        this.frontBar.width = this.maxWidth * fraction;
        this.frontBar.tint = rgbToHex(mixColors(this.rgb1, this.rgb2, fraction))
        this.text.text = "" + Math.round(fraction * 100) + "%";
    }
}


//a helper function to map the loaded plant textures
//to their name
function mapPlantTextures() {
    plantTextures = {};

    for (let plant in plantDict) {
        let texture = PIXI.loader.resources["images/" + plant + ".png"].texture;
        plantTextures[plant] = texture;
    }
}

//an object mapping a string containing the plant name
//to the texture for it
let plantTextures;

//an object mapping a string containing the plant name
//to all information about it
//see PlantData for what the numbers mean
let plantDict = {
    "melon": new PlantData(60, 1, 150, 0xCCFF66, 25, ["tropical", "gourd"], 2, "Melon", "a melon"),
    "banana": new PlantData(20, 6, 10, 0xFFFF00, 10, ["tropical"], 1, "Banana", "a banana"),
    "grapes": new PlantData(20, 4, 15, 0x8800BB, 10, ["tropical", "berry"], 2, "Grapes", "a grapes"),
    "strawberry": new PlantData(25, 10, 10, 0xFF2222, 25, ["berry"], 1, "Strawberry", "a strawberry"),
    "garlic": new PlantData(10, 10, 5, 0xFFFFBB, 5, ["spice"], 1, "Garlic", "a garlic"),
    "chilipepper": new PlantData(15, 15, 15, 0xFF1111, 5, ["spice", "stalk", "gourd"], 3, "Chili Pepper", "a chili pepper"),
    "scallion": new PlantData(15, 5, 25, 0x88FF88, 10, ["leafy", "spice"], 2, "Scallion", "a scallion"),
    "lettuce": new PlantData(5, 1, 15, 0x55FF55, 15, ["leafy"], 1, "Lettuce", "a lettuce"),
    "onion": new PlantData(25, 3, 30, 0x889966, 10, ["leafy", "spice", "root"], 3, "Onion", "a onion"),
    "potato": new PlantData(15, 10, 5, 0x8765432, 20, ["root"], 1, "Potato", "a potato"),
    "greenbean": new PlantData(10, 20, 5, 0x66FF66, 5, ["root", "grain", "leafy"], 3, "Green Bean", "a green bean"),
    "broccoli": new PlantData(30, 5, 25, 0x337733, 10, ["grain", "leafy"], 2, "Broccoli", "a broccoli"),
    "wheat": new PlantData(60, 10, 20, 0xCCCC00, 10, ["grain"], 1, "Wheat", "a wheat"),
    "corn": new PlantData(10, 5, 5, 0xCCCC00, 5, ["grain", "stalk"], 2, "Corn", "a corn"),
    "tomato": new PlantData(20, 10, 10, 0xFF5500, 10, ["stalk"], 1, "Tomato", "a tomato"),
    "bellpepper": new PlantData(30, 5, 40, 0xFFFF00, 10, ["stalk", "gourd"], 2, "Bell Pepper", "a bell pepper"),
    "pumpkin": new PlantData(40, 1, 100, 0xFF7700, 10, ["gourd"], 1, "Pumpkin", "a pumpkin")
};