/**
 * Add a component type
 * @param uniqueIdentifier Number or String used to label component
 * @param component Consists of a name, description and state
 * @returns uniqueIdentifier in number form
 */
export function addComponent(
    uniqueIdentifier: number | string, {
        name = String(uniqueIdentifier), 
        description = "", 
        defaultState = {},
    }: ComponentInfo
) {

    // If string identifier, convert to number
    const id = Number(uniqueIdentifier);

    components.set(id, {componentList: [], entityList: [], name, description, defaultState});

    return id;
}

/**
 * Creates a new entity with attached components
 * @param attachedComponents List of components linked to entity
 * @returns Entitie's ID
 */
 export function createEntity(
    attachedComponents: (number | string)[] = [],
) {
    const id = getFreeEntityID();
    const componentsInfo: EntityComponentInfo = new Map();
    attachedComponents.forEach((componentID) => {
        const numberID = Number(componentID);
        const componentDataID = createComponent(numberID, id);
        componentsInfo.set(numberID, componentDataID)
    });
    entities.set(id, componentsInfo);
    return id;
}

/**
 * Gets the data from a component with that entity label
 * @param componentID Component type to retrieve
 * @param entityID Entitie's unique id
 * @returns Component data
 */
export function getComponentData(componentID: string | number, entityID: number) {
    const entity = entities.get(entityID);
    if (entity == undefined)
        throw Error("No entity found with that id");
    const componentDataID = entity.get(Number(componentID));
    if (componentDataID == undefined)
        throw Error("Entity does not have a component with that id");
    return componentData.get(componentDataID);
}

// Get a list of all the entities in the 
export function getEntities() {
    return entities;
}

export function getComponents(entityID: number) {
    const entityInfo = entities.get(entityID);
    if (entityInfo == undefined)
        throw Error("Entity does not exist");
    return entityInfo.keys();
}

export function getEntitiesWithComponent(componentID: number | string) {
    componentID = Number(componentID);
    const component = components.get(componentID);
    if (component == undefined) 
        throw Error("Component Not Defined");
    return [...component.entityList];
}

/**
 * Creates a new component of specified type
 * @param componentID Identifier for component type
 * @returns id of generated component
 */
function createComponent(
    componentID: number, entityID: number
) {
    const id = getFreeComponentID();
    const componentInfo = components.get(componentID);
    if (componentInfo == undefined)
        throw Error("No such component Exists");
    componentInfo.componentList.push(id);
    componentInfo.entityList.push(entityID);
    componentData.set(id, {...componentInfo.defaultState});
    return id;
}

/**
 * Gets a free ID represented as a number
 * that can label an entity
 * @returns A number that does not exist in entities
 */
 function getFreeComponentID() {
    while (entities.has(freeComponentID))
    freeComponentID++;
    return freeComponentID;
}
let freeComponentID = 0;

/**
 * Gets a free ID represented as a number
 * that can label an entity
 * @returns A number that does not exist in entities
 */
function getFreeEntityID() {
    while (entities.has(freeEntityID))
        freeEntityID++;
    return freeEntityID;
}
let freeEntityID = 0;

const components = new Map<number, ComponentKeyType>();
const componentData = new Map<number, any>();
const entities = new Map<number, EntityComponentInfo>();

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