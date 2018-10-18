/*BabylonJS Loaders*/
// Dependencies for this module:
//   ../../../../Tools/Gulp/babylonjs
//   ../../../../Tools/Gulp/babylonjs-gltf2interface

declare module 'babylonjs-loaders' {
    export * from "babylonjs-loaders/src/glTF";
    export * from "babylonjs-loaders/src/OBJ";
    export * from "babylonjs-loaders/src/STL";
}

declare module 'babylonjs-loaders/src/glTF' {
    export * from "babylonjs-loaders/src/glTF/glTFFileLoader";
    import * as GLTF1 from "babylonjs-loaders/src/glTF/1.0";
    import * as GLTF2 from "babylonjs-loaders/src/glTF/2.0";
    export { GLTF1, GLTF2 };
}

declare module 'babylonjs-loaders/src/OBJ' {
    export * from "babylonjs-loaders/src/OBJ/objFileLoader";
}

declare module 'babylonjs-loaders/src/STL' {
    export * from "babylonjs-loaders/src/STL/stlFileLoader";
}

declare module 'babylonjs-loaders/src/glTF/glTFFileLoader' {
    import { IDisposable, Nullable, Scene, ISceneLoaderPluginAsync, ISceneLoaderPluginFactory, Observable, SceneLoaderProgressEvent, AbstractMesh, IParticleSystem, Skeleton, AnimationGroup, BaseTexture, Material, Camera, ISceneLoaderPluginExtensions, ISceneLoaderPlugin, AssetContainer } from "babylonjs";
    import { IGLTFValidationResults } from "babylonjs-gltf2interface";
    /**
        * Mode that determines the coordinate system to use.
        */
    export enum GLTFLoaderCoordinateSystemMode {
            /**
                * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
                */
            AUTO = 0,
            /**
                * Sets the useRightHandedSystem flag on the scene.
                */
            FORCE_RIGHT_HANDED = 1
    }
    /**
        * Mode that determines what animations will start.
        */
    export enum GLTFLoaderAnimationStartMode {
            /**
                * No animation will start.
                */
            NONE = 0,
            /**
                * The first animation will start.
                */
            FIRST = 1,
            /**
                * All animations will start.
                */
            ALL = 2
    }
    /**
        * Interface that contains the data for the glTF asset.
        */
    export interface IGLTFLoaderData {
            /**
                * Object that represents the glTF JSON.
                */
            json: Object;
            /**
                * The BIN chunk of a binary glTF.
                */
            bin: Nullable<ArrayBufferView>;
    }
    /**
        * Interface for extending the loader.
        */
    export interface IGLTFLoaderExtension {
            /**
                * The name of this extension.
                */
            readonly name: string;
            /**
                * Defines whether this extension is enabled.
                */
            enabled: boolean;
    }
    /**
        * Loader state.
        */
    export enum GLTFLoaderState {
            /**
                * The asset is loading.
                */
            LOADING = 0,
            /**
                * The asset is ready for rendering.
                */
            READY = 1,
            /**
                * The asset is completely loaded.
                */
            COMPLETE = 2
    }
    /** @hidden */
    export interface IGLTFLoader extends IDisposable {
            readonly state: Nullable<GLTFLoaderState>;
            importMeshAsync: (meshesNames: any, scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string) => Promise<{
                    meshes: AbstractMesh[];
                    particleSystems: IParticleSystem[];
                    skeletons: Skeleton[];
                    animationGroups: AnimationGroup[];
            }>;
            loadAsync: (scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string) => Promise<void>;
    }
    /**
        * File loader for loading glTF files into a scene.
        */
    export class GLTFFileLoader implements IDisposable, ISceneLoaderPluginAsync, ISceneLoaderPluginFactory {
            /** @hidden */
            static _CreateGLTF1Loader: (parent: GLTFFileLoader) => IGLTFLoader;
            /** @hidden */
            static _CreateGLTF2Loader: (parent: GLTFFileLoader) => IGLTFLoader;
            /**
                * Raised when the asset has been parsed
                */
            onParsedObservable: Observable<IGLTFLoaderData>;
            /**
                * Raised when the asset has been parsed
                */
            onParsed: (loaderData: IGLTFLoaderData) => void;
            /**
                * Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders.
                * Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled.
                * Defaults to true.
                * @hidden
                */
            static IncrementalLoading: boolean;
            /**
                * Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters.
                * Defaults to false. See https://en.wikipedia.org/wiki/Homogeneous_coordinates.
                * @hidden
                */
            static HomogeneousCoordinates: boolean;
            /**
                * The coordinate system mode. Defaults to AUTO.
                */
            coordinateSystemMode: GLTFLoaderCoordinateSystemMode;
            /**
             * The animation start mode. Defaults to FIRST.
             */
            animationStartMode: GLTFLoaderAnimationStartMode;
            /**
                * Defines if the loader should compile materials before raising the success callback. Defaults to false.
                */
            compileMaterials: boolean;
            /**
                * Defines if the loader should also compile materials with clip planes. Defaults to false.
                */
            useClipPlane: boolean;
            /**
                * Defines if the loader should compile shadow generators before raising the success callback. Defaults to false.
                */
            compileShadowGenerators: boolean;
            /**
                * Defines if the Alpha blended materials are only applied as coverage.
                * If false, (default) The luminance of each pixel will reduce its opacity to simulate the behaviour of most physical materials.
                * If true, no extra effects are applied to transparent pixels.
                */
            transparencyAsCoverage: boolean;
            /**
                * Function called before loading a url referenced by the asset.
                */
            preprocessUrlAsync: (url: string) => Promise<string>;
            /**
                * Observable raised when the loader creates a mesh after parsing the glTF properties of the mesh.
                */
            readonly onMeshLoadedObservable: Observable<AbstractMesh>;
            /**
                * Callback raised when the loader creates a mesh after parsing the glTF properties of the mesh.
                */
            onMeshLoaded: (mesh: AbstractMesh) => void;
            /**
                * Observable raised when the loader creates a texture after parsing the glTF properties of the texture.
                */
            readonly onTextureLoadedObservable: Observable<BaseTexture>;
            /**
                * Callback raised when the loader creates a texture after parsing the glTF properties of the texture.
                */
            onTextureLoaded: (texture: BaseTexture) => void;
            /**
                * Observable raised when the loader creates a material after parsing the glTF properties of the material.
                */
            readonly onMaterialLoadedObservable: Observable<Material>;
            /**
                * Callback raised when the loader creates a material after parsing the glTF properties of the material.
                */
            onMaterialLoaded: (material: Material) => void;
            /**
                * Observable raised when the loader creates a camera after parsing the glTF properties of the camera.
                */
            readonly onCameraLoadedObservable: Observable<Camera>;
            /**
                * Callback raised when the loader creates a camera after parsing the glTF properties of the camera.
                */
            onCameraLoaded: (camera: Camera) => void;
            /**
                * Observable raised when the asset is completely loaded, immediately before the loader is disposed.
                * For assets with LODs, raised when all of the LODs are complete.
                * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
                */
            readonly onCompleteObservable: Observable<void>;
            /**
                * Callback raised when the asset is completely loaded, immediately before the loader is disposed.
                * For assets with LODs, raised when all of the LODs are complete.
                * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
                */
            onComplete: () => void;
            /**
                * Observable raised when an error occurs.
                */
            readonly onErrorObservable: Observable<any>;
            /**
                * Callback raised when an error occurs.
                */
            onError: (reason: any) => void;
            /**
                * Observable raised after the loader is disposed.
                */
            readonly onDisposeObservable: Observable<void>;
            /**
                * Callback raised after the loader is disposed.
                */
            onDispose: () => void;
            /**
                * Observable raised after a loader extension is created.
                * Set additional options for a loader extension in this event.
                */
            readonly onExtensionLoadedObservable: Observable<IGLTFLoaderExtension>;
            /**
                * Callback raised after a loader extension is created.
                */
            onExtensionLoaded: (extension: IGLTFLoaderExtension) => void;
            /**
                * Defines if the loader logging is enabled.
                */
            loggingEnabled: boolean;
            /**
                * Defines if the loader should capture performance counters.
                */
            capturePerformanceCounters: boolean;
            /**
                * Defines if the loader should validate the asset.
                */
            validate: boolean;
            /**
                * Observable raised after validation when validate is set to true. The event data is the result of the validation.
                */
            readonly onValidatedObservable: Observable<IGLTFValidationResults>;
            /**
                * Callback raised after a loader extension is created.
                */
            onValidated: (results: IGLTFValidationResults) => void;
            /**
                * Name of the loader ("gltf")
                */
            name: string;
            /**
                * Supported file extensions of the loader (.gltf, .glb)
                */
            extensions: ISceneLoaderPluginExtensions;
            /**
                * Disposes the loader, releases resources during load, and cancels any outstanding requests.
                */
            dispose(): void;
            /** @hidden */
            _clear(): void;
            /**
                * Imports one or more meshes from the loaded glTF data and adds them to the scene
                * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
                * @param scene the scene the meshes should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise containg the loaded meshes, particles, skeletons and animations
                */
            importMeshAsync(meshesNames: any, scene: Scene, data: any, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<{
                    meshes: AbstractMesh[];
                    particleSystems: IParticleSystem[];
                    skeletons: Skeleton[];
                    animationGroups: AnimationGroup[];
            }>;
            /**
                * Imports all objects from the loaded glTF data and adds them to the scene
                * @param scene the scene the objects should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise which completes when objects have been loaded to the scene
                */
            loadAsync(scene: Scene, data: string | ArrayBuffer, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
            /**
                * Load into an asset container.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onProgress The callback when the load progresses
                * @param fileName Defines the name of the file to load
                * @returns The loaded asset container
                */
            loadAssetContainerAsync(scene: Scene, data: string | ArrayBuffer, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<AssetContainer>;
            /**
                * If the data string can be loaded directly.
                * @param data string contianing the file data
                * @returns if the data can be loaded directly
                */
            canDirectLoad(data: string): boolean;
            /**
                * Rewrites a url by combining a root url and response url.
                */
            rewriteRootURL: (rootUrl: string, responseURL?: string) => string;
            /**
                * Instantiates a glTF file loader plugin.
                * @returns the created plugin
                */
            createPlugin(): ISceneLoaderPlugin | ISceneLoaderPluginAsync;
            /**
                * The loader state or null if the loader is not active.
                */
            readonly loaderState: Nullable<GLTFLoaderState>;
            /**
                * Returns a promise that resolves when the asset is completely loaded.
                * @returns a promise that resolves when the asset is completely loaded.
                */
            whenCompleteAsync(): Promise<void>;
            /** @hidden */
            _log: (message: string) => void;
            /** @hidden */
            _logOpen(message: string): void;
            /** @hidden */
            _logClose(): void;
            /** @hidden */
            _startPerformanceCounter: (counterName: string) => void;
            /** @hidden */
            _endPerformanceCounter: (counterName: string) => void;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0' {
    export * from "babylonjs-loaders/src/glTF/1.0/glTFBinaryExtension";
    export * from "babylonjs-loaders/src/glTF/1.0/glTFLoader";
    export * from "babylonjs-loaders/src/glTF/1.0/glTFLoaderExtension";
    export * from "babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces";
    export * from "babylonjs-loaders/src/glTF/1.0/glTFLoaderUtils";
    export * from "babylonjs-loaders/src/glTF/1.0/glTFMaterialsCommonExtension";
}

declare module 'babylonjs-loaders/src/glTF/2.0' {
    export * from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    export * from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    export * from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions";
}

declare module 'babylonjs-loaders/src/OBJ/objFileLoader' {
    import { StandardMaterial, Scene, ISceneLoaderPluginAsync, SceneLoaderProgressEvent, AbstractMesh, IParticleSystem, Skeleton, AnimationGroup, AssetContainer } from "babylonjs";
    /**
        * Class reading and parsing the MTL file bundled with the obj file.
        */
    export class MTLFileLoader {
            /**
                * All material loaded from the mtl will be set here
                */
            materials: StandardMaterial[];
            /**
                * This function will read the mtl file and create each material described inside
                * This function could be improve by adding :
                * -some component missing (Ni, Tf...)
                * -including the specific options available
                *
                * @param scene defines the scene the material will be created in
                * @param data defines the mtl data to parse
                * @param rootUrl defines the rooturl to use in order to load relative dependencies
                */
            parseMTL(scene: Scene, data: string | ArrayBuffer, rootUrl: string): void;
    }
    /**
        * OBJ file type loader.
        * This is a babylon scene loader plugin.
        */
    export class OBJFileLoader implements ISceneLoaderPluginAsync {
            /**
                * Defines if UVs are optimized by default during load.
                */
            static OPTIMIZE_WITH_UV: boolean;
            /**
                * Defines if Y is inverted by default during load.
                */
            static INVERT_Y: boolean;
            /**
                * Defines the name of the plugin.
                */
            name: string;
            /**
                * Defines the extension the plugin is able to load.
                */
            extensions: string;
            /** @hidden */
            obj: RegExp;
            /** @hidden */
            group: RegExp;
            /** @hidden */
            mtllib: RegExp;
            /** @hidden */
            usemtl: RegExp;
            /** @hidden */
            smooth: RegExp;
            /** @hidden */
            vertexPattern: RegExp;
            /** @hidden */
            normalPattern: RegExp;
            /** @hidden */
            uvPattern: RegExp;
            /** @hidden */
            facePattern1: RegExp;
            /** @hidden */
            facePattern2: RegExp;
            /** @hidden */
            facePattern3: RegExp;
            /** @hidden */
            facePattern4: RegExp;
            /** @hidden */
            facePattern5: RegExp;
            /**
                * Imports one or more meshes from the loaded glTF data and adds them to the scene
                * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
                * @param scene the scene the meshes should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise containg the loaded meshes, particles, skeletons and animations
                */
            importMeshAsync(meshesNames: any, scene: Scene, data: any, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<{
                    meshes: AbstractMesh[];
                    particleSystems: IParticleSystem[];
                    skeletons: Skeleton[];
                    animationGroups: AnimationGroup[];
            }>;
            /**
                * Imports all objects from the loaded glTF data and adds them to the scene
                * @param scene the scene the objects should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise which completes when objects have been loaded to the scene
                */
            loadAsync(scene: Scene, data: string, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
            /**
                * Load into an asset container.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onProgress The callback when the load progresses
                * @param fileName Defines the name of the file to load
                * @returns The loaded asset container
                */
            loadAssetContainerAsync(scene: Scene, data: string, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<AssetContainer>;
    }
}

declare module 'babylonjs-loaders/src/STL/stlFileLoader' {
    import { ISceneLoaderPlugin, ISceneLoaderPluginExtensions, Scene, Nullable, AbstractMesh, IParticleSystem, Skeleton, AssetContainer } from "babylonjs";
    /**
        * STL file type loader.
        * This is a babylon scene loader plugin.
        */
    export class STLFileLoader implements ISceneLoaderPlugin {
            /** @hidden */
            solidPattern: RegExp;
            /** @hidden */
            facetsPattern: RegExp;
            /** @hidden */
            normalPattern: RegExp;
            /** @hidden */
            vertexPattern: RegExp;
            /**
                * Defines the name of the plugin.
                */
            name: string;
            /**
                * Defines the extensions the stl loader is able to load.
                * force data to come in as an ArrayBuffer
                * we'll convert to string if it looks like it's an ASCII .stl
                */
            extensions: ISceneLoaderPluginExtensions;
            /**
                * Import meshes into a scene.
                * @param meshesNames An array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
                * @param scene The scene to import into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param meshes The meshes array to import into
                * @param particleSystems The particle systems array to import into
                * @param skeletons The skeletons array to import into
                * @param onError The callback when import fails
                * @returns True if successful or false otherwise
                */
            importMesh(meshesNames: any, scene: Scene, data: any, rootUrl: string, meshes: Nullable<AbstractMesh[]>, particleSystems: Nullable<IParticleSystem[]>, skeletons: Nullable<Skeleton[]>): boolean;
            /**
                * Load into a scene.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onError The callback when import fails
                * @returns true if successful or false otherwise
                */
            load(scene: Scene, data: any, rootUrl: string): boolean;
            /**
                * Load into an asset container.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onError The callback when import fails
                * @returns The loaded asset container
                */
            loadAssetContainer(scene: Scene, data: string, rootUrl: string, onError?: (message: string, exception?: any) => void): AssetContainer;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0/glTFBinaryExtension' {
    import { GLTFLoaderExtension } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderExtension";
    import { Scene } from "babylonjs";
    import { IGLTFLoaderData } from "babylonjs-loaders/src/glTF/glTFFileLoader";
    import { IGLTFRuntime } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces";
    /** @hidden */
    export class GLTFBinaryExtension extends GLTFLoaderExtension {
        constructor();
        loadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess: (gltfRuntime: IGLTFRuntime) => void, onError: (message: string) => void): boolean;
        loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void, onError: (message: string) => void): boolean;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0/glTFLoader' {
    import { IGLTFRuntime } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces";
    import { Nullable, Skeleton, Material, AbstractMesh, Texture, Scene, SceneLoaderProgressEvent, IParticleSystem, AnimationGroup } from "babylonjs";
    import { IGLTFLoader, GLTFLoaderState, IGLTFLoaderData } from "babylonjs-loaders/src/glTF/glTFFileLoader";
    import { GLTFLoaderExtension } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderExtension";
    /**
     * Implementation of the base glTF spec
     * @hidden
     */
    export class GLTFLoaderBase {
        static CreateRuntime(parsedData: any, scene: Scene, rootUrl: string): IGLTFRuntime;
        static LoadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): void;
        static LoadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: Nullable<ArrayBufferView>) => void, onError: (message: string) => void): void;
        static CreateTextureAsync(gltfRuntime: IGLTFRuntime, id: string, buffer: Nullable<ArrayBufferView>, onSuccess: (texture: Texture) => void, onError: (message: string) => void): void;
        static LoadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string | ArrayBuffer) => void, onError?: (message: string) => void): void;
        static LoadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): void;
    }
    /**
     * glTF V1 Loader
     * @hidden
     */
    export class GLTFLoader implements IGLTFLoader {
        static Extensions: {
            [name: string]: GLTFLoaderExtension;
        };
        static RegisterExtension(extension: GLTFLoaderExtension): void;
        state: Nullable<GLTFLoaderState>;
        dispose(): void;
        /**
         * Imports one or more meshes from a loaded gltf file and adds them to the scene
         * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
         * @param scene the scene the meshes should be added to
         * @param data gltf data containing information of the meshes in a loaded file
         * @param rootUrl root url to load from
         * @param onProgress event that fires when loading progress has occured
         * @returns a promise containg the loaded meshes, particles, skeletons and animations
         */
        importMeshAsync(meshesNames: any, scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void): Promise<{
            meshes: AbstractMesh[];
            particleSystems: IParticleSystem[];
            skeletons: Skeleton[];
            animationGroups: AnimationGroup[];
        }>;
        /**
         * Imports all objects from a loaded gltf file and adds them to the scene
         * @param scene the scene the objects should be added to
         * @param data gltf data containing information of the meshes in a loaded file
         * @param rootUrl root url to load from
         * @param onProgress event that fires when loading progress has occured
         * @returns a promise which completes when objects have been loaded to the scene
         */
        loadAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void): Promise<void>;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0/glTFLoaderExtension' {
    import { Scene, Texture, Material } from "babylonjs";
    import { IGLTFLoaderData } from "babylonjs-loaders/src/glTF/glTFFileLoader";
    import { IGLTFRuntime } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces";
    /** @hidden */
    export abstract class GLTFLoaderExtension {
            constructor(name: string);
            readonly name: string;
            /**
             * Defines an override for loading the runtime
             * Return true to stop further extensions from loading the runtime
             */
            loadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess?: (gltfRuntime: IGLTFRuntime) => void, onError?: (message: string) => void): boolean;
            /**
                * Defines an onverride for creating gltf runtime
                * Return true to stop further extensions from creating the runtime
                */
            loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError?: (message: string) => void): boolean;
            /**
             * Defines an override for loading buffers
             * Return true to stop further extensions from loading this buffer
             */
            loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): boolean;
            /**
             * Defines an override for loading texture buffers
             * Return true to stop further extensions from loading this texture data
             */
            loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
            /**
             * Defines an override for creating textures
             * Return true to stop further extensions from loading this texture
             */
            createTextureAsync(gltfRuntime: IGLTFRuntime, id: string, buffer: ArrayBufferView, onSuccess: (texture: Texture) => void, onError: (message: string) => void): boolean;
            /**
             * Defines an override for loading shader strings
             * Return true to stop further extensions from loading this shader data
             */
            loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void, onError: (message: string) => void): boolean;
            /**
             * Defines an override for loading materials
             * Return true to stop further extensions from loading this material
             */
            loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): boolean;
            static LoadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess?: (gltfRuntime: IGLTFRuntime) => void, onError?: (message: string) => void): void;
            static LoadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError?: (message: string) => void): void;
            static LoadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (bufferView: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): void;
            static LoadTextureAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (texture: Texture) => void, onError: (message: string) => void): void;
            static LoadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderData: string | ArrayBuffer) => void, onError: (message: string) => void): void;
            static LoadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): void;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces' {
    import { Texture, Skeleton, Scene, Bone, Node } from "babylonjs";
    /**
     * Enums
     * @hidden
     */
    export enum EComponentType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        FLOAT = 5126
    }
    /** @hidden */
    export enum EShaderType {
        FRAGMENT = 35632,
        VERTEX = 35633
    }
    /** @hidden */
    export enum EParameterType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        INT = 5124,
        UNSIGNED_INT = 5125,
        FLOAT = 5126,
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678
    }
    /** @hidden */
    export enum ETextureWrapMode {
        CLAMP_TO_EDGE = 33071,
        MIRRORED_REPEAT = 33648,
        REPEAT = 10497
    }
    /** @hidden */
    export enum ETextureFilterType {
        NEAREST = 9728,
        LINEAR = 9728,
        NEAREST_MIPMAP_NEAREST = 9984,
        LINEAR_MIPMAP_NEAREST = 9985,
        NEAREST_MIPMAP_LINEAR = 9986,
        LINEAR_MIPMAP_LINEAR = 9987
    }
    /** @hidden */
    export enum ETextureFormat {
        ALPHA = 6406,
        RGB = 6407,
        RGBA = 6408,
        LUMINANCE = 6409,
        LUMINANCE_ALPHA = 6410
    }
    /** @hidden */
    export enum ECullingType {
        FRONT = 1028,
        BACK = 1029,
        FRONT_AND_BACK = 1032
    }
    /** @hidden */
    export enum EBlendingFunction {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        SRC_ALPHA_SATURATE = 776
    }
    /** @hidden */
    export interface IGLTFProperty {
        extensions?: {
            [key: string]: any;
        };
        extras?: Object;
    }
    /** @hidden */
    export interface IGLTFChildRootProperty extends IGLTFProperty {
        name?: string;
    }
    /** @hidden */
    export interface IGLTFAccessor extends IGLTFChildRootProperty {
        bufferView: string;
        byteOffset: number;
        byteStride: number;
        count: number;
        type: string;
        componentType: EComponentType;
        max?: number[];
        min?: number[];
        name?: string;
    }
    /** @hidden */
    export interface IGLTFBufferView extends IGLTFChildRootProperty {
        buffer: string;
        byteOffset: number;
        byteLength: number;
        byteStride: number;
        target?: number;
    }
    /** @hidden */
    export interface IGLTFBuffer extends IGLTFChildRootProperty {
        uri: string;
        byteLength?: number;
        type?: string;
    }
    /** @hidden */
    export interface IGLTFShader extends IGLTFChildRootProperty {
        uri: string;
        type: EShaderType;
    }
    /** @hidden */
    export interface IGLTFProgram extends IGLTFChildRootProperty {
        attributes: string[];
        fragmentShader: string;
        vertexShader: string;
    }
    /** @hidden */
    export interface IGLTFTechniqueParameter {
        type: number;
        count?: number;
        semantic?: string;
        node?: string;
        value?: number | boolean | string | Array<any>;
        source?: string;
        babylonValue?: any;
    }
    /** @hidden */
    export interface IGLTFTechniqueCommonProfile {
        lightingModel: string;
        texcoordBindings: Object;
        parameters?: Array<any>;
    }
    /** @hidden */
    export interface IGLTFTechniqueStatesFunctions {
        blendColor?: number[];
        blendEquationSeparate?: number[];
        blendFuncSeparate?: number[];
        colorMask: boolean[];
        cullFace: number[];
    }
    /** @hidden */
    export interface IGLTFTechniqueStates {
        enable: number[];
        functions: IGLTFTechniqueStatesFunctions;
    }
    /** @hidden */
    export interface IGLTFTechnique extends IGLTFChildRootProperty {
        parameters: {
            [key: string]: IGLTFTechniqueParameter;
        };
        program: string;
        attributes: {
            [key: string]: string;
        };
        uniforms: {
            [key: string]: string;
        };
        states: IGLTFTechniqueStates;
    }
    /** @hidden */
    export interface IGLTFMaterial extends IGLTFChildRootProperty {
        technique?: string;
        values: string[];
    }
    /** @hidden */
    export interface IGLTFMeshPrimitive extends IGLTFProperty {
        attributes: {
            [key: string]: string;
        };
        indices: string;
        material: string;
        mode?: number;
    }
    /** @hidden */
    export interface IGLTFMesh extends IGLTFChildRootProperty {
        primitives: IGLTFMeshPrimitive[];
    }
    /** @hidden */
    export interface IGLTFImage extends IGLTFChildRootProperty {
        uri: string;
    }
    /** @hidden */
    export interface IGLTFSampler extends IGLTFChildRootProperty {
        magFilter?: number;
        minFilter?: number;
        wrapS?: number;
        wrapT?: number;
    }
    /** @hidden */
    export interface IGLTFTexture extends IGLTFChildRootProperty {
        sampler: string;
        source: string;
        format?: ETextureFormat;
        internalFormat?: ETextureFormat;
        target?: number;
        type?: number;
        babylonTexture?: Texture;
    }
    /** @hidden */
    export interface IGLTFAmbienLight {
        color?: number[];
    }
    /** @hidden */
    export interface IGLTFDirectionalLight {
        color?: number[];
    }
    /** @hidden */
    export interface IGLTFPointLight {
        color?: number[];
        constantAttenuation?: number;
        linearAttenuation?: number;
        quadraticAttenuation?: number;
    }
    /** @hidden */
    export interface IGLTFSpotLight {
        color?: number[];
        constantAttenuation?: number;
        fallOfAngle?: number;
        fallOffExponent?: number;
        linearAttenuation?: number;
        quadraticAttenuation?: number;
    }
    /** @hidden */
    export interface IGLTFLight extends IGLTFChildRootProperty {
        type: string;
    }
    /** @hidden */
    export interface IGLTFCameraOrthographic {
        xmag: number;
        ymag: number;
        zfar: number;
        znear: number;
    }
    /** @hidden */
    export interface IGLTFCameraPerspective {
        aspectRatio: number;
        yfov: number;
        zfar: number;
        znear: number;
    }
    /** @hidden */
    export interface IGLTFCamera extends IGLTFChildRootProperty {
        type: string;
    }
    /** @hidden */
    export interface IGLTFAnimationChannelTarget {
        id: string;
        path: string;
    }
    /** @hidden */
    export interface IGLTFAnimationChannel {
        sampler: string;
        target: IGLTFAnimationChannelTarget;
    }
    /** @hidden */
    export interface IGLTFAnimationSampler {
        input: string;
        output: string;
        interpolation?: string;
    }
    /** @hidden */
    export interface IGLTFAnimation extends IGLTFChildRootProperty {
        channels?: IGLTFAnimationChannel[];
        parameters?: {
            [key: string]: string;
        };
        samplers?: {
            [key: string]: IGLTFAnimationSampler;
        };
    }
    /** @hidden */
    export interface IGLTFNodeInstanceSkin {
        skeletons: string[];
        skin: string;
        meshes: string[];
    }
    /** @hidden */
    export interface IGLTFSkins extends IGLTFChildRootProperty {
        bindShapeMatrix: number[];
        inverseBindMatrices: string;
        jointNames: string[];
        babylonSkeleton?: Skeleton;
    }
    /** @hidden */
    export interface IGLTFNode extends IGLTFChildRootProperty {
        camera?: string;
        children: string[];
        skin?: string;
        jointName?: string;
        light?: string;
        matrix: number[];
        mesh?: string;
        meshes?: string[];
        rotation?: number[];
        scale?: number[];
        translation?: number[];
        babylonNode?: Node;
    }
    /** @hidden */
    export interface IGLTFScene extends IGLTFChildRootProperty {
        nodes: string[];
    }
    /** @hidden */
    export interface IGLTFRuntime {
        extensions: {
            [key: string]: any;
        };
        accessors: {
            [key: string]: IGLTFAccessor;
        };
        buffers: {
            [key: string]: IGLTFBuffer;
        };
        bufferViews: {
            [key: string]: IGLTFBufferView;
        };
        meshes: {
            [key: string]: IGLTFMesh;
        };
        lights: {
            [key: string]: IGLTFLight;
        };
        cameras: {
            [key: string]: IGLTFCamera;
        };
        nodes: {
            [key: string]: IGLTFNode;
        };
        images: {
            [key: string]: IGLTFImage;
        };
        textures: {
            [key: string]: IGLTFTexture;
        };
        shaders: {
            [key: string]: IGLTFShader;
        };
        programs: {
            [key: string]: IGLTFProgram;
        };
        samplers: {
            [key: string]: IGLTFSampler;
        };
        techniques: {
            [key: string]: IGLTFTechnique;
        };
        materials: {
            [key: string]: IGLTFMaterial;
        };
        animations: {
            [key: string]: IGLTFAnimation;
        };
        skins: {
            [key: string]: IGLTFSkins;
        };
        currentScene?: Object;
        scenes: {
            [key: string]: IGLTFScene;
        };
        extensionsUsed: string[];
        extensionsRequired?: string[];
        buffersCount: number;
        shaderscount: number;
        scene: Scene;
        rootUrl: string;
        loadedBufferCount: number;
        loadedBufferViews: {
            [name: string]: ArrayBufferView;
        };
        loadedShaderCount: number;
        importOnlyMeshes: boolean;
        importMeshesNames?: string[];
        dummyNodes: Node[];
    }
    /** @hidden */
    export interface INodeToRoot {
        bone: Bone;
        node: IGLTFNode;
        id: string;
    }
    /** @hidden */
    export interface IJointNode {
        node: IGLTFNode;
        id: string;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0/glTFLoaderUtils' {
    import { Scene, ShaderMaterial, Effect, Node } from "babylonjs";
    import { IGLTFTechniqueParameter, IGLTFAccessor, ETextureFilterType, IGLTFRuntime, IGLTFBufferView, EComponentType } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces";
    /**
     * Utils functions for GLTF
     * @hidden
     */
    export class GLTFUtils {
            /**
                * Sets the given "parameter" matrix
                * @param scene: the Scene object
                * @param source: the source node where to pick the matrix
                * @param parameter: the GLTF technique parameter
                * @param uniformName: the name of the shader's uniform
                * @param shaderMaterial: the shader material
                */
            static SetMatrix(scene: Scene, source: Node, parameter: IGLTFTechniqueParameter, uniformName: string, shaderMaterial: ShaderMaterial | Effect): void;
            /**
                * Sets the given "parameter" matrix
                * @param shaderMaterial: the shader material
                * @param uniform: the name of the shader's uniform
                * @param value: the value of the uniform
                * @param type: the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
                */
            static SetUniform(shaderMaterial: ShaderMaterial | Effect, uniform: string, value: any, type: number): boolean;
            /**
             * Returns the wrap mode of the texture
             * @param mode: the mode value
             */
            static GetWrapMode(mode: number): number;
            /**
                * Returns the byte stride giving an accessor
                * @param accessor: the GLTF accessor objet
                */
            static GetByteStrideFromType(accessor: IGLTFAccessor): number;
            /**
                * Returns the texture filter mode giving a mode value
                * @param mode: the filter mode value
                */
            static GetTextureFilterMode(mode: number): ETextureFilterType;
            static GetBufferFromBufferView(gltfRuntime: IGLTFRuntime, bufferView: IGLTFBufferView, byteOffset: number, byteLength: number, componentType: EComponentType): ArrayBufferView;
            /**
                * Returns a buffer from its accessor
                * @param gltfRuntime: the GLTF runtime
                * @param accessor: the GLTF accessor
                */
            static GetBufferFromAccessor(gltfRuntime: IGLTFRuntime, accessor: IGLTFAccessor): any;
            /**
                * Decodes a buffer view into a string
                * @param view: the buffer view
                */
            static DecodeBufferToText(view: ArrayBufferView): string;
            /**
                * Returns the default material of gltf. Related to
                * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
                * @param scene: the Babylon.js scene
                */
            static GetDefaultMaterial(scene: Scene): ShaderMaterial;
    }
}

