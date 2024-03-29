function createShop() {
    shop = new PIXI.Container();
    app.stage.addChild(shop);
    shop.x = 500;
    shop.y = 64;
    shop.width = 400;
    shop.height = 512;

    createSeedShops();
    createFertilizerShop();
}
function createSeedShops() {
    let topOffset = 0;
    let sideOffset = 0;
    for (let plant in plantDict) {
        if(plantDict[plant].tier ==1) {
            let seedbag = new StoreSeedBag(sideOffset, topOffset, 128, 64, plant);
            seedbag.on("mouseover", function() {showPlantInfoBox(plant)});
            seedbag.on("mouseout", hideInfoBox);
            shop.addChild(seedbag);
            topOffset += 96;
            if(topOffset >= 384) {
                topOffset = 0;
                sideOffset = 144;
            }
        }
        
    }
}

function createFertilizerShop(){
    let fertilizerShop = new PIXI.Container;

    fertilizerShop.buttonMode = true;
    fertilizerShop.interactive = true;
    fertilizerShop.x = 0;
    fertilizerShop.y = 384;
    fertilizerShop.width = 128;
    fertilizerShop.height = 64;
    fertilizerShop.on("pointerup", fertilizerShopClicked);

    let background = new PIXI.Sprite(PIXI.Texture.WHITE);
    background.x = 0;
    background.y = 0;
    background.width = 128;
    background.height = 64;
    background.tint = 0xCCCCCC;
    fertilizerShop.addChild(background);

    fertilizerImage = new PIXI.Sprite(PIXI.loader.resources["images/fertilizer.png"].texture);
    fertilizerImage.x = 0;
    fertilizerImage.y = 0;
    fertilizerImage.width = 64;
    fertilizerImage.height = 64;
    fertilizerShop.addChild(fertilizerImage);

    let priceText = new PIXI.Text("$15", {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: 0x000000,
        align: "left"
    });
    priceText.anchor.set(0, 0.5);
    priceText.x = 64
    priceText.y = 32
    fertilizerShop.addChild(priceText);

    fertilizerShop.on("mouseover", function(mouseData) {showInfoBox(PIXI.loader.resources["images/fertilizer.png"].texture,
                                               "Fertilizer", "Apply on a space to make crops grow faster on it.",
                                               0xCCCCCC)});
    fertilizerShop.on("mouseout", hideInfoBox);
    shop.addChild(fertilizerShop);
}

//adds or removes money, then updates the display
function changeMoney(amount) {
    money += amount;
    moneyDisplay.text = "Balance: $" + money;
}

function createMoneyDisplay() {
    moneyDisplay = new PIXI.Text("Balance: $" + money, {
        fontFamily: 'Arial',
        fontSize: 64,
        fill: 0xFFFFFF,
        align: "left"
    });
    moneyDisplay.x = FIELD_X;
    moneyDisplay.y = FIELD_Y + (PLANT_HEIGHT + PLANT_MARGIN) * 5 + 20;
    app.stage.addChild(moneyDisplay);
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




function fertilizerShopClicked(){
    if(heldItem == null) {
        if (money >= 15) {

            heldItem = new Fertilizer(16,16, 0,0, 0.5);
            changeMoney(-15);
        }
        
    }
}

class StoreSeedBag extends PIXI.Container {
    constructor(x, y, width, height, plantType) {
        super()
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.plantType = plantType;

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = width;
        this.background.height = height;
        this.background.tint = mixHexColors(plantDict[plantType].color, 0xCCCCCC, 0.8);
        this.addChild(this.background);

        this.bag = new PIXI.Sprite(PIXI.loader.resources["images/seedbag.png"].texture);
        this.bag.x = 0;
        this.bag.y = 0;
        this.bag.width = width * (1/2);
        this.bag.height = height;
        this.bag.tint = mixHexColors(plantDict[plantType].color, 0xCCCCCC, 0.5);
        this.addChild(this.bag);

        this.plantIcon = new PIXI.Sprite(plantTextures[plantType]);
        this.plantIcon.anchor.set(0.5);
        this.plantIcon.width = width * (1/2) * (3/8);
        this.plantIcon.height = height * (3/8);
        this.plantIcon.x = width * (1/2) * (36/64);
        this.plantIcon.y = height * (44/64);

        this.addChild(this.plantIcon);

        
        
        this.priceText = new PIXI.Text("$" + plantDict[plantType].seedPrice,{
            fontFamily: 'Arial',
            fontSize: height / 2,
            fill: 0x000000,
            align: "left"
        });
        this.priceText.anchor.set(0, 0.5);
        this.priceText.x = width/2 + 4;
        this.priceText.y = height/2;
        this.addChild(this.priceText);

        this.buttonMode = true;
        this.interactive = true;
        this.on("pointerup", seedbagClicked);
    }
}