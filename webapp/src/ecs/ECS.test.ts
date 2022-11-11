import { expect, test } from '@jest/globals';
import { addComponent, createEntity, getComponentData } from './ECS';

test('Creates a new alterable component', () => {
    // Create the component
    const defaultState = {
        hp: 100,
        stamina: 100,
    }
    const playerComponentID = addComponent('Player', {
        name: 'Player',
        description: 'Players health and stamina',
        defaultState
    });

    // Create entity
    // Use 'Player' as id
    const playerOne = createEntity(['Player']);
    expect(getComponentData('Player', playerOne)).not.toBe(defaultState);
    expect(getComponentData('Player', playerOne)).toEqual(defaultState);
    // Use playerComponentID as id
    const playerTwo = createEntity([playerComponentID]);
    expect(getComponentData(playerComponentID, playerTwo)).not.toBe(defaultState);
    expect(getComponentData(playerComponentID, playerTwo)).toEqual(defaultState);

    expect(getComponentData('Player', playerOne)).not.toBe(getComponentData('Player', playerTwo));

});