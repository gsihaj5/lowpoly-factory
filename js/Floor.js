import {Box3, Vector2, Vector3} from "three";

let floors = [];
let _scene;
let _loader;

export default async function loadFloor(loader, scene) {
    _loader = loader
    _scene = scene

    await loadFloorModel()
    await createFloor(new Vector2(10, 10), new Vector3(-2, 0, -2))
}

async function loadFloorModel() {
    floors.push((await loadGLTF("floor_0.glb")).scene)
    floors.push((await loadGLTF("floor_1.glb")).scene)
}

async function createFloor(tileCount, startPos) {
    await loadFloorModel()

    let boundingBox = new Box3().setFromObject(floors[0]);
    let size = new Vector3()
    boundingBox.getSize(size);

    for (let i = 0; i < tileCount.x; i++) {
        for (let j = 0; j < tileCount.y; j++) {
            let floor = floors[getRandomInt(floors.length)].clone();

            _scene.add(floor)
            floor.position.set(
                startPos.x + i * size.x,
                startPos.y,
                startPos.z + j * size.z
            )
        }
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

