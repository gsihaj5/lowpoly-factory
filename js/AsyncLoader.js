import {AnimationMixer} from "three";

async function loadGLTF(assetName, loader) {
    return new Promise((resolve, reject) =>
        loader.load(
            "./Assets/3D/" + assetName,
            gltf => resolve(gltf),
            null,
            reject
        )
    )
}

export default loadGLTF;


