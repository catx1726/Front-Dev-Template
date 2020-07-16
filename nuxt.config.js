import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - NuxtTemplate',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSSCSS
   */
  css: ['~/assets/scss/main.scss'],

  /*
   Mixin css
  */
  styleResources: {
    scss: './assets/scss/mixin.scss'
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios.js'],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    credentials: true
  },
  proxy: {
    changeOrigin: true,
    '/bing': {
      target: 'http://cn.bing.com', // 代理地址 await this.$axios.$get('/bing/HPImageArchive.aspx?format=js&idx=0&n=1')
      changeOrigin: true,
      pathRewrite: {
        '^/bing': '' // 将 /bing 替换掉
      }
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */

    postcss: {
      plugins: {},
      preset: {
        autoprefixer: {
          /* 参考 https://github.com/browserslist/browserslist#queries */
          overrideBrowserslist: ['defaults', 'ie >= 9', '> 5%', 'last 2 versions']
        }
      }
    },
    extend(config, ctx) {}
  }
}
