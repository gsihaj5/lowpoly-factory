import {AnimationMixer, Clock} from "three";
import loadGLTF from "./AsyncLoader";

class AnimatedObject {
    static clock = new Clock();

    constructor(loader, scene) {
        this.mixers = []
        this.loadedModel = undefined;
        this.glbFile = undefined;
        this.loader = loader
        this.scene = scene
    }

    async loadModel() {
        this.loadedModel = await loadGLTF(this.glbFile, this.loader)
        this.scene.add(this.loadedModel.scene)
    }

    loadAnimation() {
        this.loadedModel.animations.forEach(animation => {
            let mixer = new AnimationMixer(this.loadedModel.scene)
            this.mixers.push(mixer)
            let action = mixer.clipAction(animation)
            action.play();
        })
    }

    updateAnimations(deltaTime) {
        this.mixers.forEach(mixer => mixer.update(deltaTime))
    }
}

export default AnimatedObject