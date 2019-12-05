//Create app and set scale settings for pixel graphics
const app = new PIXI.Application(window.innerWidth, window.innerHeight);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//define field values
const CROP_WIDTH = 72;
const CROP_HEIGHT = 96;
const CROP_MARGIN = 4;
let field;
let cropLocations = [];

let money = 50;
let moneyDisplay;
//mouse position
let mousePosition = app.renderer.plugins.interaction.mouse.global;
let cursor = new PIXI.Sprite(PIXI.Texture.WHITE);
cursor.width = 16;
cursor.height = 16;
cursor.anchor.set(0.5);



//what plant was chosen
let chosenPlant;

let currentAction;

//creates the field, where all crops are located on the screen
function createField(width, height) {
    let f = new PIXI.Container();
    f.width = width * CROP_WIDTH + (width + 1) * CROP_MARGIN;
    f.height = height * CROP_HEIGHT + (height + 1) * CROP_MARGIN;

    //create light brown background for field
    let fieldBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
    fieldBackground.tint = 0x654321;
    fieldBackground.width = width * CROP_WIDTH + (width + 1) * CROP_MARGIN;
    fieldBackground.height = height * CROP_HEIGHT + (height + 1) * CROP_MARGIN;

    //turns the carden into a button essentially
    fieldBackground.buttonMode = true;
    fieldBackground.interactive = true;
    
    f.addChild(fieldBackground);

    //when field is clicked on
    fieldBackground.on("pointerup", fieldClicked);

    //create grid of crop locations
    for (let y = 0; y < height; y++) {
        cropLocations.push([]);
        for(let x = 0; x < width; x++) {
            let c = new CropLocation("", x * CROP_WIDTH + (x + 1) * CROP_MARGIN,
                                         y * CROP_HEIGHT + (y + 1) * CROP_MARGIN,
                                         CROP_WIDTH, CROP_HEIGHT);
            cropLocations[y].push(c);
            f.addChild(c);
        }
    }

    field = f;
}

//Make array of paths to images for all plants in plant dictionary
let imgSources = [];
imgSources.push("images/seeds.png");
imgSources.push("images/seedbag.png");
for (let plant in plantDict) {
    imgSources.push("images/" + plant + ".png");
}

//Load those images, then run setup
PIXI.loader.
    add(imgSources).
    on("progress", e => { console.log(`progress=${e.progress}`) }).
    load(setup);

function setup() {
    mapPlantTextures();
    createField(5,5);
    loadPlantSelection();
    createMoneyDisplay();

    app.stage.addChild(field);

    document.body.appendChild(app.view);

    app.ticker.add(gameLoop);
    app.stage.sortDirty = true;
}

//Grow all crops
function growCrops(deltaTime) {
    for(let row of cropLocations) {
        for(let crop of row) {
            if(crop.plant) {

                crop.grow(deltaTime);
            }
        }
    }
}

function gameLoop() {
    //deltaTime code from circle blast
    let deltaTime = 1/app.ticker.FPS;
    if(deltaTime > 1/12) deltaTime = 1/12;

    manageCursor();
    growCrops(deltaTime);
}

//loads plant selection
function loadPlantSelection()
{
    //create container for plant selection
    let container = new PIXI.Container();
    app.stage.addChild(container);
    //location of container
    container.x = 500;
    container.y = 50;

    let topOffset = 0;
    for(let plant in plantDict) {
        let seedbag = new SeedBag(0, topOffset, 128, 64, plant);

        container.addChild(seedbag);
        topOffset += 96;
    }
}

function createMoneyDisplay() {
    moneyDisplay = new PIXI.Text("Balance: $" + money,{
        fontFamily: 'Arial',
        fontSize: 64,
        fill: 0xFFFFFF,
        align: "left"
    });
    moneyDisplay.x = 16;
    moneyDisplay.y = (CROP_HEIGHT + CROP_MARGIN) * 5 + 20;
    app.stage.addChild(moneyDisplay);
}

function seedbagClicked(e) {
    let plantType = e.target.plantType;
    if(money >= plantDict[plantType].seedPrice) {

        chosenPlant = plantType;
        currentAction = "planting";
        changeMoney(-plantDict[plantType].seedPrice);
    }
}

function manageCursor() {
    app.stage.removeChild(cursor);
    cursor.x = mousePosition.x;
    cursor.y = mousePosition.y;
    if(currentAction == "planting") {
        cursor.texture = plantTextures[chosenPlant];
    } else {
        cursor.texture = PIXI.Texture.WHITE;
    }
    app.stage.addChild(cursor);
}

//runs when field is clicked on
//plants whatever veggie is currently chosen
//or remove plant
function fieldClicked() 
{
    let clickedLocation = selectedCropLocation();
    if(currentAction == "planting") {
        if(clickedLocation.plant == null) {
            clickedLocation.addPlant(chosenPlant);
            chosenPlant = "";
            currentAction = "";
        }
    } else {
        if(clickedLocation.plant) {
            if(clickedLocation.plant.growthPercent() >= 0.99) {
                changeMoney(clickedLocation.plant.plantData.value);
            }
        }
        clickedLocation.removePlant();
    }
}

function selectedCropLocation() {
    let mouseGridX = Math.floor(mousePosition.x / (CROP_MARGIN + CROP_WIDTH));
    let mouseGridY = Math.floor(mousePosition.y / (CROP_MARGIN + CROP_HEIGHT));

    return cropLocations[mouseGridY][mouseGridX];
}

function changeMoney(amount) {
    money += amount;
    moneyDisplay.text = "Balance: $" + money;
}