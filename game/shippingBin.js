function createShippingBin() {
    shippingBin = new PIXI.Sprite(PIXI.loader.resources["images/basketEmpty.png"].texture);
    shippingBin.x = SHIPPINGBIN_X;
    shippingBin.y = SHIPPINGBIN_Y;
    shippingBin.width = SHIPPINGBIN_SIZE;
    shippingBin.height = SHIPPINGBIN_SIZE;
    shippingBin.buttonMode = true;
    shippingBin.interactive = true;
    shippingBin.on("pointerup", shippingBinClicked);
    shippingBin.on("mouseover", shippingBinHoverStart);
    shippingBin.on("mouseout", shippingBinHoverStop);
    app.stage.addChild(shippingBin);
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

function shippingBinHoverStart() {
    shippingBin.texture = PIXI.loader.resources["images/basketFull.png"].texture;
}

function shippingBinHoverStop() {
    shippingBin.texture = PIXI.loader.resources["images/basketEmpty.png"].texture;
}