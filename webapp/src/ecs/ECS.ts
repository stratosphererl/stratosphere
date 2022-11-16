export default class ECS {
    private components;
    private componentData;
    private entities;
    constructor () {
        this.components = new Map<number, ComponentKeyType>();
        this.componentData = new Map<number, any>();
        this.entities = new Map<number, EntityComponentInfo>();
    }

    /**
     * Add a component type
     * @param uniqueIdentifier Number or String used to label component
     * @param component Consists of a name, description and state
     * @returns uniqueIdentifier in number form
     */
    public addComponent(
        uniqueIdentifier: number | string, {
            name = String(uniqueIdentifier), 
            description = "", 
            defaultState = {},
        }: ComponentInfo
    ) {
    
        // If string identifier, convert to number
        const id = Number(uniqueIdentifier);
    
        this.components.set(id, {componentList: [], entityList: [], name, description, defaultState});
    
        return id;
    }

    /**
     * Creates a new entity with attached components
     * @param attachedComponents List of components linked to entity
     * @returns Entitie's ID
     */
    public createEntity(
        attachedComponents: (number | string)[] = [],
    ) {
        const id = this.getFreeEntityID();
        const componentsInfo: EntityComponentInfo = new Map();
        attachedComponents.forEach((componentID) => {
            const numberID = Number(componentID);
            const componentDataID = this.createComponent(numberID, id);
            componentsInfo.set(numberID, componentDataID)
        });
        this.entities.set(id, componentsInfo);
        return id;
    }

    /**
     * Gets the data from a component with that entity label
     * @param componentID Component type to retrieve
     * @param entityID Entitie's unique id
     * @returns Component data
     */
    public getComponentData(componentID: string | number, entityID: number) {
        const entity = this.entities.get(entityID);
        if (entity == undefined)
            throw Error("No entity found with that id");
        const componentDataID = entity.get(Number(componentID));
        if (componentDataID == undefined)
            throw Error("Entity does not have a component with that id");
        return this.componentData.get(componentDataID);
    }

    public getComponents(entityID: number) {
        const entityInfo = this.entities.get(entityID);
        if (entityInfo == undefined)
            throw Error("Entity does not exist");
        return entityInfo.keys();
    }

    public getEntitiesWithComponent(componentID: number | string) {
        componentID = Number(componentID);
        const component = this.components.get(componentID);
        if (component == undefined) 
            throw Error("Component Not Defined");
        return [...component.entityList];
    }

    /**
     * Creates a new component of specified type
     * @param componentID Identifier for component type
     * @returns id of generated component
     */
    private createComponent(
        componentID: number, entityID: number
    ) {
        const id = this.getFreeComponentID();
        const componentInfo = this.components.get(componentID);
        if (componentInfo == undefined)
            throw Error("No such component Exists");
        componentInfo.componentList.push(id);
        componentInfo.entityList.push(entityID);
        this.componentData.set(id, {...componentInfo.defaultState});
        return id;
    }

    private freeComponentID = 0;
    /**
     * Gets a free ID represented as a number
     * that can label an entity
     * @returns A number that does not exist in entities
     */
    private getFreeComponentID() {
        while (this.entities.has(this.freeComponentID))
        this.freeComponentID++;
        return this.freeComponentID;
    }

    private freeEntityID = 0;
    /**
     * Gets a free ID represented as a number
     * that can label an entity
     * @returns A number that does not exist in entities
     */
    private getFreeEntityID() {
        while (this.entities.has(this.freeEntityID))
            this.freeEntityID++;
        return this.freeEntityID;
    }

}

/* ----- From this point on I define some useful types ----- */

// Type that defines what a component consistes of
interface ComponentKeyType {
    componentList: number[],
    entityList: number[],
    name: string,
    description: string,
    defaultState: any,
}

// Defines input to add component function (subset of componentKeyType)
interface ComponentInfo {
    name?: string,
    description?: string,
    defaultState?: any,
}

// Entities key type
type EntityComponentInfo = Map<number, number>;