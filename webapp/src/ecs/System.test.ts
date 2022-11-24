import ECS from "./ECS";

test('Test System works as intended', () => {
    const ecs = new ECS();
    ecs.addComponent('Player', {
        defaultState: {
            hp: 100,
        }
    });
    const playerOne = ecs.createEntity(['Player']);
    const func = () => {
        const entities = ecs.getEntitiesWithComponent('Player');
        entities.forEach((entity: number) => {
            const playerData = ecs.getComponentData('Player', entity);
            playerData.hp = 50;
        })
    };
    func();
    
    expect(ecs.getComponentData('Player', playerOne).hp).toEqual(50);
});