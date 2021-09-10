import './css/style.css'
import {
    AmbientLight,
    Mesh,
    PerspectiveCamera,
    Scene,
    Vector3,
    Color,
    WebGLRenderer,
    DirectionalLight,
    BoxGeometry, MeshLambertMaterial
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {createIronOrePatch, createMinedOre, spawnMultipleOre, updateIronOre} from "./js/IronOre";
import Miner from "./js/Miner";
import Smelter from "./js/Smelter";
import AnimatedObject from "./js/AnimatedObject";

(async () => {

//region Globals
    let camera, scene, renderer;
    let container

    let loader

    let ambientLight;

    let mouseScroll = 0;

    let stage = 0;

    let controls;

    let debounce;

    let cameraPredefinedPos = [
        new Vector3(0, 0, 0),
        new Vector3(-3, 0, 0)
    ]

//endregion
//region Component
    let nextButton = document.querySelector('#next-button');
    let prevButton = document.querySelector('#prev-button');

//endregion

    async function init() {
        //region BASIC SETUP
        container = document.getElementById('container')
        camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, .001, 1100);
        camera.updateProjectionMatrix()
        camera.position.set(-1, 0, -1)


        renderer = new WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement)

        scene = new Scene()
        scene.background = new Color(0x1C92FF)

        //region Listeners

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('wheel', onMouseScroll, false);
        nextButton.addEventListener('click', onNextStage, false)
        prevButton.addEventListener('click', onPrevStage, false)

        //endregion
        //endregion

        //region Additional Setup
        loader = new GLTFLoader()
        // await loadFloor(loader, scene)

        camera.lookAt(new Vector3())

        ambientLight = new AmbientLight(0x9F9F9F)
        scene.add(ambientLight)

        let sunLight = new DirectionalLight(0x9F9F9F, 1)
        scene.add(sunLight)
        sunLight.position.set(0, 10, 1)

        //endregion

        //region Object creation
        let miner = new Miner(loader, scene)
        await miner.init()

        let smelter = new Smelter(loader, scene)
        await smelter.init()
        smelter.loadedModel.scene.position.set(-3, 0, 0)

        //conveyor placeholder
        let boxGeo = new BoxGeometry(2.6, .1, .2)
        let boxMaterial = new MeshLambertMaterial({color: 0xffffff})
        let boxMesh = new Mesh(boxGeo, boxMaterial)
        boxMesh.translateY(-.23)
        boxMesh.translateX(-1.4)
        scene.add(boxMesh)

        //ores
        let ore = (await createIronOrePatch(loader, scene))
        console.log(ore.position.set(0, -.4, 0))

        spawnMultipleOre(loader, scene)

        //Grid
        // let planeGeometry = new PlaneGeometry(1, 1)
        // let material = new MeshBasicMaterial({
        //     map: new TextureLoader().load("Assets/Image/blueprint.jpg"),
        //     side: DoubleSide
        // })
        //
        // grid = new Mesh(planeGeometry, material)
        // scene.add(grid)
        // grid.position.set(0, -.4, 0)
        // grid.rotation.set(Math.PI / 2, 0, 0)
        //endregion
    }

//mainloop

    function update() {
        renderer.render(scene, camera)
        controls.update()
        updateCameraPos()

        updateIronOre(scene)
        let delta = AnimatedObject.clock.getDelta()
        Miner.update(delta)
        Smelter.update(delta)
    }

    function updateCameraPos() {
        if (stage > cameraPredefinedPos.length - 1 || stage < 0) return
        let currentTargetPosition = cameraPredefinedPos[stage]
        let oldTarget = controls.target.clone();
        controls.target.lerp(currentTargetPosition, .02)
        let dPosition = oldTarget.sub(controls.target)
        camera.position.sub(dPosition)
    }

    function animate() {
        requestAnimationFrame(animate)
        update()
    }

//region Event Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseScroll(event) {
        clearTimeout(debounce)
        debounce = setTimeout(function () {
            if (event.wheelDeltaY > 0) onPrevStage()
            else if (event.wheelDeltaY < 0) onNextStage()
        }, 100)
    }

    function onNextStage() {
        if (stage + 1 <= cameraPredefinedPos.length - 1)
            stage++;
    }

    function onPrevStage() {
        if (stage - 1 >= 0)
            stage--;
    }

//endregion

    await init();
    animate();
})();
