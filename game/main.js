//Create app and set scale settings for pixel graphics
const app = new PIXI.Application(window.innerWidth, window.innerHeight);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//define field values
const PLANT_WIDTH = 72;
const PLANT_HEIGHT = 96;
const PLANT_MARGIN = 4;

const FIELD_X = 64;
const FIELD_Y = 64;
const FIELD_WIDTH = 5;
const FIELD_HEIGHT = 5;

let field;
let cropLocations = [];

const INVSPACE_WIDTH = 72;
const INVSPACE_HEIGHT = 72;
const INVSPACE_MARGIN = 4;

const INVENTORY_X = 640;
const INVENTORY_Y = 64;
const INVENTORY_WIDTH = 5;
const INVENTORY_HEIGHT = 5;

let inventory;
let inventorySpaces = [];
let money = 50;
let moneyDisplay;
//mouse position
let mousePosition = app.renderer.plugins.interaction.mouse.global;

let cursor = new PIXI.Sprite(PIXI.Texture.WHITE);
cursor.width = 16;
cursor.height = 16;
cursor.anchor.set(0.5);



//what item is currently being held by the player
let heldItem;

let currentAction;

//creates the field, where all crops are located on the screen
function createField() {
    let f = new PIXI.Container();
    f.x = FIELD_X;
    f.y = FIELD_Y;
    f.width = FIELD_WIDTH * PLANT_WIDTH + (FIELD_WIDTH + 1) * PLANT_MARGIN;
    f.height = FIELD_HEIGHT * PLANT_HEIGHT + (FIELD_HEIGHT + 1) * PLANT_MARGIN;

    //create light brown background for field
    let fieldBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
    fieldBackground.tint = 0x654321;
    fieldBackground.width = FIELD_WIDTH * PLANT_WIDTH + (FIELD_WIDTH + 1) * PLANT_MARGIN;
    fieldBackground.height = FIELD_HEIGHT * PLANT_HEIGHT + (FIELD_HEIGHT + 1) * PLANT_MARGIN;

    //turns the carden into a button essentially
    fieldBackground.buttonMode = true;
    fieldBackground.interactive = true;

    f.addChild(fieldBackground);

    //when field is clicked on
    fieldBackground.on("pointerup", fieldClicked);

    //create grid of crop locations
    for (let y = 0; y < FIELD_HEIGHT; y++) {
        cropLocations.push([]);
        for (let x = 0; x < FIELD_WIDTH; x++) {
            let c = new CropLocation("", x * PLANT_WIDTH + (x + 1) * PLANT_MARGIN,
                y * PLANT_HEIGHT + (y + 1) * PLANT_MARGIN,
                PLANT_WIDTH, PLANT_HEIGHT);
            cropLocations[y].push(c);
            f.addChild(c);
        }
    }

    field = f;
}

function createInventory() {
    let i = new PIXI.Container();
    i.x = INVENTORY_X;
    i.y = INVENTORY_Y;
    i.width = INVENTORY_WIDTH * INVSPACE_WIDTH + (INVENTORY_WIDTH + 1) * INVSPACE_MARGIN;
    i.height = INVENTORY_HEIGHT * INVSPACE_HEIGHT + (INVENTORY_HEIGHT + 1) * INVSPACE_MARGIN;

    let inventoryBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
    inventoryBackground.tint = 0x444444;
    inventoryBackground.width = INVENTORY_WIDTH * INVSPACE_WIDTH + (INVENTORY_WIDTH + 1) * INVSPACE_MARGIN;
    inventoryBackground.height = INVENTORY_HEIGHT * INVSPACE_HEIGHT + (INVENTORY_HEIGHT + 1) * INVSPACE_MARGIN;

    inventoryBackground.buttonMode = true;
    inventoryBackground.interactive = true;

    i.addChild(inventoryBackground);

    inventoryBackground.on("pointerup", inventoryClicked);

    //create grid of inventory spaces
    for (let y = 0; y < INVENTORY_HEIGHT; y++) {
        inventorySpaces.push([]);
        for (let x = 0; x < INVENTORY_WIDTH; x++) {
            let invSpace = new InventorySpace(x * INVSPACE_WIDTH + (x + 1) * INVSPACE_MARGIN,
                y * INVSPACE_HEIGHT + (y + 1) * INVSPACE_MARGIN,
                INVSPACE_WIDTH, INVSPACE_HEIGHT);
            inventorySpaces[y].push(invSpace);
            i.addChild(invSpace);
        }
    }

    inventory = i;
}
//Make array of paths to images for all plants in plant dictionary
let imgSources = [];
imgSources.push("images/seeds.png");
imgSources.push("images/seedbag.png");
imgSources.push("images/basketEmpty.png");
imgSources.push("images/basketFull.png");
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
    createField();
    createInventory();
    loadPlantSelection();
    createMoneyDisplay();
    createShippingBin();

    app.stage.addChild(field);
    app.stage.addChild(inventory);

    document.body.appendChild(app.view);

    app.ticker.add(gameLoop);
    app.stage.sortDirty = true;
}

//Grow all crops
function growCrops(deltaTime) {
    for (let row of cropLocations) {
        for (let crop of row) {
            if (crop.plant) {

                crop.grow(deltaTime);
            }
        }
    }
}

