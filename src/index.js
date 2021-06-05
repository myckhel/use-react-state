import { useState, useRef, useCallback } from 'react'
import produce from 'immer'

const merge = (obj1, obj2) => Object.assign(obj1, obj2)

const useMergeState = (initialState) => {
  const [state, setState] = useState(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const setMergeState = useCallback(
    (newState) =>
      setState(
        typeof newState === 'function'
          ? produce(stateRef.current, (draft) => newState(draft, merge))
          : produce(stateRef.current, (draft) => {
              switch (draft?.constructor) {
                case Object:
                  if (newState?.constructor === Object) {
                    merge(draft, newState)
                    break
                  } else {
                    return newState
                  }
                case Array:
                  if (newState?.constructor === Array) {
                    draft.push(...newState)
                    break
                  } else {
                    return newState
                  }
                default:
                  return newState
              }
            })
      ),
    []
  )

  return [state, setMergeState, stateRef]
}

export default useMergeState
