import { addComponent, createEntity, getComponentData, getEntitiesWithComponent } from "./ECS";

test('Test System works as intended', () => {
    addComponent('Player', {
        defaultState: {
            hp: 100,
        }
    });
    const playerOne = createEntity(['Player']);
    const func = () => {
        const entities = getEntitiesWithComponent('Player');
        entities.forEach((entity: number) => {
            const playerData = getComponentData('Player', entity);
            playerData.hp = 50;
        })
    };
    func();
    
    expect(getComponentData('Player', playerOne).hp).toEqual(50);
});