function gameLoop() {
    //deltaTime code from circle blast
    let deltaTime = 1 / app.ticker.FPS;
    if (deltaTime > 1 / 12) deltaTime = 1 / 12;

    manageCursor();
    growCrops(deltaTime);
}

//loads plant selection
function loadPlantSelection() {
    //create container for plant selection
    let container = new PIXI.Container();
    app.stage.addChild(container);
    //location of container
    container.x = 500;
    container.y = 50;

    let topOffset = 0;
    for (let plant in plantDict) {
        let seedbag = new StoreSeedBag(0, topOffset, 128, 64, plant);

        container.addChild(seedbag);
        topOffset += 96;
    }
}

function createMoneyDisplay() {
    moneyDisplay = new PIXI.Text("Balance: $" + money, {
        fontFamily: 'Arial',
        fontSize: 64,
        fill: 0xFFFFFF,
        align: "left"
    });
    moneyDisplay.x = FIELD_X + 16;
    moneyDisplay.y = FIELD_Y + (PLANT_HEIGHT + PLANT_MARGIN) * 5 + 20;
    app.stage.addChild(moneyDisplay);
}

function createShippingBin() {
    shippingBin = new PIXI.Sprite(PIXI.loader.resources["images/basketEmpty.png"].texture);
    shippingBin.x = INVENTORY_X;
    shippingBin.y = INVENTORY_Y + inventory.height + 32;
    shippingBin.width = 128;
    shippingBin.height = 128;
    shippingBin.buttonMode = true;
    shippingBin.interactive = true;
    shippingBin.on("pointerup", shippingBinClicked);
    app.stage.addChild(shippingBin);
}

//behavior for when the seedBags in the store are clicked
function seedbagClicked(e) {
    let plantType = e.target.plantType;
    //if the player has enough money to buy the seeds, put them in hand
    //and take the money from the player
    if (money >= plantDict[plantType].seedPrice) {

        heldItem = new Seeds(plantType, 0, 0, 64, 64);
        changeMoney(-plantDict[plantType].seedPrice);
    }
}

//update the display of the cursor based on the held item
function manageCursor() {
    app.stage.removeChild(cursor);
    cursor.x = mousePosition.x;
    cursor.y = mousePosition.y;
    if(heldItem) {
        if (heldItem.itemType == "crop" || heldItem.itemType == "seed") {
            cursor.texture = heldItem.texture;
        } else {
            cursor.texture = PIXI.Texture.WHITE;
        }
    } else {
        cursor.texture = PIXI.Texture.EMPTY;
    }
    
    app.stage.addChild(cursor);
}

//behavior for when field is clicked
function fieldClicked() {
    let clickedLocation = selectedCropLocation();
    //if holding a seed and clicked space is empty, plant it
    if(heldItem != null) {
        if (heldItem.itemType == "seed") {
            if (clickedLocation.plant == null) {
                clickedLocation.addPlant(heldItem.plantType);
                heldItem = null;
            }
        }
    } else {
        //if holding nothing, and clicked space is a fully grown plant, pick it up
        if (clickedLocation.plant) {
            if (clickedLocation.plant.growthPercent() >= 0.99) {
                heldItem = new Crop(clickedLocation.plant.plantType, 0, 0, 64, 64);
            
                clickedLocation.removePlant();
            }
        }
    }
}

//behavior for when the inventory is clicked
function inventoryClicked() {
    let clickedInvSpace = selectedInventorySpaceLocation();
    //if holding item and clicked space is empty, put it down
    if(heldItem != null) {
        if(clickedInvSpace.item == null) {

            clickedInvSpace.addItem(heldItem);
            heldItem = null;
        }
    } else {
        //if not holding item and clicked space has an item, pick that item up
        if(clickedInvSpace.item != null) {
            heldItem = clickedInvSpace.item;
            clickedInvSpace.removeItem();
        }
    }

}

//behavior for when the shipping bin is clicked
function shippingBinClicked() {
    //if holding an item and it is sellable, sell it
    if(heldItem != null) {
        if(heldItem.isSellable) {
            changeMoney(heldItem.sellPrice());
            
            heldItem = null;
        }
    }
}

//Gets the crop location the mouse is currently over
function selectedCropLocation() {
    let mouseGridX = Math.floor((mousePosition.x - field.x) / (PLANT_MARGIN + PLANT_WIDTH));
    let mouseGridY = Math.floor((mousePosition.y - field.y) / (PLANT_MARGIN + PLANT_HEIGHT));

    return cropLocations[mouseGridY][mouseGridX];
}

//Gets the inventory space the mouse is currently over
function selectedInventorySpaceLocation() {
    let mouseGridX = Math.floor((mousePosition.x - inventory.x) / (INVSPACE_MARGIN + INVSPACE_WIDTH));
    let mouseGridY = Math.floor((mousePosition.y - inventory.y) / (INVSPACE_MARGIN + INVSPACE_HEIGHT));

    return inventorySpaces[mouseGridY][mouseGridX];
}

//adds or removes money, then updates the display
function changeMoney(amount) {
    money += amount;
    moneyDisplay.text = "Balance: $" + money;
}