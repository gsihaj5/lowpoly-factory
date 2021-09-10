import AnimatedObject from "./AnimatedObject";

class Smelter extends AnimatedObject {
    static smelters = []

    static update(deltaTime) {
        Smelter.smelters.forEach(smelter => smelter.updateAnimations(deltaTime))
    }

    constructor(loader, scene) {
        super(loader, scene)
        Smelter.smelters.push(this)
        this.glbFile = "Smelter.glb"
    }

    async init() {
        await this.loadModel()
        this.loadAnimation()
        this.loadedModel.scene.rotation.y = Math.PI / -2
    }
}

export default Smelter