declare module 'babylonjs-loaders/src/glTF/1.0/glTFMaterialsCommonExtension' {
    import { GLTFLoaderExtension } from "babylonjs-loaders/src/glTF/1.0";
    import { IGLTFRuntime } from "babylonjs-loaders/src/glTF/1.0/glTFLoaderInterfaces";
    import { Material } from "babylonjs";
    /** @hidden */
    export class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
        constructor();
        loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError: (message: string) => void): boolean;
        loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): boolean;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/glTFLoader' {
    import { Scene, Nullable, Mesh, Material, SceneLoaderProgressEvent, AbstractMesh, IParticleSystem, Skeleton, AnimationGroup, Camera, BaseTexture } from "babylonjs";
    import { IProperty } from "babylonjs-gltf2interface";
    import { IGLTF, INode, IScene, ICamera, IAnimation, IBufferView, IMaterial, ITextureInfo, IImage, IArrayItem } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { IGLTFLoader, GLTFFileLoader, GLTFLoaderState, IGLTFLoaderData } from "babylonjs-loaders/src/glTF/glTFFileLoader";
    /**
        * Helper class for working with arrays when loading the glTF asset
        */
    export class ArrayItem {
            /**
                * Gets an item from the given array.
                * @param context The context when loading the asset
                * @param array The array to get the item from
                * @param index The index to the array
                * @returns The array item
                */
            static Get<T>(context: string, array: ArrayLike<T> | undefined, index: number | undefined): T;
            /**
                * Assign an `index` field to each item of the given array.
                * @param array The array of items
                */
            static Assign(array?: IArrayItem[]): void;
    }
    /**
        * The glTF 2.0 loader
        */
    export class GLTFLoader implements IGLTFLoader {
            /** The glTF object parsed from the JSON. */
            gltf: IGLTF;
            /** The Babylon scene when loading the asset. */
            babylonScene: Scene;
            /** @hidden */
            _completePromises: Promise<any>[];
            /**
                * Registers a loader extension.
                * @param name The name of the loader extension.
                * @param factory The factory function that creates the loader extension.
                */
            static RegisterExtension(name: string, factory: (loader: GLTFLoader) => IGLTFLoaderExtension): void;
            /**
                * Unregisters a loader extension.
                * @param name The name of the loader extenion.
                * @returns A boolean indicating whether the extension has been unregistered
                */
            static UnregisterExtension(name: string): boolean;
            /**
                * Gets the loader state.
                */
            readonly state: Nullable<GLTFLoaderState>;
            /** @hidden */
            constructor(parent: GLTFFileLoader);
            /** @hidden */
            dispose(): void;
            /** @hidden */
            importMeshAsync(meshesNames: any, scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<{
                    meshes: AbstractMesh[];
                    particleSystems: IParticleSystem[];
                    skeletons: Skeleton[];
                    animationGroups: AnimationGroup[];
            }>;
            /** @hidden */
            loadAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: SceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
            /**
                * Loads a glTF scene.
                * @param context The context when loading the asset
                * @param scene The glTF scene property
                * @returns A promise that resolves when the load is complete
                */
            loadSceneAsync(context: string, scene: IScene): Promise<void>;
            /**
                * Loads a glTF node.
                * @param context The context when loading the asset
                * @param node The glTF node property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon mesh when the load is complete
                */
            loadNodeAsync(context: string, node: INode, assign?: (babylonMesh: Mesh) => void): Promise<Mesh>;
            /**
                * Loads a glTF camera.
                * @param context The context when loading the asset
                * @param camera The glTF camera property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon camera when the load is complete
                */
            loadCameraAsync(context: string, camera: ICamera, assign?: (babylonCamera: Camera) => void): Promise<Camera>;
            /**
                * Loads a glTF animation.
                * @param context The context when loading the asset
                * @param animation The glTF animation property
                * @returns A promise that resolves with the loaded Babylon animation group when the load is complete
                */
            loadAnimationAsync(context: string, animation: IAnimation): Promise<AnimationGroup>;
            /**
                * Loads a glTF buffer view.
                * @param context The context when loading the asset
                * @param bufferView The glTF buffer view property
                * @returns A promise that resolves with the loaded data when the load is complete
                */
            loadBufferViewAsync(context: string, bufferView: IBufferView): Promise<ArrayBufferView>;
            /** @hidden */
            _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: Mesh, babylonDrawMode: number, assign?: (babylonMaterial: Material) => void): Promise<Material>;
            /**
                * Creates a Babylon material from a glTF material.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonDrawMode The draw mode for the Babylon material
                * @returns The Babylon material
                */
            createMaterial(context: string, material: IMaterial, babylonDrawMode: number): Material;
            /**
                * Loads properties from a glTF material into a Babylon material.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                * @returns A promise that resolves when the load is complete
                */
            loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Promise<void>;
            /**
                * Loads the normal, occlusion, and emissive properties from a glTF material into a Babylon material.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                * @returns A promise that resolves when the load is complete
                */
            loadMaterialBasePropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Promise<void>;
            /**
                * Loads the alpha properties from a glTF material into a Babylon material.
                * Must be called after the setting the albedo texture of the Babylon material when the material has an albedo texture.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                */
            loadMaterialAlphaProperties(context: string, material: IMaterial, babylonMaterial: Material): void;
            /**
                * Loads a glTF texture info.
                * @param context The context when loading the asset
                * @param textureInfo The glTF texture info property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon texture when the load is complete
                */
            loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign?: (babylonTexture: BaseTexture) => void): Promise<BaseTexture>;
            /**
                * Loads a glTF image.
                * @param context The context when loading the asset
                * @param image The glTF image property
                * @returns A promise that resolves with the loaded data when the load is complete
                */
            loadImageAsync(context: string, image: IImage): Promise<ArrayBufferView>;
            /**
                * Loads a glTF uri.
                * @param context The context when loading the asset
                * @param uri The base64 or relative uri
                * @returns A promise that resolves with the loaded data when the load is complete
                */
            loadUriAsync(context: string, uri: string): Promise<ArrayBufferView>;
            /**
                * Helper method called by a loader extension to load an glTF extension.
                * @param context The context when loading the asset
                * @param property The glTF property to load the extension from
                * @param extensionName The name of the extension to load
                * @param actionAsync The action to run
                * @returns The promise returned by actionAsync or null if the extension does not exist
                */
            static LoadExtensionAsync<TExtension = any, TResult = void>(context: string, property: IProperty, extensionName: string, actionAsync: (extensionContext: string, extension: TExtension) => Nullable<Promise<TResult>>): Nullable<Promise<TResult>>;
            /**
                * Helper method called by a loader extension to load a glTF extra.
                * @param context The context when loading the asset
                * @param property The glTF property to load the extra from
                * @param extensionName The name of the extension to load
                * @param actionAsync The action to run
                * @returns The promise returned by actionAsync or null if the extra does not exist
                */
            static LoadExtraAsync<TExtra = any, TResult = void>(context: string, property: IProperty, extensionName: string, actionAsync: (extraContext: string, extra: TExtra) => Nullable<Promise<TResult>>): Nullable<Promise<TResult>>;
            /**
                * Increments the indentation level and logs a message.
                * @param message The message to log
                */
            logOpen(message: string): void;
            /**
                * Decrements the indentation level.
                */
            logClose(): void;
            /**
                * Logs a message
                * @param message The message to log
                */
            log(message: string): void;
            /**
                * Starts a performance counter.
                * @param counterName The name of the performance counter
                */
            startPerformanceCounter(counterName: string): void;
            /**
                * Ends a performance counter.
                * @param counterName The name of the performance counter
                */
            endPerformanceCounter(counterName: string): void;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension' {
    import { IDisposable, Nullable, Mesh, Camera, Geometry, Material, BaseTexture, AnimationGroup } from "babylonjs";
    import { IScene, INode, ICamera, IMeshPrimitive, IMaterial, ITextureInfo, IAnimation } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension as IGLTFBaseLoaderExtension } from "babylonjs-loaders/src/glTF/glTFFileLoader";
    /** @hidden */
    export var __IGLTFLoaderExtension: number;
    /**
        * Interface for a glTF loader extension.
        */
    export interface IGLTFLoaderExtension extends IGLTFBaseLoaderExtension, IDisposable {
            /**
                * Called after the loader state changes to LOADING.
                */
            onLoading?(): void;
            /**
                * Called after the loader state changes to READY.
                */
            onReady?(): void;
            /**
                * Define this method to modify the default behavior when loading scenes.
                * @param context The context when loading the asset
                * @param scene The glTF scene property
                * @returns A promise that resolves when the load is complete or null if not handled
                */
            loadSceneAsync?(context: string, scene: IScene): Nullable<Promise<void>>;
            /**
                * Define this method to modify the default behavior when loading nodes.
                * @param context The context when loading the asset
                * @param node The glTF node property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon mesh when the load is complete or null if not handled
                */
            loadNodeAsync?(context: string, node: INode, assign: (babylonMesh: Mesh) => void): Nullable<Promise<Mesh>>;
            /**
                * Define this method to modify the default behavior when loading cameras.
                * @param context The context when loading the asset
                * @param camera The glTF camera property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon camera when the load is complete or null if not handled
                */
            loadCameraAsync?(context: string, camera: ICamera, assign: (babylonCamera: Camera) => void): Nullable<Promise<Camera>>;
            /**
                * @hidden Define this method to modify the default behavior when loading vertex data for mesh primitives.
                * @param context The context when loading the asset
                * @param primitive The glTF mesh primitive property
                * @returns A promise that resolves with the loaded geometry when the load is complete or null if not handled
                */
            _loadVertexDataAsync?(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh): Nullable<Promise<Geometry>>;
            /**
                * @hidden Define this method to modify the default behavior when loading materials. Load material creates the material and then loads material properties.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon material when the load is complete or null if not handled
                */
            _loadMaterialAsync?(context: string, material: IMaterial, babylonMesh: Mesh, babylonDrawMode: number, assign: (babylonMaterial: Material) => void): Nullable<Promise<Material>>;
            /**
                * Define this method to modify the default behavior when creating materials.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonDrawMode The draw mode for the Babylon material
                * @returns The Babylon material or null if not handled
                */
            createMaterial?(context: string, material: IMaterial, babylonDrawMode: number): Nullable<Material>;
            /**
                * Define this method to modify the default behavior when loading material properties.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                * @returns A promise that resolves when the load is complete or null if not handled
                */
            loadMaterialPropertiesAsync?(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
            /**
                * Define this method to modify the default behavior when loading texture infos.
                * @param context The context when loading the asset
                * @param textureInfo The glTF texture info property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon texture when the load is complete or null if not handled
                */
            loadTextureInfoAsync?(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
            /**
                * Define this method to modify the default behavior when loading animations.
                * @param context The context when loading the asset
                * @param animation The glTF animation property
                * @returns A promise that resolves with the loaded Babylon animation group when the load is complete or null if not handled
                */
            loadAnimationAsync?(context: string, animation: IAnimation): Nullable<Promise<AnimationGroup>>;
            /**
                * Define this method to modify the default behavior when loading uris.
                * @param context The context when loading the asset
                * @param uri The uri to load
                * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
                */
            _loadUriAsync?(context: string, uri: string): Nullable<Promise<ArrayBufferView>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces' {
    import { VertexBuffer, Buffer, AnimationGroup, Material, AbstractMesh, Mesh, Bone, Skeleton } from "babylonjs";
    import * as IGLTF2 from "babylonjs-gltf2interface";
    /** @hidden */
    export var __IGLTFLoaderInterfacesV2: number;
    /**
        * Loader interface with an index field.
        */
    export interface IArrayItem {
            /**
                * The index of this item in the array.
                */
            index: number;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAccessor extends IGLTF2.IAccessor, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
            /** @hidden */
            _babylonVertexBuffer?: Promise<VertexBuffer>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAnimationChannel extends IGLTF2.IAnimationChannel, IArrayItem {
    }
    /** @hidden */
    export interface _IAnimationSamplerData {
            input: Float32Array;
            interpolation: IGLTF2.AnimationSamplerInterpolation;
            output: Float32Array;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAnimationSampler extends IGLTF2.IAnimationSampler, IArrayItem {
            /** @hidden */
            _data?: Promise<_IAnimationSamplerData>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAnimation extends IGLTF2.IAnimation, IArrayItem {
            channels: IAnimationChannel[];
            samplers: IAnimationSampler[];
            /** @hidden */
            _babylonAnimationGroup?: AnimationGroup;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IBuffer extends IGLTF2.IBuffer, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IBufferView extends IGLTF2.IBufferView, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
            /** @hidden */
            _babylonBuffer?: Promise<Buffer>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface ICamera extends IGLTF2.ICamera, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IImage extends IGLTF2.IImage, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterialNormalTextureInfo extends IGLTF2.IMaterialNormalTextureInfo, IGLTF2.ITextureInfo {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterialOcclusionTextureInfo extends IGLTF2.IMaterialOcclusionTextureInfo, IGLTF2.ITextureInfo {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterialPbrMetallicRoughness extends IGLTF2.IMaterialPbrMetallicRoughness {
            baseColorTexture?: ITextureInfo;
            metallicRoughnessTexture?: ITextureInfo;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterial extends IGLTF2.IMaterial, IArrayItem {
            pbrMetallicRoughness?: IMaterialPbrMetallicRoughness;
            normalTexture?: IMaterialNormalTextureInfo;
            occlusionTexture?: IMaterialOcclusionTextureInfo;
            emissiveTexture?: ITextureInfo;
            /** @hidden */
            _babylonData?: {
                    [drawMode: number]: {
                            material: Material;
                            meshes: AbstractMesh[];
                            promise: Promise<void>;
                    };
            };
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMesh extends IGLTF2.IMesh, IArrayItem {
            primitives: IMeshPrimitive[];
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMeshPrimitive extends IGLTF2.IMeshPrimitive, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface INode extends IGLTF2.INode, IArrayItem {
            /**
                * The parent glTF node.
                */
            parent?: INode;
            /** @hidden */
            _babylonMesh?: Mesh;
            /** @hidden */
            _primitiveBabylonMeshes?: Mesh[];
            /** @hidden */
            _babylonBones?: Bone[];
            /** @hidden */
            _numMorphTargets?: number;
    }
    /** @hidden */
    export interface _ISamplerData {
            noMipMaps: boolean;
            samplingMode: number;
            wrapU: number;
            wrapV: number;
    }
    /**
        * Loader interface with additional members.
        */
    export interface ISampler extends IGLTF2.ISampler, IArrayItem {
            /** @hidden */
            _data?: _ISamplerData;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IScene extends IGLTF2.IScene, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface ISkin extends IGLTF2.ISkin, IArrayItem {
            /** @hidden */
            _babylonSkeleton?: Skeleton;
            /** @hidden */
            _promise?: Promise<void>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface ITexture extends IGLTF2.ITexture, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface ITextureInfo extends IGLTF2.ITextureInfo {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IGLTF extends IGLTF2.IGLTF {
            accessors?: IAccessor[];
            animations?: IAnimation[];
            buffers?: IBuffer[];
            bufferViews?: IBufferView[];
            cameras?: ICamera[];
            images?: IImage[];
            materials?: IMaterial[];
            meshes?: IMesh[];
            nodes?: INode[];
            samplers?: ISampler[];
            scenes?: IScene[];
            skins?: ISkin[];
            textures?: ITexture[];
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions' {
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/EXT_lights_image_based";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/KHR_draco_mesh_compression";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/KHR_lights_punctual";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/KHR_materials_pbrSpecularGlossiness";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/KHR_materials_unlit";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/KHR_texture_transform";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_audio_emitter";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_lod";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_minecraftMesh";
    export * from "babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_sRGBFactors";
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/EXT_lights_image_based' {
    import { Nullable } from "babylonjs";
    import { IScene } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/blob/eb3e32332042e04691a5f35103f8c261e50d8f1e/extensions/2.0/Khronos/EXT_lights_image_based/README.md) (Experimental)
      */
    export class EXT_lights_image_based implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): Nullable<Promise<void>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/KHR_draco_mesh_compression' {
    import { Geometry, Mesh, Nullable } from "babylonjs";
    import { IMeshPrimitive } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression)
      */
    export class KHR_draco_mesh_compression implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        _loadVertexDataAsync(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh): Nullable<Promise<Geometry>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/KHR_lights_punctual' {
    import { Mesh, Nullable } from "babylonjs";
    import { INode } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/blob/1048d162a44dbcb05aefc1874bfd423cf60135a6/extensions/2.0/Khronos/KHR_lights_punctual/README.md) (Experimental)
      */
    export class KHR_lights implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonMesh: Mesh) => void): Nullable<Promise<Mesh>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/KHR_materials_pbrSpecularGlossiness' {
    import { Material, Nullable } from "babylonjs";
    import { IMaterial } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness)
      */
    export class KHR_materials_pbrSpecularGlossiness implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/KHR_materials_unlit' {
    import { Material, Nullable } from "babylonjs";
    import { IMaterial } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit)
      */
    export class KHR_materials_unlit implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/KHR_texture_transform' {
    import { BaseTexture, Nullable } from "babylonjs";
    import { ITextureInfo } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_texture_transform/README.md)
      */
    export class KHR_texture_transform implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_audio_emitter' {
    import { Nullable, Mesh, AnimationGroup } from "babylonjs";
    import { IScene, INode, IAnimation } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
      * [Specification](https://github.com/najadojo/glTF/tree/MSFT_audio_emitter/extensions/2.0/Vendor/MSFT_audio_emitter)
      */
    export class MSFT_audio_emitter implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): Nullable<Promise<void>>;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonMesh: Mesh) => void): Nullable<Promise<Mesh>>;
        /** @hidden */
        loadAnimationAsync(context: string, animation: IAnimation): Nullable<Promise<AnimationGroup>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_lod' {
    import { Observable, Nullable, Mesh, Material } from "babylonjs";
    import { INode, IMaterial } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /**
        * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_lod)
        */
    export class MSFT_lod implements IGLTFLoaderExtension {
            /** The name of this extension. */
            readonly name: string;
            /** Defines whether this extension is enabled. */
            enabled: boolean;
            /**
                * Maximum number of LODs to load, starting from the lowest LOD.
                */
            maxLODsToLoad: number;
            /**
                * Observable raised when all node LODs of one level are loaded.
                * The event data is the index of the loaded LOD starting from zero.
                * Dispose the loader to cancel the loading of the next level of LODs.
                */
            onNodeLODsLoadedObservable: Observable<number>;
            /**
                * Observable raised when all material LODs of one level are loaded.
                * The event data is the index of the loaded LOD starting from zero.
                * Dispose the loader to cancel the loading of the next level of LODs.
                */
            onMaterialLODsLoadedObservable: Observable<number>;
            /** @hidden */
            constructor(loader: GLTFLoader);
            /** @hidden */
            dispose(): void;
            /** @hidden */
            onReady(): void;
            /** @hidden */
            loadNodeAsync(context: string, node: INode, assign: (babylonMesh: Mesh) => void): Nullable<Promise<Mesh>>;
            /** @hidden */
            _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: Mesh, babylonDrawMode: number, assign: (babylonMaterial: Material) => void): Nullable<Promise<Material>>;
            /** @hidden */
            _loadUriAsync(context: string, uri: string): Nullable<Promise<ArrayBufferView>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_minecraftMesh' {
    import { Material, Nullable } from "babylonjs";
    import { IMaterial } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /** @hidden */
    export class MSFT_minecraftMesh implements IGLTFLoaderExtension {
        readonly name: string;
        enabled: boolean;
        constructor(loader: GLTFLoader);
        dispose(): void;
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    }
}

declare module 'babylonjs-loaders/src/glTF/2.0/Extensions/MSFT_sRGBFactors' {
    import { Material, Nullable } from "babylonjs";
    import { IMaterial } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderInterfaces";
    import { IGLTFLoaderExtension } from "babylonjs-loaders/src/glTF/2.0/glTFLoaderExtension";
    import { GLTFLoader } from "babylonjs-loaders/src/glTF/2.0/glTFLoader";
    /** @hidden */
    export class MSFT_sRGBFactors implements IGLTFLoaderExtension {
        readonly name: string;
        enabled: boolean;
        constructor(loader: GLTFLoader);
        dispose(): void;
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    }
}


/*BabylonJS Loaders*/
// Dependencies for this module:
//   ../../../../Tools/Gulp/babylonjs
//   ../../../../Tools/Gulp/babylonjs-gltf2interface
declare module BABYLON {
    /**
        * Mode that determines the coordinate system to use.
        */
    export enum GLTFLoaderCoordinateSystemMode {
            /**
                * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
                */
            AUTO = 0,
            /**
                * Sets the useRightHandedSystem flag on the scene.
                */
            FORCE_RIGHT_HANDED = 1
    }
    /**
        * Mode that determines what animations will start.
        */
    export enum GLTFLoaderAnimationStartMode {
            /**
                * No animation will start.
                */
            NONE = 0,
            /**
                * The first animation will start.
                */
            FIRST = 1,
            /**
                * All animations will start.
                */
            ALL = 2
    }
    /**
        * Interface that contains the data for the glTF asset.
        */
    export interface IGLTFLoaderData {
            /**
                * Object that represents the glTF JSON.
                */
            json: Object;
            /**
                * The BIN chunk of a binary glTF.
                */
            bin: BABYLON.Nullable<ArrayBufferView>;
    }
    /**
        * Interface for extending the loader.
        */
    export interface IGLTFLoaderExtension {
            /**
                * The name of this extension.
                */
            readonly name: string;
            /**
                * Defines whether this extension is enabled.
                */
            enabled: boolean;
    }
    /**
        * Loader state.
        */
    export enum GLTFLoaderState {
            /**
                * The asset is loading.
                */
            LOADING = 0,
            /**
                * The asset is ready for rendering.
                */
            READY = 1,
            /**
                * The asset is completely loaded.
                */
            COMPLETE = 2
    }
    /** @hidden */
    export interface IGLTFLoader extends BABYLON.IDisposable {
            readonly state: BABYLON.Nullable<GLTFLoaderState>;
            importMeshAsync: (meshesNames: any, scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string) => Promise<{
                    meshes: BABYLON.AbstractMesh[];
                    particleSystems: BABYLON.IParticleSystem[];
                    skeletons: BABYLON.Skeleton[];
                    animationGroups: BABYLON.AnimationGroup[];
            }>;
            loadAsync: (scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string) => Promise<void>;
    }
    /**
        * File loader for loading glTF files into a scene.
        */
    export class GLTFFileLoader implements BABYLON.IDisposable, BABYLON.ISceneLoaderPluginAsync, BABYLON.ISceneLoaderPluginFactory {
            /** @hidden */
            static _CreateGLTF1Loader: (parent: GLTFFileLoader) => IGLTFLoader;
            /** @hidden */
            static _CreateGLTF2Loader: (parent: GLTFFileLoader) => IGLTFLoader;
            /**
                * Raised when the asset has been parsed
                */
            onParsedObservable: BABYLON.Observable<IGLTFLoaderData>;
            /**
                * Raised when the asset has been parsed
                */
            onParsed: (loaderData: IGLTFLoaderData) => void;
            /**
                * Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders.
                * Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled.
                * Defaults to true.
                * @hidden
                */
            static IncrementalLoading: boolean;
            /**
                * Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters.
                * Defaults to false. See https://en.wikipedia.org/wiki/Homogeneous_coordinates.
                * @hidden
                */
            static HomogeneousCoordinates: boolean;
            /**
                * The coordinate system mode. Defaults to AUTO.
                */
            coordinateSystemMode: GLTFLoaderCoordinateSystemMode;
            /**
             * The animation start mode. Defaults to FIRST.
             */
            animationStartMode: GLTFLoaderAnimationStartMode;
            /**
                * Defines if the loader should compile materials before raising the success callback. Defaults to false.
                */
            compileMaterials: boolean;
            /**
                * Defines if the loader should also compile materials with clip planes. Defaults to false.
                */
            useClipPlane: boolean;
            /**
                * Defines if the loader should compile shadow generators before raising the success callback. Defaults to false.
                */
            compileShadowGenerators: boolean;
            /**
                * Defines if the Alpha blended materials are only applied as coverage.
                * If false, (default) The luminance of each pixel will reduce its opacity to simulate the behaviour of most physical materials.
                * If true, no extra effects are applied to transparent pixels.
                */
            transparencyAsCoverage: boolean;
            /**
                * Function called before loading a url referenced by the asset.
                */
            preprocessUrlAsync: (url: string) => Promise<string>;
            /**
                * BABYLON.Observable raised when the loader creates a mesh after parsing the glTF properties of the mesh.
                */
            readonly onMeshLoadedObservable: BABYLON.Observable<BABYLON.AbstractMesh>;
            /**
                * Callback raised when the loader creates a mesh after parsing the glTF properties of the mesh.
                */
            onMeshLoaded: (mesh: BABYLON.AbstractMesh) => void;
            /**
                * BABYLON.Observable raised when the loader creates a texture after parsing the glTF properties of the texture.
                */
            readonly onTextureLoadedObservable: BABYLON.Observable<BABYLON.BaseTexture>;
            /**
                * Callback raised when the loader creates a texture after parsing the glTF properties of the texture.
                */
            onTextureLoaded: (texture: BABYLON.BaseTexture) => void;
            /**
                * BABYLON.Observable raised when the loader creates a material after parsing the glTF properties of the material.
                */
            readonly onMaterialLoadedObservable: BABYLON.Observable<BABYLON.Material>;
            /**
                * Callback raised when the loader creates a material after parsing the glTF properties of the material.
                */
            onMaterialLoaded: (material: BABYLON.Material) => void;
            /**
                * BABYLON.Observable raised when the loader creates a camera after parsing the glTF properties of the camera.
                */
            readonly onCameraLoadedObservable: BABYLON.Observable<BABYLON.Camera>;
            /**
                * Callback raised when the loader creates a camera after parsing the glTF properties of the camera.
                */
            onCameraLoaded: (camera: BABYLON.Camera) => void;
            /**
                * BABYLON.Observable raised when the asset is completely loaded, immediately before the loader is disposed.
                * For assets with LODs, raised when all of the LODs are complete.
                * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
                */
            readonly onCompleteObservable: BABYLON.Observable<void>;
            /**
                * Callback raised when the asset is completely loaded, immediately before the loader is disposed.
                * For assets with LODs, raised when all of the LODs are complete.
                * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
                */
            onComplete: () => void;
            /**
                * BABYLON.Observable raised when an error occurs.
                */
            readonly onErrorObservable: BABYLON.Observable<any>;
            /**
                * Callback raised when an error occurs.
                */
            onError: (reason: any) => void;
            /**
                * BABYLON.Observable raised after the loader is disposed.
                */
            readonly onDisposeObservable: BABYLON.Observable<void>;
            /**
                * Callback raised after the loader is disposed.
                */
            onDispose: () => void;
            /**
                * BABYLON.Observable raised after a loader extension is created.
                * Set additional options for a loader extension in this event.
                */
            readonly onExtensionLoadedObservable: BABYLON.Observable<IGLTFLoaderExtension>;
            /**
                * Callback raised after a loader extension is created.
                */
            onExtensionLoaded: (extension: IGLTFLoaderExtension) => void;
            /**
                * Defines if the loader logging is enabled.
                */
            loggingEnabled: boolean;
            /**
                * Defines if the loader should capture performance counters.
                */
            capturePerformanceCounters: boolean;
            /**
                * Defines if the loader should validate the asset.
                */
            validate: boolean;
            /**
                * BABYLON.Observable raised after validation when validate is set to true. The event data is the result of the validation.
                */
            readonly onValidatedObservable: BABYLON.Observable<BABYLON.GLTF2.IGLTFValidationResults>;
            /**
                * Callback raised after a loader extension is created.
                */
            onValidated: (results: BABYLON.GLTF2.IGLTFValidationResults) => void;
            /**
                * Name of the loader ("gltf")
                */
            name: string;
            /**
                * Supported file extensions of the loader (.gltf, .glb)
                */
            extensions: BABYLON.ISceneLoaderPluginExtensions;
            /**
                * Disposes the loader, releases resources during load, and cancels any outstanding requests.
                */
            dispose(): void;
            /** @hidden */
            _clear(): void;
            /**
                * Imports one or more meshes from the loaded glTF data and adds them to the scene
                * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
                * @param scene the scene the meshes should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise containg the loaded meshes, particles, skeletons and animations
                */
            importMeshAsync(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<{
                    meshes: BABYLON.AbstractMesh[];
                    particleSystems: BABYLON.IParticleSystem[];
                    skeletons: BABYLON.Skeleton[];
                    animationGroups: BABYLON.AnimationGroup[];
            }>;
            /**
                * Imports all objects from the loaded glTF data and adds them to the scene
                * @param scene the scene the objects should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise which completes when objects have been loaded to the scene
                */
            loadAsync(scene: BABYLON.Scene, data: string | ArrayBuffer, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
            /**
                * Load into an asset container.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onProgress The callback when the load progresses
                * @param fileName Defines the name of the file to load
                * @returns The loaded asset container
                */
            loadAssetContainerAsync(scene: BABYLON.Scene, data: string | ArrayBuffer, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<BABYLON.AssetContainer>;
            /**
                * If the data string can be loaded directly.
                * @param data string contianing the file data
                * @returns if the data can be loaded directly
                */
            canDirectLoad(data: string): boolean;
            /**
                * Rewrites a url by combining a root url and response url.
                */
            rewriteRootURL: (rootUrl: string, responseURL?: string) => string;
            /**
                * Instantiates a glTF file loader plugin.
                * @returns the created plugin
                */
            createPlugin(): BABYLON.ISceneLoaderPlugin | BABYLON.ISceneLoaderPluginAsync;
            /**
                * The loader state or null if the loader is not active.
                */
            readonly loaderState: BABYLON.Nullable<GLTFLoaderState>;
            /**
                * Returns a promise that resolves when the asset is completely loaded.
                * @returns a promise that resolves when the asset is completely loaded.
                */
            whenCompleteAsync(): Promise<void>;
            /** @hidden */
            _log: (message: string) => void;
            /** @hidden */
            _logOpen(message: string): void;
            /** @hidden */
            _logClose(): void;
            /** @hidden */
            _startPerformanceCounter: (counterName: string) => void;
            /** @hidden */
            _endPerformanceCounter: (counterName: string) => void;
    }
}
declare module BABYLON {
    /**
        * Class reading and parsing the MTL file bundled with the obj file.
        */
    export class MTLFileLoader {
            /**
                * All material loaded from the mtl will be set here
                */
            materials: BABYLON.StandardMaterial[];
            /**
                * This function will read the mtl file and create each material described inside
                * This function could be improve by adding :
                * -some component missing (Ni, Tf...)
                * -including the specific options available
                *
                * @param scene defines the scene the material will be created in
                * @param data defines the mtl data to parse
                * @param rootUrl defines the rooturl to use in order to load relative dependencies
                */
            parseMTL(scene: BABYLON.Scene, data: string | ArrayBuffer, rootUrl: string): void;
    }
    /**
        * OBJ file type loader.
        * This is a babylon scene loader plugin.
        */
    export class OBJFileLoader implements BABYLON.ISceneLoaderPluginAsync {
            /**
                * Defines if UVs are optimized by default during load.
                */
            static OPTIMIZE_WITH_UV: boolean;
            /**
                * Defines if Y is inverted by default during load.
                */
            static INVERT_Y: boolean;
            /**
                * Defines the name of the plugin.
                */
            name: string;
            /**
                * Defines the extension the plugin is able to load.
                */
            extensions: string;
            /** @hidden */
            obj: RegExp;
            /** @hidden */
            group: RegExp;
            /** @hidden */
            mtllib: RegExp;
            /** @hidden */
            usemtl: RegExp;
            /** @hidden */
            smooth: RegExp;
            /** @hidden */
            vertexPattern: RegExp;
            /** @hidden */
            normalPattern: RegExp;
            /** @hidden */
            uvPattern: RegExp;
            /** @hidden */
            facePattern1: RegExp;
            /** @hidden */
            facePattern2: RegExp;
            /** @hidden */
            facePattern3: RegExp;
            /** @hidden */
            facePattern4: RegExp;
            /** @hidden */
            facePattern5: RegExp;
            /**
                * Imports one or more meshes from the loaded glTF data and adds them to the scene
                * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
                * @param scene the scene the meshes should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise containg the loaded meshes, particles, skeletons and animations
                */
            importMeshAsync(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<{
                    meshes: BABYLON.AbstractMesh[];
                    particleSystems: BABYLON.IParticleSystem[];
                    skeletons: BABYLON.Skeleton[];
                    animationGroups: BABYLON.AnimationGroup[];
            }>;
            /**
                * Imports all objects from the loaded glTF data and adds them to the scene
                * @param scene the scene the objects should be added to
                * @param data the glTF data to load
                * @param rootUrl root url to load from
                * @param onProgress event that fires when loading progress has occured
                * @param fileName Defines the name of the file to load
                * @returns a promise which completes when objects have been loaded to the scene
                */
            loadAsync(scene: BABYLON.Scene, data: string, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
            /**
                * Load into an asset container.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onProgress The callback when the load progresses
                * @param fileName Defines the name of the file to load
                * @returns The loaded asset container
                */
            loadAssetContainerAsync(scene: BABYLON.Scene, data: string, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<BABYLON.AssetContainer>;
    }
}
declare module BABYLON {
    /**
        * STL file type loader.
        * This is a babylon scene loader plugin.
        */
    export class STLFileLoader implements BABYLON.ISceneLoaderPlugin {
            /** @hidden */
            solidPattern: RegExp;
            /** @hidden */
            facetsPattern: RegExp;
            /** @hidden */
            normalPattern: RegExp;
            /** @hidden */
            vertexPattern: RegExp;
            /**
                * Defines the name of the plugin.
                */
            name: string;
            /**
                * Defines the extensions the stl loader is able to load.
                * force data to come in as an ArrayBuffer
                * we'll convert to string if it looks like it's an ASCII .stl
                */
            extensions: BABYLON.ISceneLoaderPluginExtensions;
            /**
                * Import meshes into a scene.
                * @param meshesNames An array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
                * @param scene The scene to import into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param meshes The meshes array to import into
                * @param particleSystems The particle systems array to import into
                * @param skeletons The skeletons array to import into
                * @param onError The callback when import fails
                * @returns True if successful or false otherwise
                */
            importMesh(meshesNames: any, scene: BABYLON.Scene, data: any, rootUrl: string, meshes: BABYLON.Nullable<BABYLON.AbstractMesh[]>, particleSystems: BABYLON.Nullable<BABYLON.IParticleSystem[]>, skeletons: BABYLON.Nullable<BABYLON.Skeleton[]>): boolean;
            /**
                * Load into a scene.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onError The callback when import fails
                * @returns true if successful or false otherwise
                */
            load(scene: BABYLON.Scene, data: any, rootUrl: string): boolean;
            /**
                * Load into an asset container.
                * @param scene The scene to load into
                * @param data The data to import
                * @param rootUrl The root url for scene and resources
                * @param onError The callback when import fails
                * @returns The loaded asset container
                */
            loadAssetContainer(scene: BABYLON.Scene, data: string, rootUrl: string, onError?: (message: string, exception?: any) => void): BABYLON.AssetContainer;
    }
}
declare module BABYLON.GLTF1 {
    /** @hidden */
    export class GLTFBinaryExtension extends GLTFLoaderExtension {
        constructor();
        loadRuntimeAsync(scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess: (gltfRuntime: IGLTFRuntime) => void, onError: (message: string) => void): boolean;
        loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void, onError: (message: string) => void): boolean;
    }
}
declare module BABYLON.GLTF1 {
    /**
     * Implementation of the base glTF spec
     * @hidden
     */
    export class GLTFLoaderBase {
        static CreateRuntime(parsedData: any, scene: BABYLON.Scene, rootUrl: string): IGLTFRuntime;
        static LoadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): void;
        static LoadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: BABYLON.Nullable<ArrayBufferView>) => void, onError: (message: string) => void): void;
        static CreateTextureAsync(gltfRuntime: IGLTFRuntime, id: string, buffer: BABYLON.Nullable<ArrayBufferView>, onSuccess: (texture: BABYLON.Texture) => void, onError: (message: string) => void): void;
        static LoadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string | ArrayBuffer) => void, onError?: (message: string) => void): void;
        static LoadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: BABYLON.Material) => void, onError: (message: string) => void): void;
    }
    /**
     * glTF V1 Loader
     * @hidden
     */
    export class GLTFLoader implements IGLTFLoader {
        static Extensions: {
            [name: string]: GLTFLoaderExtension;
        };
        static RegisterExtension(extension: GLTFLoaderExtension): void;
        state: BABYLON.Nullable<GLTFLoaderState>;
        dispose(): void;
        /**
         * Imports one or more meshes from a loaded gltf file and adds them to the scene
         * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
         * @param scene the scene the meshes should be added to
         * @param data gltf data containing information of the meshes in a loaded file
         * @param rootUrl root url to load from
         * @param onProgress event that fires when loading progress has occured
         * @returns a promise containg the loaded meshes, particles, skeletons and animations
         */
        importMeshAsync(meshesNames: any, scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void): Promise<{
            meshes: BABYLON.AbstractMesh[];
            particleSystems: BABYLON.IParticleSystem[];
            skeletons: BABYLON.Skeleton[];
            animationGroups: BABYLON.AnimationGroup[];
        }>;
        /**
         * Imports all objects from a loaded gltf file and adds them to the scene
         * @param scene the scene the objects should be added to
         * @param data gltf data containing information of the meshes in a loaded file
         * @param rootUrl root url to load from
         * @param onProgress event that fires when loading progress has occured
         * @returns a promise which completes when objects have been loaded to the scene
         */
        loadAsync(scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void): Promise<void>;
    }
}
declare module BABYLON.GLTF1 {
    /** @hidden */
    export abstract class GLTFLoaderExtension {
            constructor(name: string);
            readonly name: string;
            /**
             * Defines an override for loading the runtime
             * Return true to stop further extensions from loading the runtime
             */
            loadRuntimeAsync(scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess?: (gltfRuntime: IGLTFRuntime) => void, onError?: (message: string) => void): boolean;
            /**
                * Defines an onverride for creating gltf runtime
                * Return true to stop further extensions from creating the runtime
                */
            loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError?: (message: string) => void): boolean;
            /**
             * Defines an override for loading buffers
             * Return true to stop further extensions from loading this buffer
             */
            loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): boolean;
            /**
             * Defines an override for loading texture buffers
             * Return true to stop further extensions from loading this texture data
             */
            loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
            /**
             * Defines an override for creating textures
             * Return true to stop further extensions from loading this texture
             */
            createTextureAsync(gltfRuntime: IGLTFRuntime, id: string, buffer: ArrayBufferView, onSuccess: (texture: BABYLON.Texture) => void, onError: (message: string) => void): boolean;
            /**
             * Defines an override for loading shader strings
             * Return true to stop further extensions from loading this shader data
             */
            loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void, onError: (message: string) => void): boolean;
            /**
             * Defines an override for loading materials
             * Return true to stop further extensions from loading this material
             */
            loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: BABYLON.Material) => void, onError: (message: string) => void): boolean;
            static LoadRuntimeAsync(scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess?: (gltfRuntime: IGLTFRuntime) => void, onError?: (message: string) => void): void;
            static LoadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError?: (message: string) => void): void;
            static LoadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (bufferView: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): void;
            static LoadTextureAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (texture: BABYLON.Texture) => void, onError: (message: string) => void): void;
            static LoadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderData: string | ArrayBuffer) => void, onError: (message: string) => void): void;
            static LoadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: BABYLON.Material) => void, onError: (message: string) => void): void;
    }
}
declare module BABYLON.GLTF1 {
    /**
     * Enums
     * @hidden
     */
    export enum EComponentType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        FLOAT = 5126
    }
    /** @hidden */
    export enum EShaderType {
        FRAGMENT = 35632,
        VERTEX = 35633
    }
    /** @hidden */
    export enum EParameterType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        INT = 5124,
        UNSIGNED_INT = 5125,
        FLOAT = 5126,
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678
    }
    /** @hidden */
    export enum ETextureWrapMode {
        CLAMP_TO_EDGE = 33071,
        MIRRORED_REPEAT = 33648,
        REPEAT = 10497
    }
    /** @hidden */
    export enum ETextureFilterType {
        NEAREST = 9728,
        LINEAR = 9728,
        NEAREST_MIPMAP_NEAREST = 9984,
        LINEAR_MIPMAP_NEAREST = 9985,
        NEAREST_MIPMAP_LINEAR = 9986,
        LINEAR_MIPMAP_LINEAR = 9987
    }
    /** @hidden */
    export enum ETextureFormat {
        ALPHA = 6406,
        RGB = 6407,
        RGBA = 6408,
        LUMINANCE = 6409,
        LUMINANCE_ALPHA = 6410
    }
    /** @hidden */
    export enum ECullingType {
        FRONT = 1028,
        BACK = 1029,
        FRONT_AND_BACK = 1032
    }
    /** @hidden */
    export enum EBlendingFunction {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        SRC_ALPHA_SATURATE = 776
    }
    /** @hidden */
    export interface IGLTFProperty {
        extensions?: {
            [key: string]: any;
        };
        extras?: Object;
    }
    /** @hidden */
    export interface IGLTFChildRootProperty extends IGLTFProperty {
        name?: string;
    }
    /** @hidden */
    export interface IGLTFAccessor extends IGLTFChildRootProperty {
        bufferView: string;
        byteOffset: number;
        byteStride: number;
        count: number;
        type: string;
        componentType: EComponentType;
        max?: number[];
        min?: number[];
        name?: string;
    }
    /** @hidden */
    export interface IGLTFBufferView extends IGLTFChildRootProperty {
        buffer: string;
        byteOffset: number;
        byteLength: number;
        byteStride: number;
        target?: number;
    }
    /** @hidden */
    export interface IGLTFBuffer extends IGLTFChildRootProperty {
        uri: string;
        byteLength?: number;
        type?: string;
    }
    /** @hidden */
    export interface IGLTFShader extends IGLTFChildRootProperty {
        uri: string;
        type: EShaderType;
    }
    /** @hidden */
    export interface IGLTFProgram extends IGLTFChildRootProperty {
        attributes: string[];
        fragmentShader: string;
        vertexShader: string;
    }
    /** @hidden */
    export interface IGLTFTechniqueParameter {
        type: number;
        count?: number;
        semantic?: string;
        node?: string;
        value?: number | boolean | string | Array<any>;
        source?: string;
        babylonValue?: any;
    }
    /** @hidden */
    export interface IGLTFTechniqueCommonProfile {
        lightingModel: string;
        texcoordBindings: Object;
        parameters?: Array<any>;
    }
    /** @hidden */
    export interface IGLTFTechniqueStatesFunctions {
        blendColor?: number[];
        blendEquationSeparate?: number[];
        blendFuncSeparate?: number[];
        colorMask: boolean[];
        cullFace: number[];
    }
    /** @hidden */
    export interface IGLTFTechniqueStates {
        enable: number[];
        functions: IGLTFTechniqueStatesFunctions;
    }
    /** @hidden */
    export interface IGLTFTechnique extends IGLTFChildRootProperty {
        parameters: {
            [key: string]: IGLTFTechniqueParameter;
        };
        program: string;
        attributes: {
            [key: string]: string;
        };
        uniforms: {
            [key: string]: string;
        };
        states: IGLTFTechniqueStates;
    }
    /** @hidden */
    export interface IGLTFMaterial extends IGLTFChildRootProperty {
        technique?: string;
        values: string[];
    }
    /** @hidden */
    export interface IGLTFMeshPrimitive extends IGLTFProperty {
        attributes: {
            [key: string]: string;
        };
        indices: string;
        material: string;
        mode?: number;
    }
    /** @hidden */
    export interface IGLTFMesh extends IGLTFChildRootProperty {
        primitives: IGLTFMeshPrimitive[];
    }
    /** @hidden */
    export interface IGLTFImage extends IGLTFChildRootProperty {
        uri: string;
    }
    /** @hidden */
    export interface IGLTFSampler extends IGLTFChildRootProperty {
        magFilter?: number;
        minFilter?: number;
        wrapS?: number;
        wrapT?: number;
    }
    /** @hidden */
    export interface IGLTFTexture extends IGLTFChildRootProperty {
        sampler: string;
        source: string;
        format?: ETextureFormat;
        internalFormat?: ETextureFormat;
        target?: number;
        type?: number;
        babylonTexture?: BABYLON.Texture;
    }
    /** @hidden */
    export interface IGLTFAmbienLight {
        color?: number[];
    }
    /** @hidden */
    export interface IGLTFDirectionalLight {
        color?: number[];
    }
    /** @hidden */
    export interface IGLTFPointLight {
        color?: number[];
        constantAttenuation?: number;
        linearAttenuation?: number;
        quadraticAttenuation?: number;
    }
    /** @hidden */
    export interface IGLTFSpotLight {
        color?: number[];
        constantAttenuation?: number;
        fallOfAngle?: number;
        fallOffExponent?: number;
        linearAttenuation?: number;
        quadraticAttenuation?: number;
    }
    /** @hidden */
    export interface IGLTFLight extends IGLTFChildRootProperty {
        type: string;
    }
    /** @hidden */
    export interface IGLTFCameraOrthographic {
        xmag: number;
        ymag: number;
        zfar: number;
        znear: number;
    }
    /** @hidden */
    export interface IGLTFCameraPerspective {
        aspectRatio: number;
        yfov: number;
        zfar: number;
        znear: number;
    }
    /** @hidden */
    export interface IGLTFCamera extends IGLTFChildRootProperty {
        type: string;
    }
    /** @hidden */
    export interface IGLTFAnimationChannelTarget {
        id: string;
        path: string;
    }
    /** @hidden */
    export interface IGLTFAnimationChannel {
        sampler: string;
        target: IGLTFAnimationChannelTarget;
    }
    /** @hidden */
    export interface IGLTFAnimationSampler {
        input: string;
        output: string;
        interpolation?: string;
    }
    /** @hidden */
    export interface IGLTFAnimation extends IGLTFChildRootProperty {
        channels?: IGLTFAnimationChannel[];
        parameters?: {
            [key: string]: string;
        };
        samplers?: {
            [key: string]: IGLTFAnimationSampler;
        };
    }
    /** @hidden */
    export interface IGLTFNodeInstanceSkin {
        skeletons: string[];
        skin: string;
        meshes: string[];
    }
    /** @hidden */
    export interface IGLTFSkins extends IGLTFChildRootProperty {
        bindShapeMatrix: number[];
        inverseBindMatrices: string;
        jointNames: string[];
        babylonSkeleton?: BABYLON.Skeleton;
    }
    /** @hidden */
    export interface IGLTFNode extends IGLTFChildRootProperty {
        camera?: string;
        children: string[];
        skin?: string;
        jointName?: string;
        light?: string;
        matrix: number[];
        mesh?: string;
        meshes?: string[];
        rotation?: number[];
        scale?: number[];
        translation?: number[];
        babylonNode?: BABYLON.Node;
    }
    /** @hidden */
    export interface IGLTFScene extends IGLTFChildRootProperty {
        nodes: string[];
    }
    /** @hidden */
    export interface IGLTFRuntime {
        extensions: {
            [key: string]: any;
        };
        accessors: {
            [key: string]: IGLTFAccessor;
        };
        buffers: {
            [key: string]: IGLTFBuffer;
        };
        bufferViews: {
            [key: string]: IGLTFBufferView;
        };
        meshes: {
            [key: string]: IGLTFMesh;
        };
        lights: {
            [key: string]: IGLTFLight;
        };
        cameras: {
            [key: string]: IGLTFCamera;
        };
        nodes: {
            [key: string]: IGLTFNode;
        };
        images: {
            [key: string]: IGLTFImage;
        };
        textures: {
            [key: string]: IGLTFTexture;
        };
        shaders: {
            [key: string]: IGLTFShader;
        };
        programs: {
            [key: string]: IGLTFProgram;
        };
        samplers: {
            [key: string]: IGLTFSampler;
        };
        techniques: {
            [key: string]: IGLTFTechnique;
        };
        materials: {
            [key: string]: IGLTFMaterial;
        };
        animations: {
            [key: string]: IGLTFAnimation;
        };
        skins: {
            [key: string]: IGLTFSkins;
        };
        currentScene?: Object;
        scenes: {
            [key: string]: IGLTFScene;
        };
        extensionsUsed: string[];
        extensionsRequired?: string[];
        buffersCount: number;
        shaderscount: number;
        scene: BABYLON.Scene;
        rootUrl: string;
        loadedBufferCount: number;
        loadedBufferViews: {
            [name: string]: ArrayBufferView;
        };
        loadedShaderCount: number;
        importOnlyMeshes: boolean;
        importMeshesNames?: string[];
        dummyNodes: BABYLON.Node[];
    }
    /** @hidden */
    export interface INodeToRoot {
        bone: BABYLON.Bone;
        node: IGLTFNode;
        id: string;
    }
    /** @hidden */
    export interface IJointNode {
        node: IGLTFNode;
        id: string;
    }
}
declare module BABYLON.GLTF1 {
    /**
     * Utils functions for GLTF
     * @hidden
     */
    export class GLTFUtils {
            /**
                * Sets the given "parameter" matrix
                * @param scene: the BABYLON.Scene object
                * @param source: the source node where to pick the matrix
                * @param parameter: the GLTF technique parameter
                * @param uniformName: the name of the shader's uniform
                * @param shaderMaterial: the shader material
                */
            static SetMatrix(scene: BABYLON.Scene, source: BABYLON.Node, parameter: IGLTFTechniqueParameter, uniformName: string, shaderMaterial: BABYLON.ShaderMaterial | BABYLON.Effect): void;
            /**
                * Sets the given "parameter" matrix
                * @param shaderMaterial: the shader material
                * @param uniform: the name of the shader's uniform
                * @param value: the value of the uniform
                * @param type: the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
                */
            static SetUniform(shaderMaterial: BABYLON.ShaderMaterial | BABYLON.Effect, uniform: string, value: any, type: number): boolean;
            /**
             * Returns the wrap mode of the texture
             * @param mode: the mode value
             */
            static GetWrapMode(mode: number): number;
            /**
                * Returns the byte stride giving an accessor
                * @param accessor: the GLTF accessor objet
                */
            static GetByteStrideFromType(accessor: IGLTFAccessor): number;
            /**
                * Returns the texture filter mode giving a mode value
                * @param mode: the filter mode value
                */
            static GetTextureFilterMode(mode: number): ETextureFilterType;
            static GetBufferFromBufferView(gltfRuntime: IGLTFRuntime, bufferView: IGLTFBufferView, byteOffset: number, byteLength: number, componentType: EComponentType): ArrayBufferView;
            /**
                * Returns a buffer from its accessor
                * @param gltfRuntime: the GLTF runtime
                * @param accessor: the GLTF accessor
                */
            static GetBufferFromAccessor(gltfRuntime: IGLTFRuntime, accessor: IGLTFAccessor): any;
            /**
                * Decodes a buffer view into a string
                * @param view: the buffer view
                */
            static DecodeBufferToText(view: ArrayBufferView): string;
            /**
                * Returns the default material of gltf. Related to
                * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
                * @param scene: the Babylon.js scene
                */
            static GetDefaultMaterial(scene: BABYLON.Scene): BABYLON.ShaderMaterial;
    }
}
declare module BABYLON.GLTF1 {
    /** @hidden */
    export class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
        constructor();
        loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError: (message: string) => void): boolean;
        loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: BABYLON.Material) => void, onError: (message: string) => void): boolean;
    }
}
declare module BABYLON {
    /**
        * Helper class for working with arrays when loading the glTF asset
        */
    export class ArrayItem {
            /**
                * Gets an item from the given array.
                * @param context The context when loading the asset
                * @param array The array to get the item from
                * @param index The index to the array
                * @returns The array item
                */
            static Get<T>(context: string, array: ArrayLike<T> | undefined, index: number | undefined): T;
            /**
                * Assign an `index` field to each item of the given array.
                * @param array The array of items
                */
            static Assign(array?: IArrayItem[]): void;
    }
    /**
        * The glTF 2.0 loader
        */
    export class GLTFLoader implements IGLTFLoader {
            /** The glTF object parsed from the JSON. */
            gltf: IGLTF;
            /** The Babylon scene when loading the asset. */
            babylonScene: BABYLON.Scene;
            /** @hidden */
            _completePromises: Promise<any>[];
            /**
                * Registers a loader extension.
                * @param name The name of the loader extension.
                * @param factory The factory function that creates the loader extension.
                */
            static RegisterExtension(name: string, factory: (loader: GLTFLoader) => IGLTFLoaderExtension): void;
            /**
                * Unregisters a loader extension.
                * @param name The name of the loader extenion.
                * @returns A boolean indicating whether the extension has been unregistered
                */
            static UnregisterExtension(name: string): boolean;
            /**
                * Gets the loader state.
                */
            readonly state: BABYLON.Nullable<GLTFLoaderState>;
            /** @hidden */
            constructor(parent: GLTFFileLoader);
            /** @hidden */
            dispose(): void;
            /** @hidden */
            importMeshAsync(meshesNames: any, scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<{
                    meshes: BABYLON.AbstractMesh[];
                    particleSystems: BABYLON.IParticleSystem[];
                    skeletons: BABYLON.Skeleton[];
                    animationGroups: BABYLON.AnimationGroup[];
            }>;
            /** @hidden */
            loadAsync(scene: BABYLON.Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: BABYLON.SceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
            /**
                * Loads a glTF scene.
                * @param context The context when loading the asset
                * @param scene The glTF scene property
                * @returns A promise that resolves when the load is complete
                */
            loadSceneAsync(context: string, scene: IScene): Promise<void>;
            /**
                * Loads a glTF node.
                * @param context The context when loading the asset
                * @param node The glTF node property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon mesh when the load is complete
                */
            loadNodeAsync(context: string, node: INode, assign?: (babylonMesh: BABYLON.Mesh) => void): Promise<BABYLON.Mesh>;
            /**
                * Loads a glTF camera.
                * @param context The context when loading the asset
                * @param camera The glTF camera property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon camera when the load is complete
                */
            loadCameraAsync(context: string, camera: ICamera, assign?: (babylonCamera: BABYLON.Camera) => void): Promise<BABYLON.Camera>;
            /**
                * Loads a glTF animation.
                * @param context The context when loading the asset
                * @param animation The glTF animation property
                * @returns A promise that resolves with the loaded Babylon animation group when the load is complete
                */
            loadAnimationAsync(context: string, animation: IAnimation): Promise<BABYLON.AnimationGroup>;
            /**
                * Loads a glTF buffer view.
                * @param context The context when loading the asset
                * @param bufferView The glTF buffer view property
                * @returns A promise that resolves with the loaded data when the load is complete
                */
            loadBufferViewAsync(context: string, bufferView: IBufferView): Promise<ArrayBufferView>;
            /** @hidden */
            _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: BABYLON.Mesh, babylonDrawMode: number, assign?: (babylonMaterial: BABYLON.Material) => void): Promise<BABYLON.Material>;
            /**
                * Creates a Babylon material from a glTF material.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonDrawMode The draw mode for the Babylon material
                * @returns The Babylon material
                */
            createMaterial(context: string, material: IMaterial, babylonDrawMode: number): BABYLON.Material;
            /**
                * Loads properties from a glTF material into a Babylon material.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                * @returns A promise that resolves when the load is complete
                */
            loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): Promise<void>;
            /**
                * Loads the normal, occlusion, and emissive properties from a glTF material into a Babylon material.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                * @returns A promise that resolves when the load is complete
                */
            loadMaterialBasePropertiesAsync(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): Promise<void>;
            /**
                * Loads the alpha properties from a glTF material into a Babylon material.
                * Must be called after the setting the albedo texture of the Babylon material when the material has an albedo texture.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                */
            loadMaterialAlphaProperties(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): void;
            /**
                * Loads a glTF texture info.
                * @param context The context when loading the asset
                * @param textureInfo The glTF texture info property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon texture when the load is complete
                */
            loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign?: (babylonTexture: BABYLON.BaseTexture) => void): Promise<BABYLON.BaseTexture>;
            /**
                * Loads a glTF image.
                * @param context The context when loading the asset
                * @param image The glTF image property
                * @returns A promise that resolves with the loaded data when the load is complete
                */
            loadImageAsync(context: string, image: IImage): Promise<ArrayBufferView>;
            /**
                * Loads a glTF uri.
                * @param context The context when loading the asset
                * @param uri The base64 or relative uri
                * @returns A promise that resolves with the loaded data when the load is complete
                */
            loadUriAsync(context: string, uri: string): Promise<ArrayBufferView>;
            /**
                * Helper method called by a loader extension to load an glTF extension.
                * @param context The context when loading the asset
                * @param property The glTF property to load the extension from
                * @param extensionName The name of the extension to load
                * @param actionAsync The action to run
                * @returns The promise returned by actionAsync or null if the extension does not exist
                */
            static LoadExtensionAsync<TExtension = any, TResult = void>(context: string, property: BABYLON.GLTF2.IProperty, extensionName: string, actionAsync: (extensionContext: string, extension: TExtension) => BABYLON.Nullable<Promise<TResult>>): BABYLON.Nullable<Promise<TResult>>;
            /**
                * Helper method called by a loader extension to load a glTF extra.
                * @param context The context when loading the asset
                * @param property The glTF property to load the extra from
                * @param extensionName The name of the extension to load
                * @param actionAsync The action to run
                * @returns The promise returned by actionAsync or null if the extra does not exist
                */
            static LoadExtraAsync<TExtra = any, TResult = void>(context: string, property: BABYLON.GLTF2.IProperty, extensionName: string, actionAsync: (extraContext: string, extra: TExtra) => BABYLON.Nullable<Promise<TResult>>): BABYLON.Nullable<Promise<TResult>>;
            /**
                * Increments the indentation level and logs a message.
                * @param message The message to log
                */
            logOpen(message: string): void;
            /**
                * Decrements the indentation level.
                */
            logClose(): void;
            /**
                * Logs a message
                * @param message The message to log
                */
            log(message: string): void;
            /**
                * Starts a performance counter.
                * @param counterName The name of the performance counter
                */
            startPerformanceCounter(counterName: string): void;
            /**
                * Ends a performance counter.
                * @param counterName The name of the performance counter
                */
            endPerformanceCounter(counterName: string): void;
    }
}
declare module BABYLON {
    /** @hidden */
    export var __IGLTFLoaderExtension: number;
    /**
        * Interface for a glTF loader extension.
        */
    export interface IGLTFLoaderExtension extends IGLTFBaseLoaderExtension, BABYLON.IDisposable {
            /**
                * Called after the loader state changes to LOADING.
                */
            onLoading?(): void;
            /**
                * Called after the loader state changes to READY.
                */
            onReady?(): void;
            /**
                * Define this method to modify the default behavior when loading scenes.
                * @param context The context when loading the asset
                * @param scene The glTF scene property
                * @returns A promise that resolves when the load is complete or null if not handled
                */
            loadSceneAsync?(context: string, scene: IScene): BABYLON.Nullable<Promise<void>>;
            /**
                * Define this method to modify the default behavior when loading nodes.
                * @param context The context when loading the asset
                * @param node The glTF node property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon mesh when the load is complete or null if not handled
                */
            loadNodeAsync?(context: string, node: INode, assign: (babylonMesh: BABYLON.Mesh) => void): BABYLON.Nullable<Promise<BABYLON.Mesh>>;
            /**
                * Define this method to modify the default behavior when loading cameras.
                * @param context The context when loading the asset
                * @param camera The glTF camera property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon camera when the load is complete or null if not handled
                */
            loadCameraAsync?(context: string, camera: ICamera, assign: (babylonCamera: BABYLON.Camera) => void): BABYLON.Nullable<Promise<BABYLON.Camera>>;
            /**
                * @hidden Define this method to modify the default behavior when loading vertex data for mesh primitives.
                * @param context The context when loading the asset
                * @param primitive The glTF mesh primitive property
                * @returns A promise that resolves with the loaded geometry when the load is complete or null if not handled
                */
            _loadVertexDataAsync?(context: string, primitive: IMeshPrimitive, babylonMesh: BABYLON.Mesh): BABYLON.Nullable<Promise<BABYLON.Geometry>>;
            /**
                * @hidden Define this method to modify the default behavior when loading materials. Load material creates the material and then loads material properties.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon material when the load is complete or null if not handled
                */
            _loadMaterialAsync?(context: string, material: IMaterial, babylonMesh: BABYLON.Mesh, babylonDrawMode: number, assign: (babylonMaterial: BABYLON.Material) => void): BABYLON.Nullable<Promise<BABYLON.Material>>;
            /**
                * Define this method to modify the default behavior when creating materials.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonDrawMode The draw mode for the Babylon material
                * @returns The Babylon material or null if not handled
                */
            createMaterial?(context: string, material: IMaterial, babylonDrawMode: number): BABYLON.Nullable<BABYLON.Material>;
            /**
                * Define this method to modify the default behavior when loading material properties.
                * @param context The context when loading the asset
                * @param material The glTF material property
                * @param babylonMaterial The Babylon material
                * @returns A promise that resolves when the load is complete or null if not handled
                */
            loadMaterialPropertiesAsync?(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): BABYLON.Nullable<Promise<void>>;
            /**
                * Define this method to modify the default behavior when loading texture infos.
                * @param context The context when loading the asset
                * @param textureInfo The glTF texture info property
                * @param assign A function called synchronously after parsing the glTF properties
                * @returns A promise that resolves with the loaded Babylon texture when the load is complete or null if not handled
                */
            loadTextureInfoAsync?(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BABYLON.BaseTexture) => void): BABYLON.Nullable<Promise<BABYLON.BaseTexture>>;
            /**
                * Define this method to modify the default behavior when loading animations.
                * @param context The context when loading the asset
                * @param animation The glTF animation property
                * @returns A promise that resolves with the loaded Babylon animation group when the load is complete or null if not handled
                */
            loadAnimationAsync?(context: string, animation: IAnimation): BABYLON.Nullable<Promise<BABYLON.AnimationGroup>>;
            /**
                * Define this method to modify the default behavior when loading uris.
                * @param context The context when loading the asset
                * @param uri The uri to load
                * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
                */
            _loadUriAsync?(context: string, uri: string): BABYLON.Nullable<Promise<ArrayBufferView>>;
    }
}
declare module BABYLON {
    /** @hidden */
    export var __IGLTFLoaderInterfacesV2: number;
    /**
        * Loader interface with an index field.
        */
    export interface IArrayItem {
            /**
                * The index of this item in the array.
                */
            index: number;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAccessor extends BABYLON.GLTF2.IAccessor, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
            /** @hidden */
            _babylonVertexBuffer?: Promise<BABYLON.VertexBuffer>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAnimationChannel extends BABYLON.GLTF2.IAnimationChannel, IArrayItem {
    }
    /** @hidden */
    export interface _IAnimationSamplerData {
            input: Float32Array;
            interpolation: BABYLON.GLTF2.AnimationSamplerInterpolation;
            output: Float32Array;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAnimationSampler extends BABYLON.GLTF2.IAnimationSampler, IArrayItem {
            /** @hidden */
            _data?: Promise<_IAnimationSamplerData>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IAnimation extends BABYLON.GLTF2.IAnimation, IArrayItem {
            channels: IAnimationChannel[];
            samplers: IAnimationSampler[];
            /** @hidden */
            _babylonAnimationGroup?: BABYLON.AnimationGroup;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IBuffer extends BABYLON.GLTF2.IBuffer, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IBufferView extends BABYLON.GLTF2.IBufferView, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
            /** @hidden */
            _babylonBuffer?: Promise<BABYLON.Buffer>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface ICamera extends BABYLON.GLTF2.ICamera, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IImage extends BABYLON.GLTF2.IImage, IArrayItem {
            /** @hidden */
            _data?: Promise<ArrayBufferView>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterialNormalTextureInfo extends BABYLON.GLTF2.IMaterialNormalTextureInfo, BABYLON.GLTF2.ITextureInfo {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterialOcclusionTextureInfo extends BABYLON.GLTF2.IMaterialOcclusionTextureInfo, BABYLON.GLTF2.ITextureInfo {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterialPbrMetallicRoughness extends BABYLON.GLTF2.IMaterialPbrMetallicRoughness {
            baseColorTexture?: ITextureInfo;
            metallicRoughnessTexture?: ITextureInfo;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMaterial extends BABYLON.GLTF2.IMaterial, IArrayItem {
            pbrMetallicRoughness?: IMaterialPbrMetallicRoughness;
            normalTexture?: IMaterialNormalTextureInfo;
            occlusionTexture?: IMaterialOcclusionTextureInfo;
            emissiveTexture?: ITextureInfo;
            /** @hidden */
            _babylonData?: {
                    [drawMode: number]: {
                            material: BABYLON.Material;
                            meshes: BABYLON.AbstractMesh[];
                            promise: Promise<void>;
                    };
            };
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMesh extends BABYLON.GLTF2.IMesh, IArrayItem {
            primitives: IMeshPrimitive[];
    }
    /**
        * Loader interface with additional members.
        */
    export interface IMeshPrimitive extends BABYLON.GLTF2.IMeshPrimitive, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface INode extends BABYLON.GLTF2.INode, IArrayItem {
            /**
                * The parent glTF node.
                */
            parent?: INode;
            /** @hidden */
            _babylonMesh?: BABYLON.Mesh;
            /** @hidden */
            _primitiveBabylonMeshes?: BABYLON.Mesh[];
            /** @hidden */
            _babylonBones?: BABYLON.Bone[];
            /** @hidden */
            _numMorphTargets?: number;
    }
    /** @hidden */
    export interface _ISamplerData {
            noMipMaps: boolean;
            samplingMode: number;
            wrapU: number;
            wrapV: number;
    }
    /**
        * Loader interface with additional members.
        */
    export interface ISampler extends BABYLON.GLTF2.ISampler, IArrayItem {
            /** @hidden */
            _data?: _ISamplerData;
    }
    /**
        * Loader interface with additional members.
        */
    export interface IScene extends BABYLON.GLTF2.IScene, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface ISkin extends BABYLON.GLTF2.ISkin, IArrayItem {
            /** @hidden */
            _babylonSkeleton?: BABYLON.Skeleton;
            /** @hidden */
            _promise?: Promise<void>;
    }
    /**
        * Loader interface with additional members.
        */
    export interface ITexture extends BABYLON.GLTF2.ITexture, IArrayItem {
    }
    /**
        * Loader interface with additional members.
        */
    export interface ITextureInfo extends BABYLON.GLTF2.ITextureInfo {
    }
    /**
        * Loader interface with additional members.
        */
    export interface IGLTF extends BABYLON.GLTF2.IGLTF {
            accessors?: IAccessor[];
            animations?: IAnimation[];
            buffers?: IBuffer[];
            bufferViews?: IBufferView[];
            cameras?: ICamera[];
            images?: IImage[];
            materials?: IMaterial[];
            meshes?: IMesh[];
            nodes?: INode[];
            samplers?: ISampler[];
            scenes?: IScene[];
            skins?: ISkin[];
            textures?: ITexture[];
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/blob/eb3e32332042e04691a5f35103f8c261e50d8f1e/extensions/2.0/Khronos/EXT_lights_image_based/README.md) (Experimental)
      */
    export class EXT_lights_image_based implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): BABYLON.Nullable<Promise<void>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression)
      */
    export class KHR_draco_mesh_compression implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        _loadVertexDataAsync(context: string, primitive: IMeshPrimitive, babylonMesh: BABYLON.Mesh): BABYLON.Nullable<Promise<BABYLON.Geometry>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/blob/1048d162a44dbcb05aefc1874bfd423cf60135a6/extensions/2.0/Khronos/KHR_lights_punctual/README.md) (Experimental)
      */
    export class KHR_lights implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonMesh: BABYLON.Mesh) => void): BABYLON.Nullable<Promise<BABYLON.Mesh>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness)
      */
    export class KHR_materials_pbrSpecularGlossiness implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): BABYLON.Nullable<Promise<void>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit)
      */
    export class KHR_materials_unlit implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): BABYLON.Nullable<Promise<void>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_texture_transform/README.md)
      */
    export class KHR_texture_transform implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BABYLON.BaseTexture) => void): BABYLON.Nullable<Promise<BABYLON.BaseTexture>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
      * [Specification](https://github.com/najadojo/glTF/tree/MSFT_audio_emitter/extensions/2.0/Vendor/MSFT_audio_emitter)
      */
    export class MSFT_audio_emitter implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): BABYLON.Nullable<Promise<void>>;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonMesh: BABYLON.Mesh) => void): BABYLON.Nullable<Promise<BABYLON.Mesh>>;
        /** @hidden */
        loadAnimationAsync(context: string, animation: IAnimation): BABYLON.Nullable<Promise<BABYLON.AnimationGroup>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
        * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_lod)
        */
    export class MSFT_lod implements IGLTFLoaderExtension {
            /** The name of this extension. */
            readonly name: string;
            /** Defines whether this extension is enabled. */
            enabled: boolean;
            /**
                * Maximum number of LODs to load, starting from the lowest LOD.
                */
            maxLODsToLoad: number;
            /**
                * BABYLON.Observable raised when all node LODs of one level are loaded.
                * The event data is the index of the loaded LOD starting from zero.
                * Dispose the loader to cancel the loading of the next level of LODs.
                */
            onNodeLODsLoadedObservable: BABYLON.Observable<number>;
            /**
                * BABYLON.Observable raised when all material LODs of one level are loaded.
                * The event data is the index of the loaded LOD starting from zero.
                * Dispose the loader to cancel the loading of the next level of LODs.
                */
            onMaterialLODsLoadedObservable: BABYLON.Observable<number>;
            /** @hidden */
            constructor(loader: GLTFLoader);
            /** @hidden */
            dispose(): void;
            /** @hidden */
            onReady(): void;
            /** @hidden */
            loadNodeAsync(context: string, node: INode, assign: (babylonMesh: BABYLON.Mesh) => void): BABYLON.Nullable<Promise<BABYLON.Mesh>>;
            /** @hidden */
            _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: BABYLON.Mesh, babylonDrawMode: number, assign: (babylonMaterial: BABYLON.Material) => void): BABYLON.Nullable<Promise<BABYLON.Material>>;
            /** @hidden */
            _loadUriAsync(context: string, uri: string): BABYLON.Nullable<Promise<ArrayBufferView>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /** @hidden */
    export class MSFT_minecraftMesh implements IGLTFLoaderExtension {
        readonly name: string;
        enabled: boolean;
        constructor(loader: GLTFLoader);
        dispose(): void;
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): BABYLON.Nullable<Promise<void>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /** @hidden */
    export class MSFT_sRGBFactors implements IGLTFLoaderExtension {
        readonly name: string;
        enabled: boolean;
        constructor(loader: GLTFLoader);
        dispose(): void;
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: BABYLON.Material): BABYLON.Nullable<Promise<void>>;
    }
}