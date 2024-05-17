
import CodePreview from './components/CodePreview'
import Details from './components/Details'
import Scene from './components/Scene'

import { Provider, useSelector, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import Immutable from 'immutable'

const devtoolOptions = {
  serialize: {
    immutable: Immutable
  }
}

// Redux
const initialState = {
  count: Immutable.Set()
}
function counterReducer(state = initialState, action) {
  if (action.type === 'inc') {
    return {
      ...state,
      count: state.count.add(state.count.size + 1)
    }
  }
  return state
}
const reduxStore = configureStore({
  devTools: {
    name: 'redux-store',
    ...devtoolOptions
  },
  reducer: counterReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
function useReduxStore() {
  const count = useSelector(state => state.count)
  const dispatch = useDispatch()
  return {
    count: count,
    inc: () => {
      dispatch({type: 'inc'})
    }
  }
}

// Zustand
const useZustandStore = create()(devtools((set) => ({
  count: Immutable.Set(),
  inc: () => set((state) => ({ count: state.count.add(state.count.size + 1) })),
}), {
  name: 'zustand-store',
  ...devtoolOptions
}))


function ReduxCounter() {
  const { count, inc } = useReduxStore()
  return (
    <div className="counter" style={{left: '-20px'}}>
      <span>{JSON.stringify(count)}</span>
      <button onClick={inc}>redux++</button>
    </div>
  )
}

function ZustandCounter() {
  const { count, inc } = useZustandStore()
  return (
    <div className="counter">
      <span>{JSON.stringify(count)}</span>
      <button onClick={inc}>zustand++</button>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Provider store={reduxStore}>
        <Scene />
          <div className="main">
            <div className="code">
              <div className="code-container">
                <CodePreview />
                <ReduxCounter />
                <ZustandCounter />
              </div>
            </div>
          <Details />
        </div>
      </Provider>
    </>
  )
}
