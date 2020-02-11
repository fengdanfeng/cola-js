const babelon = require('babelon')
const generate = require('babel-generator').default

module.exports = function ({ types: t }) {
  return {
    visitor: {
      ExportDefaultDeclaration (path) {
        path.node.declaration.properties.forEach(prop => {
          if (
            t.isObjectProperty(prop) &&
            t.isIdentifier(prop.key, { name: 'config' })
          ) {
            const code = generate(prop.value).code
            const config = babelon.eval( code )
            path.hub.file.metadata.config = {
              code: code,
              node: prop.value,
              value: config
            }
          }
        })

        path.remove()
      }
    }
  }
}
