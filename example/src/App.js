import React, { useRef, memo } from 'react'

import useState from 'use-react-state'

const type = (value) => {
  switch (value?.constructor) {
    case Object:
      return 'object'
    default:
      return value?.map ? 'array' : 'primitive'
  }
}

const isArray = (value) => type(value) === 'array'

const stringify = (value) => {
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
  const [state, setState] = useState({ state: { nine: 10 } })
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
      <Text value={state} text={'State:'} />
      {isArray(state) && <Array value={state} />}
      <button onClick={() => setState(3)}>Set 3</button>
      <button onClick={() => setState({ key: 1 })}>Set key: 1</button>
      <button onClick={() => setState({ key: state?.key + 1 || 2 })}>
        Increaae key by 1
      </button>
      <button
        onClick={() =>
          setState((s) => {
            if (s.shift) {
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
            if (s.shift) {
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
            if (s.shift) {
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

const Text = memo(({ setState, text, value }) => (
  <div onClick={() => setState({ state: { nine: 10 } })}>
    ({new Date().getTime()}) : {text} {value && stringify(value)}
  </div>
))

const Array = memo(({ value }) => {
  return value.map((value, index) => (
    <Item key={'' + index} {...{ value, index }} />
  ))
})

const Item = memo(({ value, index }) => (
  <div>
    {new Date().getTime()}: {index} => {value}
  </div>
))

export default App
