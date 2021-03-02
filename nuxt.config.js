import colors from 'vuetify/es5/util/colors'
// Doc: https://github.com/nuxt-community/dotenv-module
import dotenv from 'dotenv'

/*
  在项目根目录中创建.env文件后，只需运行您的常用文件npm run dev。
  .env文件中的变量将被添加到context（context.env）和process（process.env）中
*/
dotenv.config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Vue-Nuxt-Vuetify-Template',
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
    // Doc: https://auth.nuxtjs.org/guide/setup.html
    '@nuxtjs/auth',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources'
  ],

  /* Auth module config */
  auth: {
    redirect: {
      // callback: '/callback',
      logout: '/login'
    },
    strategies: {
      local: {
        /*
          不指定 endpoint 则默认请求地址为: xxxxx/api/auth/login
          返回一个 token.accessToken 是有效部分，且写入 store 中，暂时不知道需不需要手动存入到 cookie
          store 对象为 auth{...} login 成功之后 会自动调用 xxxx/api/auth/user，返回一个 user
          video https://www.bilibili.com/video/BV1M7411e76Q
          config_code https://github.com/topfullstack/topfullstack/blob/master/web/nuxt.config.js
          login_code https://github.com/topfullstack/topfullstack/blob/master/web/layouts/default.vue
        */
        token: {
          property: 'token.accessToken' // 设置为 false 直接接受返回值
        }
      },
      localRefresh: {
        scheme: 'refresh',
        token: {
          property: 'token.accessToken',
          maxAge: 15
        },
        refreshToken: {
          property: 'token.refreshToken',
          data: 'refreshToken',
          maxAge: false
        }
      }
    }
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    prefix: process.env.API_URL || 'localhost:3000'
  },
  proxy: {
    changeOrigin: true
    // '/bing': {
    //   target: 'http://cn.bing.com', // 代理地址 await this.$axios.$get('/bing/HPImageArchive.aspx?format=js&idx=0&n=1')
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/bing': '' // 将 /bing 替换掉
    //   }
    // }
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
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    },

    analyze: true,

    minimize: true,

    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000
      }
    },

    maxChunkSize: 30000,

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
  },

  router: {
    base: '/'
  }
}
