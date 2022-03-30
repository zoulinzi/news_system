#React Hooks
    - useEffect()的作用跟componentDidMount()和ComponentDidUpdate()相同；
    - 当你调用 useEffect 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。
        由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state。
        默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候。
    - 副作用函数还可以通过返回一个函数来指定如何“清除”副作用。
        useEffect(() => {
            ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
            return () => {
              ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
            };
          });
    - Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：
        只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
        只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。）
    - Hook 是一种复用状态逻辑的方式，它不复用 state 本身。