let seedCombos = {
    "banana pumpkin ": ["melon"],
    "banana strawberry ": ["grapes"],
    "garlic lettuce ": ["scallion"],
    "garlic bellpepper ": ["chilipepper"],
    "lettuce wheat ": ["broccoli"],
    "scallion potato ": ["onion"],
    "potato broccoli ": ["greenbean"],
    "wheat tomato ": ["corn"],
    "tomato pumpkin ": ["bellpepper"]
}
//adds reverse orientation of all hybrid combos
for(let combo in seedCombos) {
    let plants = combo.split(" ");
    seedCombos[plants[1] + " " + plants[0] + " "] = seedCombos[combo];
}

//all plants can make two of their own seeds
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
    seedMakerInput = new GeneralInventory(SEEDMAKER_X + SEEDMAKER_SIZE / 2,
                                          SEEDMAKER_Y - SEEDMAKER_SIZE + SEEDMAKER_MARGIN,
                                          3, 1, SEEDMAKER_SIZE - SEEDMAKER_MARGIN, SEEDMAKER_SIZE - SEEDMAKER_MARGIN,
                                          SEEDMAKER_MARGIN, 0x444444);
    app.stage.addChild(seedMakerInput);
    seedMakerOutput = new GeneralInventory(SEEDMAKER_X + SEEDMAKER_SIZE / 2,
        SEEDMAKER_Y + SEEDMAKER_SIZE * 2,
        3, 1, SEEDMAKER_SIZE - SEEDMAKER_MARGIN, SEEDMAKER_SIZE - SEEDMAKER_MARGIN,
        SEEDMAKER_MARGIN, 0x444444);
    app.stage.addChild(seedMakerOutput);
}

//seedMaker has been clicked
function seedMakerClicked(){
    let valid = true;
    let plantInputTypes = [];
    for(let input of seedMakerInput.spaces[0]) {
        if(input.item) {
            if(input.item.itemType == "crop") {
                plantInputTypes.push(input.item.plantType);
            } else {
                valid = false;
            }
        }
    }
    let plantInputString = "";
    for(let p of plantInputTypes) {
        plantInputString += p + " ";
    }
    if(valid && seedCombos[plantInputString]) {
        for(let i = 0; i < seedCombos[plantInputString].length; i++) {
            seedMakerOutput.spaces[0][i].addItem(new Seeds(seedCombos[plantInputString][0], 0,0,16,16));
        }
        for(let i = 0; i < 3; i++) {
            seedMakerInput.spaces[0][i].removeItem();
        }
    } 
}