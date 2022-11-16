import ECS from './ECS';

test('Test String Identifier', () => {
    const ecs = new ECS();
    // Create the component
    const defaultState = {
        hp: 100,
        stamina: 100,
    }
    ecs.addComponent('Player', {
        name: 'Player',
        description: 'Players health and stamina',
        defaultState
    });

    // Create entity
    // Use 'Player' as id
    const playerOne = ecs.createEntity(['Player']);

    // Check that the saved component data is the same data, but not the same object
    expect(ecs.getComponentData('Player', playerOne)).not.toBe(defaultState);
    expect(ecs.getComponentData('Player', playerOne)).toEqual(defaultState);
});

test('Test Number Identifier', () => {
    const ecs = new ECS();
    // Create the component
    const defaultState = {
        hp: 100,
        stamina: 100,
    }
    const playerComponentID = ecs.addComponent('Player', {
        name: 'Player',
        description: 'Players health and stamina',
        defaultState
    });

    // Create entity
    // Use 'Player' as id
    const playerOne = ecs.createEntity(['Player']);

    // Check that the saved component data is the same data, but not the same object
    expect(ecs.getComponentData(playerComponentID, playerOne)).not.toBe(defaultState);
    expect(ecs.getComponentData(playerComponentID, playerOne)).toEqual(defaultState);
});
