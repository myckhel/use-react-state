import {
  useState as useReactState,
  useRef,
  useCallback,
  MutableRefObject
} from 'react'
import produce, { Draft } from 'immer'

type Merger<S = any> = (obj1: Draft<Partial<S>>, obj2: Partial<S>) => Partial<S>

export type CallableStateAction<S = any> =
  | Partial<S>
  | ((draft: Draft<S>, newState: S | Merger<S>) => void)

const merge = <S = any>(obj1: Draft<S>, obj2: Partial<S>): Partial<S> =>
  Object.assign(obj1, obj2)

export type SetStateAction<S = any> = (newState: CallableStateAction<S>) => void

export type UseStateReturnType<S> = [S, SetStateAction<S>, MutableRefObject<S>]

const useState = <S = any>(initialState: S): UseStateReturnType<S> => {
  const [state, setState] = useReactState(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const setMergeState = useCallback(
    (newState: CallableStateAction<S>) =>
      setState(
        typeof newState === 'function'
          ? produce(stateRef.current, (draft: Draft<S>) =>
              newState(draft, merge)
            )
          : produce(stateRef.current, (draft: Draft<S>) => {
              // @ts-ignore:next-line
              switch (draft?.constructor) {
                case Object:
                  if (newState?.constructor === Object) {
                    return merge(draft, newState) as Draft<S>
                  } else {
                    return newState as Draft<S>
                  }
                case Array:
                  if (newState?.constructor === Array) {
                    // @ts-ignore:next-line
                    draft.push(...newState)
                    return draft
                  } else {
                    return newState as Draft<S>
                  }
                default:
                  return newState as Draft<S>
              }
            })
      ),
    []
  )

  return [state, setMergeState, stateRef]
}

export { useState as default }
