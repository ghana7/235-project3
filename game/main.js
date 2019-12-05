//Create app and set scale settings for pixel graphics
const app = new PIXI.Application(window.innerWidth, window.innerHeight);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

//define field values
const CROP_WIDTH = 72;
const CROP_HEIGHT = 96;
const CROP_MARGIN = 4;
let field;
let cropLocations = [];

//mouse position
let mousePosition = app.renderer.plugins.interaction.mouse.global;

//VEGGIES
//corn stuff
let cornTexture = PIXI.Texture.from("images/corn.png");
let corn = new PIXI.Sprite(cornTexture);

let cornTextureMouse = PIXI.Texture.from("images/corn.png");
cornMouse = new PIXI.Sprite(cornTextureMouse);
//banana
let bananaTexture = PIXI.Texture.from("images/banana.png");
let banana = new PIXI.Sprite(bananaTexture);

let bananaTextureMouse = PIXI.Texture.from("images/banana.png");
bananaMouse = new PIXI.Sprite(bananaTextureMouse);
//lettuce
let lettuceTexture = PIXI.Texture.from("images/lettuce.png");
let lettuce = new PIXI.Sprite(lettuceTexture);

let lettuceTextureMouse = PIXI.Texture.from("images/lettuce.png");
lettuceMouse = new PIXI.Sprite(lettuceTextureMouse);
//potato
let potatoTexture = PIXI.Texture.from("images/potato.png");
let potato = new PIXI.Sprite(lettuceTexture);

let potatoTextureMouse = PIXI.Texture.from("images/potato.png");
potatoMouse = new PIXI.Sprite(potatoTextureMouse);

//strawberry
let strawberryTexture = PIXI.Texture.from("images/strawberry.png");
let strawberry = new PIXI.Sprite(strawberryTexture);

let strawberryTextureMouse = PIXI.Texture.from("images/strawberry.png");
strawberryMouse = new PIXI.Sprite(strawberryTextureMouse);

//what plant was chosen
let cornChosen = false;
let bananaChosen = false;
let lettuceChosen = false;
let potatoChosen = false;
let strawberryChosen = false;


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
    fieldBackground.on("pointerup", gardenClicked);

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
    loadPlantSelection();

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

    //if corn is chosen, corn image follows mouse
    if(cornChosen)
    {
        cornSelectionMouse();
    }
    //when corn is not chosen, the image following the mouse does not exist
    //when corn is chosen and then planted, the image following the mouse is removed from screen
    else if(cornChosen == false)
    {
        app.stage.removeChild(cornMouse);
    }
    
    if(bananaChosen)
    {
        bananaSelectionMouse();
    }
    else if(bananaChosen == false)
    {
        app.stage.removeChild(bananaMouse);
    }

    if(lettuceChosen)
    {
        lettuceSelectionMouse();
    }
    else if(lettuceChosen == false)
    {
        app.stage.removeChild(lettuceMouse);
    }

    if(potatoChosen)
    {
        potatoSelectionMouse();
    }
    else if(potatoChosen == false)
    {
        app.stage.removeChild(potatoMouse);
    }

    if(strawberryChosen)
    {
        strawberrySelectionMouse();
    }
    else if(strawberryChosen == false)
    {
        app.stage.removeChild(strawberryMouse);
    }

    growCrops(deltaTime);
}

//loads plant selection
function loadPlantSelection()
{
    let container = new PIXI.Container();
    app.stage.addChild(container);
    //location of container
    container.x = 500;
    container.y = 50;

    //CORN SELECTION

    //size of image
    corn.width = 50;
    corn.height = 50;

    container.addChild(corn);

    //BANANA SELECTION

    let bananaTexture = PIXI.Texture.from("images/banana.png");
    let banana = new PIXI.Sprite(bananaTexture);

    //size of image
    banana.width = 50;
    banana.height = 50;
    //location based in container
    banana.y = 100

    container.addChild(banana);

    //LETTUCE SELECTION

    let lettuceTexture = PIXI.Texture.from("images/lettuce.png");
    let lettuce = new PIXI.Sprite(lettuceTexture);

    lettuce.width = 50;
    lettuce.height = 50;
    lettuce.y = 200;

    container.addChild(lettuce);

    //POTATO SELECTION
    let potatoTexture = PIXI.Texture.from("images/potato.png");
    let potato = new PIXI.Sprite(potatoTexture);

    potato.width = 50;
    potato.height = 50;
    potato.y = 300;

    container.addChild(potato);

    //STRAWBERRY SELECTION
    let strawberryTexture = PIXI.Texture.from("images/strawberry.png");
    let strawberry = new PIXI.Sprite(strawberryTexture);

    strawberry.width = 50;
    strawberry.height = 50;
    strawberry.y = 400;

    container.addChild(strawberry);

    //SELECTING A PLANT
    corn.buttonMode = true;
    corn.interactive = true;
    corn.on("pointerup", cornSelectionClicked);
    banana.buttonMode = true;
    banana.interactive = true;
    banana.on("pointerup", bananaSelectionClicked);
    lettuce.buttonMode = true;
    lettuce.interactive = true;
    lettuce.on("pointerup", lettuceSelectionClicked);
    potato.buttonMode = true;
    potato.interactive = true;
    potato.on("pointerup", potatoSelectionClicked);
    strawberry.buttonMode = true;
    strawberry.interactive = true;
    strawberry.on("pointerup", strawberrySelectionClicked);

}

