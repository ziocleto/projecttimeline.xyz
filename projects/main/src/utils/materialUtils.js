import {decode} from "base64-arraybuffer";

const zlib = require("zlib");

const transparent1pxImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const getThumbnailURLBlobFor = (thumbsContainer, thumbName) => {
    let thumb = transparent1pxImg;
    // eslint-disable-next-line
    for (const th of thumbsContainer) {
        if (th.key === thumbName && th.value ) {
            thumb = th.value;
        }
    }

    console.log( "Resolving mapping for ", thumbName);
    if (!thumb.startsWith('blob:http') && !thumb.startsWith('data:image')) {
        thumb = URL.createObjectURL(
            new Blob([
                new Buffer.from(zlib.inflateSync(new Buffer.from(decode(thumb))))
            ])
        );
    }
    return thumb;
};

const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
        .map(x => {
            const hex = Math.floor(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        })
        .join("");

export const fillMaterialParams = (key, values, thumbValues = null) => {

    let matSimpleEntry = {
        key: key,
        baseColor: "#FFFFFF",
        diffuseTexture: transparent1pxImg,
        normalTexture: transparent1pxImg,
        metallicTexture: transparent1pxImg,
        roughnessTexture: transparent1pxImg,
        aoTexture: transparent1pxImg,
        opacityTexture: transparent1pxImg,
        translucencyTexture: transparent1pxImg,
        heightTexture: transparent1pxImg,
        aoValue: 1.0,
        roughnessValue: 0.8,
        metallicValue: 0.2,
        opacityValue: 1.0,
        translucencyValue: 1.0,
        heightValue: 1.0
    };

    if (values.mV3fs) {
        // eslint-disable-next-line
        for (const v3f of values.mV3fs) {
            if (v3f.key === "diffuseColor") {
                const rgbC = values.mV3fs[0].value;
                matSimpleEntry.baseColor = rgbToHex(
                    rgbC[0] * 255,
                    rgbC[1] * 255,
                    rgbC[2] * 255
                );
            }
        }
    }

    if (values.mFloats) {
        // eslint-disable-next-line
        for (const fv of values.mFloats) {
            if (fv.key === "aoV") {
                matSimpleEntry.aoValue = fv.value;
            } else if (fv.key === "roughnessV") {
                matSimpleEntry.roughnessValue = fv.value;
            } else if (fv.key === "metallicV") {
                matSimpleEntry.metallicValue = fv.value;
            } else if (fv.key === "opacity") {
                matSimpleEntry.opacityValue = fv.value;
            }
        }
    }

    if (thumbValues) {
        console.log( "thumbs container: ", thumbValues);

        // eslint-disable-next-line
        for (const tn of values.mStrings) {
            matSimpleEntry[tn.key] = getThumbnailURLBlobFor(thumbValues, tn.key);
        }
    }
    return matSimpleEntry;
};
