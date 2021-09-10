import AnimatedObject from "./AnimatedObject";

class Miner extends AnimatedObject {
    static miners = []

    static update(deltaTime) {
        Miner.miners.forEach(miner => miner.updateAnimations(deltaTime / 2))
    }

    constructor(loader, scene) {
        super(loader, scene)
        Miner.miners.push(this)
        this.glbFile = "MinerMERGED.glb"
    }

    async init() {
        await this.loadModel()
        this.loadAnimation()
    }
}

export default Miner