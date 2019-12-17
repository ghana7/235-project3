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

//behavior for when field is clicked
function fieldClicked() {
    let clickedLocation = selectedCropLocation();
    
    if(heldItem != null) {
        //if holding a seed and clicked space is empty, plant it
        if (heldItem.itemType == "seed") {
            if (clickedLocation.plant == null) {
                clickedLocation.addPlant(heldItem.plantType);
                heldItem = null;
            }
        } else if(heldItem.itemType == "fertilizer") {
            clickedLocation.growthSpeed += heldItem.speedModifier;
            clickedLocation.background.tint = 0x321000;
            heldItem = null;
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


//Gets the crop location the mouse is currently over
function selectedCropLocation() {

    let mouseGridX = Math.floor((mousePosition.x - field.x) / (PLANT_MARGIN + PLANT_WIDTH));
    let mouseGridY = Math.floor((mousePosition.y - field.y) / (PLANT_MARGIN + PLANT_HEIGHT));

    return cropLocations[mouseGridY][mouseGridX];
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