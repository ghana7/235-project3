
//a class to store information that is the same for every plant
//of a given type (e.g. all corn takes the same amount of time to grow)
class PlantData {
    constructor(growthSpeed, maxGrowth, harvestAmount, value) {
        //how much the plant grows per second (so far it's always 1 because
        //it's easier to change maxGrowth, this might be removed)
        this.growthSpeed = growthSpeed;

        //how much growth the plant takes to be harvestable
        this.maxGrowth = maxGrowth;

        //how many of the plant you should get when you harvest it
        //
        //don't have to implement this right now, but it would be cool to have
        this.harvestAmount = harvestAmount;

        //the value of each individual plant when it is harvested and sold
        this.value = value;
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

        this.type = type;
        this.plant = null;

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
            this.plant = new Plant(type, 4, 4, 64);
            this.addChild(this.plant);

            this.growthBar = new GrowthBar(4, this.width, this.width - 8, this.height - this.width - 4, this.plant, 0xFF0000);
            this.addChild(this.growthBar);

            this.growthBar.redrawBar();
        }

        //if the cropLocation was initialized with a plant type,
        //put one in it
        //
        //i don't think this gets used anymore, but i'm leaving it for now
        if (type) {
            this.addPlant(type);
        }
    }

    //grows the plant and updates the growth bar
    grow(deltaTime) {
        this.plant.grow(deltaTime);
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
        this.plantData = plantDict[plantType];
        this.currentGrowth = 0;
    }

    //grows the plant
    //delta Time is in seconds
    grow(deltaTime) {
        this.currentGrowth += deltaTime * this.plantData.growthSpeed;
        if(this.currentGrowth > this.plantData.maxGrowth) {
            this.currentGrowth = this.plantData.maxGrowth;
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
    constructor(x, y, width, height, plant, color) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.plant = plant;

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
        this.frontBar.tint = color;

        this.maxWidth = width - 8;

        this.addChild(this.backBar);
        this.addChild(this.frontBar);
    }

    //redraws the bar to be a certain percent filled
    //again, percent goes from 0 to 1
    redrawBar(fraction) {
        this.frontBar.width = this.maxWidth * fraction;
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
    "corn": new PlantData(1, 10, 5, 5),
    "banana": new PlantData(1, 20, 6, 10),
    "lettuce": new PlantData(1, 5, 1, 15),
    "potato": new PlantData(1, 15, 10, 5),
    "strawberry": new PlantData(1, 25, 10, 10)
};