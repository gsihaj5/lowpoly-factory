import loadGLTF from "./AsyncLoader";
import {Vector3} from "three";

let ores = [];

let minedOreSpawnPoint = new Vector3(-.2, -.15, 0);
let XdespawnLimit = -2.8;
let numberOfOres = 0;
let oresLimit = 10;

let spawnInterval;

let model;

export async function createIronOrePatch(loader, scene) {
    model = await loadGLTF("OreDepositMERGED.glb", loader)
    let newModel = model.scene.clone();
    scene.add(newModel)

    return newModel;
}

export async function createMinedOre(loader, scene) {
    let loadedModel = model.scene.clone()
    scene.add(loadedModel)
    ores.push(loadedModel)

    loadedModel.scale.set(.15, .15, .15)
    loadedModel.position.set(
        minedOreSpawnPoint.x,
        minedOreSpawnPoint.y,
        minedOreSpawnPoint.z,
    )

    return loadedModel;
}

export function spawnMultipleOre(loader, scene) {
    spawnInterval = setInterval(async () => {
        await createMinedOre(loader, scene)
    }, 1000)
}

export function updateIronOre(scene) {
    if (numberOfOres >= oresLimit) clearInterval(spawnInterval)

    ores.forEach((minedOre, index, object) => {
        if (minedOre.position.x <= XdespawnLimit) {
            scene.remove(minedOre)
            minedOre.children.forEach(child => {
                child.geometry.dispose();
            })
            object.splice(index, 1)
        }

        minedOre.position.set(
            minedOre.position.x - .001,
            minedOre.position.y,
            minedOre.position.z,
        )
    })
}
