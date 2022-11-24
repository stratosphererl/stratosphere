# Entity Component System

The entity component system will likely never see the light of day :(

But if it did this is how you would use it.

## Usage
First you want to import and create a new ECS object:
```ts
import ECS from "./ecs/ECS";
```
```ts
const ecs = new ECS();
```
Once imported you can create new components with initial data.
```ts
ecs.addComponent('Component Label', {
    name: 'Component Name',
    description: 'Component Description',
    defaultState: {
        numberData: 100,
        stringData: 'Hello',
    }
});
```
_note: Component data is implemented as objects of type: any. This means you can add new information to store in a component after its construction. This is not recommended._

Creating a new entity is also easy! You can create an entity based on a list of relevent components.
```ts
const entity = ecs.createEntity(['ComponentLabel']);
```
When an entity is created it has the default state attributed to each component. If you want to change or look at the state, you can always access it this way:
```ts
const data = ecs.getComponentData('ComponentLabel', entity);
data.numberData = 50;
```
## Systems
This section isn't anything mind boggling, I will essentially explain how a lambda function
and a method in the ecs system can be used to think about systems.
```ts
const func = () => {
    const entities = ecs.getEntitiesWithComponent('ComponentLabel');
    entities.forEach((entity: number) => {
        const data = ecs.getComponentData('ComponentLabel', entity);
        data.numberData = 50;
    })
};
```
You can define functions and pass them to other areas of code to subscribe to events. Your function doesn't have to have no parameters, it's yours to change!