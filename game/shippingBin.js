function createShippingBin() {
    shippingBin = new PIXI.Sprite(PIXI.loader.resources["images/basketEmpty.png"].texture);
    shippingBin.x = SHIPPINGBIN_X;
    shippingBin.y = SHIPPINGBIN_Y;
    shippingBin.width = SHIPPINGBIN_SIZE;
    shippingBin.height = SHIPPINGBIN_SIZE;
    shippingBin.buttonMode = true;
    shippingBin.interactive = true;
    shippingBin.on("pointerup", shippingBinClicked);
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