//When a plant selection is clicked on
function cornSelectionClicked()
{
    cornChosen = true;
    bananaChosen = false;
    lettuceChosen = false;
    potatoChosen = false;

    cornTextureMouse.width = 30;
    cornMouse.height = 30;

    app.stage.addChild(cornMouse);
}
function bananaSelectionClicked()
{
    bananaChosen = true;
    cornChosen = false;
    lettuceChosen = false;
    potatoChosen = false;

    bananaTextureMouse.width = 30;
    bananaMouse.height = 30;

    app.stage.addChild(bananaMouse);
}
function lettuceSelectionClicked()
{
    lettuceChosen = true;
    cornChosen = false;
    bananaChosen = false;
    potatoChosen = false;

    lettuceTextureMouse.width = 30;
    lettuceMouse.height = 30;

    app.stage.addChild(lettuceMouse);
}
function potatoSelectionClicked()
{
    potatoChosen = true;
    cornChosen = false;
    bananaChosen = false;
    lettuceChosen = false;

    potatoTextureMouse.width = 30;
    potatoMouse.height = 30;

    app.stage.addChild(potatoMouse);
}
function strawberrySelectionClicked()
{
    strawberryChosen = true;
    potatoChosen = false;
    cornChosen = false;
    bananaChosen = false;
    lettuceChosen = false;

    strawberryTextureMouse.width = 30;
    strawberryMouse.height = 30;

    app.stage.addChild(strawberryMouse);
}


//runs when garden is clicked on
//plants whatever veggie is currently chosen
//or remove plant
function gardenClicked() 
{
    if(cornChosen)
    {
        plantTheVeggie("corn");
    }
    else if(bananaChosen)
    {
        plantTheVeggie("banana");
    }
    else if(lettuceChosen)
    {
        plantTheVeggie("lettuce");
    }
    else if(potatoChosen)
    {
        plantTheVeggie("potato");
    }
    else if(strawberryChosen)
    {
        plantTheVeggie("strawberry");
    }
    else
    {
        for(let columns = 0; columns < 5; columns++)
        {
            for(let rows = 0; rows < 5; rows++)
            {
                if(mousePosition.x > (CROP_MARGIN + (rows * CROP_WIDTH)) && mousePosition.x < (CROP_MARGIN + ((rows + 1) * CROP_WIDTH)))
                {
                    if (mousePosition.y > (CROP_MARGIN + (columns * CROP_HEIGHT)) && mousePosition.y < (CROP_MARGIN + ((columns + 1) * CROP_HEIGHT))) 
                    {
                        //checks plant growth and removes it if over 100
                        if(cropLocations[columns][rows].plant.currentGrowth >= cropLocations[columns][rows].plant.plantData.maxGrowth)
                        {
                            cropLocations[columns][rows].removePlant();
                        }
                    }
                }
            }
        }
    }

}

function plantTheVeggie(type)
{
    //basically detects what cell on the garden the mouse is over and plants it in that cell
    for (let columns = 0; columns < 5; columns++) {
        for (let rows = 0; rows < 5; rows++) {
            if (mousePosition.x > (CROP_MARGIN + (rows * CROP_WIDTH)) && mousePosition.x < (CROP_MARGIN + ((rows + 1) * CROP_WIDTH))) {
                if (mousePosition.y > (CROP_MARGIN + (columns * CROP_HEIGHT)) && mousePosition.y < (CROP_MARGIN + ((columns + 1) * CROP_HEIGHT))) {
                    //gets rid of image following mouse
                    cornChosen = false;
                    bananaChosen = false;
                    lettuceChosen = false;
                    potatoChosen = false;
                    strawberryChosen = false;
                    //plants veggie accordingly to cell
                    cropLocations[columns][rows].addPlant(type);
                }
            }
        }
    }
}

//corn selection follows mouse
function cornSelectionMouse()
{
    cornMouse.x = mousePosition.x;
    cornMouse.y = mousePosition.y;
}
function bananaSelectionMouse()
{
    bananaMouse.x = mousePosition.x;
    bananaMouse.y = mousePosition.y;
}
function lettuceSelectionMouse()
{
    lettuceMouse.x = mousePosition.x;
    lettuceMouse.y = mousePosition.y;
}
function potatoSelectionMouse()
{
    potatoMouse.x = mousePosition.x;
    potatoMouse.y = mousePosition.y;
}
function strawberrySelectionMouse()
{
    strawberryMouse.x = mousePosition.x;
    strawberryMouse.y = mousePosition.y;
}

