/* globals window */
export default function (
  reducePropsToState,
  handleStateChangeOnClient,
  mapStateOnServer
) {
  return function wrap(component) {
    const {props} = component
    if (typeof props !== 'object') {
      throw new Error('Expected Component to have props!')
    }
    if (typeof reducePropsToState !== 'function') {
      throw new Error('Expected reducePropsToState to be a function.')
    }
    if (typeof handleStateChangeOnClient !== 'function') {
      throw new Error('Expected handleStateChangeOnClient to be a function.')
    }
    if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {
      throw new Error('Expected mapStateOnServer to either be undefined or a function.')
    }

    let mountedInstances = []
    let state

    const SideEffect = {
      name: getDisplayName(component.name),
      props,
      peek() {
        return state
      },
      isServer: typeof window === 'undefined',
      rewind() {
        if (!SideEffect.isServer) {
          throw new Error('You may only call rewind() on the server. Call peek() to read the current state.')
        }
        const recordedState = state
        state = undefined
        mountedInstances = []
        return recordedState
      },
      beforeMount() {
        mountedInstances.push(this)
        emitChange()
      },
      updated() {
        emitChange()
      },
      beforeDestroy() {
        const index = mountedInstances.indexOf(this)
        mountedInstances.splice(index, 1)
        emitChange()
      },
      render(h) {
        const mappedProps = getProps(this, props)
        return h(component, {props: mappedProps}, this.$slots.default)
      }
    }

    function emitChange() {
      state = reducePropsToState(mountedInstances.map(instance => {
        return getProps(instance, props)
      }))

      if (SideEffect.isServer) {
        state = mapStateOnServer(state)
      } else {
        handleStateChangeOnClient(state)
      }
    }

    return SideEffect
  }
}

function isType(obj, type) {
  return `[object ${type}]` === Object.prototype.toString.call(obj)
}

function inProps(props, key) {
  if (isType(props, 'Array')) {
    return props.indexOf(key) !== -1
  }
  if (isType(props, 'Object')) {
    return {}.hasOwnProperty.call(props, key)
  }
  return false
}

function getProps(instance, props) {
  const result = {}
  for (const key in instance) {
    if (inProps(props, key)) {
      result[key] = instance[key]
    }
  }
  return result
}

function getDisplayName(name) {
  return name ? `side-effect-${name}` : 'side-effect'
}
