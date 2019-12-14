let seedCombos = {
    "strawberry potato ": ["corn", "corn"]
}
for(let plantType in plantDict) {
    seedCombos[["" + plantType + " "]] = [plantType, plantType];
}
//loads seedMakers sprite
function createSeedMaker(){
    seedMaker = new PIXI.Sprite(PIXI.loader.resources["images/seedMaker.png"].texture);
    seedMaker.x = shippingBin.x + 192;
    seedMaker.y = shippingBin.y;
    seedMaker.width = 192;
    seedMaker.height = 128;
    seedMaker.buttonMode = true;
    seedMaker.interactive = true;
    seedMaker.on("pointerup", seedMakerClicked);
    app.stage.addChild(seedMaker);
    createSeedMakerInventories();
}

function createSeedMakerInventories() {
    let input = new PIXI.Container();
    input.x = SEEDMAKER_X + SEEDMAKER_SIZE / 2;
    input.y = SEEDMAKER_Y - SEEDMAKER_SIZE + SEEDMAKER_MARGIN;
    input.width = 3 * SEEDMAKER_SIZE + SEEDMAKER_MARGIN;
    input.height = SEEDMAKER_SIZE + SEEDMAKER_MARGIN;

    let inputBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
    inputBackground.tint = 0x444444;
    inputBackground.width = 3 * SEEDMAKER_SIZE + SEEDMAKER_MARGIN;
    inputBackground.height = SEEDMAKER_SIZE + SEEDMAKER_MARGIN;

    inputBackground.buttonMode = true;
    inputBackground.interactive = true;

    input.addChild(inputBackground);

    inputBackground.on("pointerup", seedMakerInputClicked);

    //create grid of inventory spaces
    for (let y = 0; y < 1; y++) {
        seedMakerInputSpaces.push([]);
        for (let x = 0; x < 3; x++) {
            let invSpace = new InventorySpace(x * SEEDMAKER_SIZE +  SEEDMAKER_MARGIN,
                y * SEEDMAKER_SIZE + SEEDMAKER_MARGIN,
                SEEDMAKER_SIZE - SEEDMAKER_MARGIN, SEEDMAKER_SIZE - SEEDMAKER_MARGIN);
            seedMakerInputSpaces[y].push(invSpace);
            input.addChild(invSpace);
        }
    }

    seedMakerInput = input;
    app.stage.addChild(seedMakerInput);

    let output = new PIXI.Container();
    output.x = SEEDMAKER_X + SEEDMAKER_SIZE / 2;
    output.y = SEEDMAKER_Y + SEEDMAKER_SIZE * 2;
    output.width = 3 * SEEDMAKER_SIZE + SEEDMAKER_MARGIN;
    output.height = SEEDMAKER_SIZE + SEEDMAKER_MARGIN;

    let outputBackground = new PIXI.Sprite(PIXI.Texture.WHITE);
    outputBackground.tint = 0x444444;
    outputBackground.width = 3 * SEEDMAKER_SIZE + SEEDMAKER_MARGIN;
    outputBackground.height = SEEDMAKER_SIZE + SEEDMAKER_MARGIN;

    outputBackground.buttonMode = true;
    outputBackground.interactive = true;

    output.addChild(outputBackground);

    outputBackground.on("pointerup", seedMakerOutputClicked);

    //create grid of inventory spaces
    for (let y = 0; y < 1; y++) {
        seedMakerOutputSpaces.push([]);
        for (let x = 0; x < 3; x++) {
            let invSpace = new InventorySpace(x * SEEDMAKER_SIZE + SEEDMAKER_MARGIN,
                y * SEEDMAKER_SIZE +  SEEDMAKER_MARGIN,
                SEEDMAKER_SIZE - SEEDMAKER_MARGIN, SEEDMAKER_SIZE - SEEDMAKER_MARGIN);
            seedMakerOutputSpaces[y].push(invSpace);
            output.addChild(invSpace);
        }
    }

    seedMakerOutput = output;
    app.stage.addChild(seedMakerOutput);
}

function selectedSeedMakerInputSpaceLocation() {
    let mouseGridX = Math.floor((mousePosition.x - seedMakerInput.x) / (SEEDMAKER_SIZE));
    let mouseGridY = Math.floor((mousePosition.y - seedMakerInput.y) / (SEEDMAKER_SIZE));

    return seedMakerInputSpaces[mouseGridY][mouseGridX];
}

function selectedSeedMakerOutputSpaceLocation() {
    let mouseGridX = Math.floor((mousePosition.x - seedMakerOutput.x) / (SEEDMAKER_SIZE));
    let mouseGridY = Math.floor((mousePosition.y - seedMakerOutput.y) / (SEEDMAKER_SIZE));

    return seedMakerOutputSpaces[mouseGridY][mouseGridX];
}

//seedMaker has been clicked
function seedMakerClicked(){
    console.log("morphin time");
    let valid = true;
    let plantInputTypes = [];
    for(let input of seedMakerInputSpaces[0]) {
        if(input.item) {
            if(input.item.itemType == "crop") {
                plantInputTypes.push(input.item.plantType);
            } else {
                valid = false;
            }
        }
    }
    console.log(plantInputTypes);
    let plantInputString = "";
    for(let p of plantInputTypes) {
        plantInputString += p + " ";
    }
    if(valid && seedCombos[plantInputString]) {
        for(let i = 0; i < seedCombos[plantInputString].length; i++) {
            seedMakerOutputSpaces[0][i].addItem(new Seeds(seedCombos[plantInputString][0], 0,0,16,16));
        }
        for(let i = 0; i < 3; i++) {
            seedMakerInputSpaces[0][i].removeItem();
        }
    } 
}

function seedMakerInputClicked() {
    let clickedSpace = selectedSeedMakerInputSpaceLocation();
    //if holding item and clicked space is empty, put it down
    if (heldItem != null) {
        if (clickedSpace.item == null) {

            clickedSpace.addItem(heldItem);
            heldItem = null;
        }
        //using seedmaker tool
    } else {
        //if not holding item and clicked space has an item, pick that item up
        if (clickedSpace.item != null) {
            heldItem = clickedSpace.item;
            clickedSpace.removeItem();
        }
    }
}

function seedMakerOutputClicked() {
    let clickedSpace = selectedSeedMakerOutputSpaceLocation();
    //if holding item and clicked space is empty, put it down
    if (heldItem != null) {
        if (clickedSpace.item == null) {

            clickedSpace.addItem(heldItem);
            heldItem = null;
        }
        //using seedmaker tool
    } else {
        //if not holding item and clicked space has an item, pick that item up
        if (clickedSpace.item != null) {
            heldItem = clickedSpace.item;
            clickedSpace.removeItem();
        }
    }
}