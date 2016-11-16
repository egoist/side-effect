import Vue from 'vue'
import BodyStyle from '../example/BodyStyle'

function createVm() {
  return new Vue({
    render(h) {
      return (
        <BodyStyle setStyle={{backgroundColor: 'red'}}>
          <BodyStyle setStyle={{backgroundColor: 'yellow'}}>
          </BodyStyle>
        </BodyStyle>
      )
    }
  })
}

test('peek', () => {
  return new Promise(resolve => {
    const vm = createVm()
    vm.$mount()
    Vue.nextTick(() => {
      expect(BodyStyle.peek()).toEqual({backgroundColor: 'yellow'})
      resolve()
    })
  })
})

test('rewind', () => {
  return new Promise(resolve => {
    const vm = createVm()
    vm.$mount()
    Vue.nextTick(() => {
      try {
        BodyStyle.rewind()
      } catch (err) {
        console.log(err.message)
        expect(err.message.includes('You may only call rewind()')).toBe(true)
      }
      BodyStyle.isServer = true
      expect(BodyStyle.rewind()).toEqual({backgroundColor: 'yellow'})
      expect(BodyStyle.peek()).toBeUndefined()
      BodyStyle.isServer = false
      resolve()
    })
  })
})
