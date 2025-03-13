 module.exports = {
    root: true,
    env: {
      node: true,
      browser: true
    },
    parserOptions: {
      ecmaVersion: 'latest', 
      sourceType: 'module', 
      parser: '@babel/eslint-parser' ,
      requireConfigFile: false
    },
    extends: [
      'plugin:vue/vue3-recommended', 
      'eslint:recommended'
    ],
    globals: {
      defineProps: "readonly",
      defineEmits: "readonly",
      defineExpose: "readonly"
    }
  }