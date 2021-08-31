1. What is the difference between Component and PureComponent? give an
example where it might break my app.
The main difference between both of is that PureComponent makes a comparison before rending the component, using shouldComponentUpdate method. If exists a change between previous props/state, the render takes places. Doesn’t in other case. 
This could represent a performance enhancement in some cases, specially in atom components or in those who doesn't expect states/props changing (should analize in other cases). On the other hand, exists risks if we use them this class in higher order components without considering the a whole app design. Why? Since a higher component could stop the re-render of other components, causing unwhished behaviours.

2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
Every Children re-render every times that change the value prop of the provider. This re-render is not conditionated to shouldComponentUpdate method from the parent component. So, this could direct us to unexpected behaviours.

3. Describe 3 ways to pass information from a component to its PARENT.
- A callback. A child invokes it with some data.
- Context
- Hooks
- Redux

4. Give 2 ways to prevent components from re-rendering.
- Returning false from shouldComponentUpdate method. This will render the component only once except in the case previously described related to Context.
- React.memo

5. What is a fragment and why do we need it? Give an example where it
might break my app.
A fragment is a syntax to wrap and group multiple components to one. Not sure how using fragments could break my app, would like to know.

6. Give 3 examples of the HOC pattern.
- Connect. It encapsulates the logic of redux and merges it with the component.
- WithNavigation. A use case related to react navigation library usage.
- WithLogs. A wrapper to log user actions.

7. what's the difference in handling exceptions in promises, callbacks and
async...await.
- In promises you don't receive an exception like in async methods. What you get is an unhandledRejection warning. This is quite annoying since it makes them easier to skip and difficult to handle.
Talking about error boundaries, promises and async methods are not handled properly. This means in some occasions they can be skipped. 
Callbacks are a particular case since you can't use try/catch wrapping it's definition to handle exception, this won't work. They resolve when are invoked and need to think the errors arquitecture to manage this.

8. How many arguments does setState take and why is it async.
It takes two arguments, first one could be either an object or a method and second one is a callback. It is async since React internally could merge many of these updates and make a re-render whethever it decides to.

9. List the steps needed to migrate a Class to Function Component.
1 - Change class to function
2 - Convert every state to useState
3 - Replace constructor state initialize by default values on useState. If want to implement other functionality would need to do a deeper and specific analysis. Also, we not longer need binds.
4 - Replace componentDidMount, componentDidUpdate & componentWillUnmount by useEffect with dependance array accordingly adapted on first two cases and a return method inside in the last.
5 - Replace this.setState by corresponding useState set methods.
6 - Replace render by only a return.
7 - Replace class methods by functions.

10. List a few ways styles can be used with components.
Inlyne styles, class, className (css), style in JS, dinamic styles, using toolkits like bootstrap/bass-css, styled components, global styles, preprocessors like sass.

11. How to render an HTML string coming from the server.
Using either a library or dangerousSetInnerHtml. Would investigate deeper since actually had to do this only once.