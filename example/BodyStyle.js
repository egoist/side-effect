import withSideEffect from '../src'

function reducePropsToState(props) {
  const style = {}
  for (const prop of props) {
    Object.assign(style, prop.setStyle)
  }
  return style
}

function handleStateChangeOnClient(style) {
  for (const key in style) {
    document.body.style[key] = style[key]
  }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)({
  name: 'body-style',
  props: {
    setStyle: {
      required: true
    }
  },
  render(h) {
    let children = this.$slots.default
    if (!children) return

    children = children.filter(c => c.tag)
    return children[0]
  }
})
