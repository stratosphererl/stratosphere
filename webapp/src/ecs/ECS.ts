/**
 * Add a component type
 * @param uniqueIdentifier Number or String used to label component
 * @param component Consists of a name, description and state
 * @returns uniqueIdentifier in number form
 */
export function addComponent(
    uniqueIdentifier: number | string, componentInfo: {
        name: string, 
        description: string, 
        defaultState: any
    }
): number {

    // If string identifier, convert to number
    const id = Number(uniqueIdentifier);

    components.set(id, {componentData: [], componentInfo});

    return id;
}

const components = new Map<number, componentKeyType>();

/* ----- From this point on I define some useful types ----- */

// Type that defines what a component consistes of
interface componentKeyType {
    componentData: number[],
    componentInfo: componentInfoType,
}

// Information that describes a component
interface componentInfoType {
    name: string,
    description: string,
    defaultState: any,
}