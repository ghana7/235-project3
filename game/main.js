//Create app and set scale settings for pixel graphics
const app = new PIXI.Application(window.innerWidth, window.innerHeight);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//define field values
const CROP_WIDTH = 72;
const CROP_HEIGHT = 96;
const CROP_MARGIN = 4;
let field;
let cropLocations = [];

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
    f.addChild(fieldBackground);

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

    app.stage.addChild(field);

    document.body.appendChild(app.view);

    app.ticker.add(gameLoop);
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

    growCrops(deltaTime);
}