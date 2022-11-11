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
    }: componentInfo
) {

    // If string identifier, convert to number
    const id = Number(uniqueIdentifier);

    components.set(id, {componentList: [], name, description, defaultState});

    return id;
}

function createComponent(
    componentID: number,
) {
    const id = getFreeComponentID();
    const componentInfo = components.get(componentID);
    if (!componentInfo)
        throw Error("No such component Exists");
    componentData.set(id, {...componentInfo.defaultState});
    return id;
}

/**
 * Creates a new entity with attached components
 * @param attachedComponents List of components linked to entity
 * @returns Entitie's ID
 */
export function createEntity(
    attachedComponents: number[] = [],
) {
    const id = getFreeEntityID();
    const componentsInfo: entityComponentInfo[] = [];
    attachedComponents.forEach((componentID) => {
        const componentDataID = createComponent(componentID);
        componentsInfo.push({componentID, componentDataID})
    });
    entities.set(id, componentsInfo);
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

const components = new Map<number, componentKeyType>();
const componentData = new Map<number, any>();
const entities = new Map<number, entityComponentInfo[]>();

/* ----- From this point on I define some useful types ----- */

// Type that defines what a component consistes of
interface componentKeyType {
    componentList: number[],
    name: string,
    description: string,
    defaultState: any,
}

// Defines input to add component function (subset of componentKeyType)
interface componentInfo {
    name: string,
    description: string,
    defaultState: any,
}

// Entities key type
interface entityComponentInfo {
    componentID: number,
    componentDataID: number,
}