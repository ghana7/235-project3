class InfoBox extends PIXI.Container {
    constructor(x, y, width, height, texture, titleText, bodyText, backColor) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.background.tint = backColor;
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = width;
        this.background.height = height;
        this.addChild(this.background);

        this.image = new PIXI.Sprite(texture);
        this.image.x = 4;
        this.image.y = 4;
        this.image.width = 64;
        this.image.height = 64;
        this.addChild(this.image);

        this.titleText = new PIXI.Text(titleText, {wordWrap: true,
                                                   wordWrapWidth: width});
        this.titleText.x = 72;
        this.titleText.y = 4;
        
        this.addChild(this.titleText);

        this.bodyText = new PIXI.Text(bodyText, {wordWrap: true,
            wordWrapWidth: width});
        this.bodyText.x = 4;
        this.bodyText.y = 72;

        this.addChild(this.bodyText);
    }

    
}

let infoBox = new InfoBox(0, 0, 384, 256, PIXI.Texture.WHITE, "Debug box", "You shouldn't see this", 0xFFFFFF);

function hideInfoBox() {
    console.log("hide box");
    app.stage.removeChild(infoBox);
}

function showPlantInfoBox(plantType) {
    console.log("show box");
    if(plantType != null) {
        infoBox.image.texture = plantTextures[plantType];
        infoBox.titleText.text = plantDict[plantType].name;
        infoBox.bodyText.text = plantDict[plantType].description;
        infoBox.background.tint = plantDict[plantType].color;
    }
    
    
    
    app.stage.addChild(infoBox);
}

function showInfoBox(texture, titleText, bodyText, backColor) {
    console.log("show box");
    infoBox.image.texture = texture;
    infoBox.titleText.text = titleText;
    infoBox.bodyText.text = bodyText;
    infoBox.background.tint = backColor;

    app.stage.addChild(infoBox);
}