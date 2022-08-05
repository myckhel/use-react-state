import { AnyObject } from 'immer/dist/internal'
import React, { useRef, memo } from 'react'

import useState, { SetStateAction } from 'use-react-state'

// type Primitive = string | boolean | number
type Any = AnyObject | number | Array<any>

const type = (value: any) => {
  switch (value?.constructor) {
    case Object:
      return 'object'
    default:
      return value?.map ? 'array' : 'primitive'
  }
}

const isArray = (value: any) => type(value) === 'array'

const stringify = (value: any) => {
  switch (value?.constructor) {
    case Array:
      return JSON.stringify(value)
    case Object:
      return JSON.stringify(value)
    default:
      return value.toString()
  }
}

const App = () => {
  const [state, setState] = useState<Any>({
    state: { nine: 10 }
  })
  const ref = useRef(state)
  const dEqual = state === ref.current
  // eslint-disable-next-line
  const tEqual = state == ref.current

  console.log({ dEqual, tEqual })
  ref.current = state

  return (
    <div>
      <div>Create React Library Example 😄</div>
      <h6>
        State Type: {type(state)} : {new Date().getTime()}
      </h6>
      <Text setState={setState} value={state} text={'State:'} />
      {isArray(state) && <ArrayItems values={state as Array<any>} />}
      <button onClick={() => setState(3)}>Set 3</button>
      <button onClick={() => setState({ key: 1 })}>Set key: 1</button>
      <button
        onClick={() =>
          setState((state: any) => {
            return { key: state?.key + 1 || 2 }
          })
        }
      >
        Increaae key by 1
      </button>
      <button
        onClick={() =>
          setState((s) => {
            if (Array.isArray(s)) {
              s.unshift((s[0] || 1) + 1)
            } else {
              return [1]
            }
          })
        }
      >
        Prepend Increaae
      </button>
      <button
        onClick={() =>
          setState((s) => {
            if (Array.isArray(s)) {
              s.push((s.pop() || 1) + 1)
            } else {
              return [1]
            }
          })
        }
      >
        Modify Last
      </button>
      <button onClick={() => setState([1])}>Append 1</button>
      <button
        onClick={() =>
          setState((s) => {
            if (Array.isArray(s)) {
              s.push((s[s?.length - 1] || 1) + 1)
            } else {
              return [1]
            }
          })
        }
      >
        Append Increaae
      </button>
    </div>
  )
}

interface TextProps {
  setState: SetStateAction
  text: string
  value: Any
}

const Text = memo(({ setState, text, value }: TextProps) => (
  <div onClick={() => setState({ state: { nine: 10 } })}>
    ({new Date().getTime()}) : {text} {value && stringify(value)}
  </div>
))

interface ArrayProps {
  values: Array<any>
}

// @ts-ignore:next-line
const ArrayItems = memo<ArrayProps>(({ values }) => {
  return values.map((value, index) => (
    <Item key={'' + index} {...{ value, index }} />
  ))
})

const Item = memo(({ value, index }: { value: any; index: number }) => (
  <div>
    {new Date().getTime()}: {index} &gt; {value}
  </div>
))

export default App
