<template>
  <div id="app">
    <body-style :set-style="{backgroundColor: 'yellow'}">
      <div>
        <button @click="red = true">Red is child of Yellow, Click to create</button>
        <button @click="red = false" v-if="red">Destroy Component for Red</button>
        <body-style :set-style="{backgroundColor: 'red'}" v-if="red">
          <div>
            <button @click="pink = true">Pink is child of Red, Click to create</button>
            <button @click="pink = false" v-if="pink">Destroy Component for Pink</button>
            <body-style :set-style="{backgroundColor: 'pink'}" v-if="pink">
            </body-style>
          </div>
        </body-style>
      </div>
    </body-style>
  </div>
</template>

<script>
  import BodyStyle from './BodyStyle'

  export default {
    name: 'app',
    data() {
      return {
        red: false,
        pink: false
      }
    },
    components: {
      BodyStyle
    }
  }
</script>
