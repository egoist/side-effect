/* globals window */
export default function (
  reduceInstancesToState,
  handleStateChangeOnClient,
  mapStateOnServer
) {
  return function wrap(component) {
    const {props} = component
    if (typeof props !== 'object') {
      throw new Error('Expected Component to have props!')
    }
    if (typeof reduceInstancesToState !== 'function') {
      throw new Error('Expected reduceInstancesToState to be a function.')
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
        return h(component, {props: this.$props}, this.$slots.default)
      }
    }

    function emitChange() {
      state = reduceInstancesToState(mountedInstances)

      if (SideEffect.isServer) {
        state = mapStateOnServer(state)
      } else {
        handleStateChangeOnClient(state)
      }
    }

    return SideEffect
  }
}

function getDisplayName(name) {
  return name ? `side-effect-${name}` : 'side-effect'
}
