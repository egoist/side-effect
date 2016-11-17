# side-effect [![NPM version](https://img.shields.io/npm/v/side-effect.svg?style=flat-square)](https://npmjs.com/package/side-effect) [![NPM downloads](https://img.shields.io/npm/dm/side-effect.svg?style=flat-square)](https://npmjs.com/package/side-effect) [![Build Status](https://img.shields.io/circleci/project/egoist/side-effect/master.svg?style=flat-square)](https://circleci.com/gh/egoist/side-effect)

Heavily inspired by [react-side-effect](https://github.com/gaearon/react-side-effect).

## Features

- Light-weight: 1.5KB
- Simple: Just a component
- Works just as well with isomorphic apps

## Install

```bash
$ npm install --save side-effect
```

## Example

It gathers current props across the whole tree before passing them to side effect. For example, this allows you to create `<body-style :set-style>` component like this:

```vue
<!-- root component -->
<body-style :set-style="{backgroundColor: 'red'}">
  <some-component></some-component>
</side-effect>

<!-- some-component -->
<body-style :set-style="{backgroundColor: 'yellow'}">
  <input @input="updateColor" />
</side-effect>
```

Create a side-effect component named `BodyStyle` for mutating body style from different level of nesting with innermost winning:

```js
import withSideEffect from 'side-effect'

const BodyStyle = {
  name: 'body-style',
  render(h) {
    if (!this.$slots.default) return h()
    return this.$slots.default[0]
  }
}

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
)(BodyStyle)
```

Now, it's ready to go: https://side-effect.surge.sh

## Server-side Usage

The API is exactly the same as [react-side-effect](https://github.com/gaearon/react-side-effect#api), call `rewind()` after rendering.

```js
withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
  mapStateOnServer
)(VueComponent)
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT](https://egoist.mit-license.org/) © [EGOIST](https://github.com/egoist)
