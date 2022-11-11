import { expect, test } from '@jest/globals';
import { addComponent, createEntity, getComponentData } from './ECS';

test('Test String Identifier', () => {
    // Create the component
    const defaultState = {
        hp: 100,
        stamina: 100,
    }
    addComponent('Player', {
        name: 'Player',
        description: 'Players health and stamina',
        defaultState
    });

    // Create entity
    // Use 'Player' as id
    const playerOne = createEntity(['Player']);

    // Check that the saved component data is the same data, but not the same object
    expect(getComponentData('Player', playerOne)).not.toBe(defaultState);
    expect(getComponentData('Player', playerOne)).toEqual(defaultState);
});

test('Test Number Identifier', () => {
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

    // Check that the saved component data is the same data, but not the same object
    expect(getComponentData(playerComponentID, playerOne)).not.toBe(defaultState);
    expect(getComponentData(playerComponentID, playerOne)).toEqual(defaultState);
});
