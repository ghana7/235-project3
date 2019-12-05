//https://stackoverflow.com/a/11508164
function hexToRgb(bigint) {
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return {"r": r, "g" : g, "b": b};
}

function mixColors(rgbColor1, rgbColor2, mixFraction) {
    return {"r": Math.round(rgbColor2.r * mixFraction + rgbColor1.r * (1-mixFraction)),
            "g": Math.round(rgbColor2.g * mixFraction + rgbColor1.g * (1-mixFraction)),
            "b": Math.round(rgbColor2.b * mixFraction + rgbColor1.b * (1-mixFraction)),
            };
}

function rgbToHex(rgbColor) {
    return rgbColor.r * 65536+ rgbColor.g * 256 + rgbColor.b;
}