export function withLogger<State, Action extends { type: string }>(reducer: (state: State, action: Action) => State) {
  return (state: State, action: Action): State => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) console.log(action.type, { before: state, after: nextState });
    return nextState;
  };
}
