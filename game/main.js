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
let shop;

let money = 50;
let moneyDisplay;

let shippingBin;
const SHIPPINGBIN_SIZE = 128;
const SHIPPINGBIN_X = INVENTORY_X;
const SHIPPINGBIN_Y = INVENTORY_Y + INVENTORY_HEIGHT * (INVSPACE_HEIGHT + INVSPACE_MARGIN) + INVSPACE_MARGIN + 64;

let seedMaker;
const SEEDMAKER_SIZE = 64;
const SEEDMAKER_MARGIN = 4;
const SEEDMAKER_X = SHIPPINGBIN_X + SHIPPINGBIN_SIZE + 32;
const SEEDMAKER_Y = SHIPPINGBIN_Y;
let seedMakerInput;
let seedMakerOutput;

//mouse position
let mousePosition = app.renderer.plugins.interaction.mouse.global;

let cursor = new PIXI.Sprite(PIXI.Texture.WHITE);
cursor.width = 16;
cursor.height = 16;
cursor.anchor.set(0.5);


//what item is currently being held by the player
let heldItem;

//Make array of paths to images for all plants in plant dictionary
let imgSources = [];
imgSources.push("images/seeds.png");
imgSources.push("images/seedbag.png");
imgSources.push("images/basketEmpty.png");
imgSources.push("images/basketFull.png");
imgSources.push("images/seedMaker.png");
imgSources.push("images/fertilizer.png");
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
    inventory = new GeneralInventory(INVENTORY_X, INVENTORY_Y, INVENTORY_WIDTH, INVENTORY_HEIGHT,
                                     INVSPACE_WIDTH, INVSPACE_HEIGHT, INVSPACE_MARGIN,
                                     0x444444);
    createShop();
    createMoneyDisplay();
    createShippingBin();
    createSeedMaker();

    app.stage.addChild(field);
    app.stage.addChild(inventory);

    document.body.appendChild(app.view);

    app.ticker.add(gameLoop);
    app.stage.sortDirty = true;
}



function gameLoop() {
    //deltaTime code from circle blast
    let deltaTime = 1 / app.ticker.FPS;
    if (deltaTime > 1 / 12) deltaTime = 1 / 12;

    manageCursor();
    growCrops(deltaTime);
}



//update the display of the cursor based on the held item
function manageCursor() {
    app.stage.removeChild(cursor);
    cursor.x = mousePosition.x;
    cursor.y = mousePosition.y;
    if(heldItem) {
        if (heldItem.itemType == "crop" || heldItem.itemType == "seed" || heldItem.itemType == "fertilizer") {
            cursor.texture = heldItem.texture;
        } else {
            cursor.texture = PIXI.Texture.WHITE;
        }
    } 
    else {
        cursor.texture = PIXI.Texture.EMPTY;
    }
    
    app.stage.addChild(cursor);
}



