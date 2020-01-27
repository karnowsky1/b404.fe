const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
<<<<<<< HEAD
    modifyVars: { '@primary-color': '#F16E21', '@text-color': '#000000' },
=======
    modifyVars: { '@primary-color': '#F16E21', '@input-height-base': '40px', '@btn-height-base': '40px' },
>>>>>>> dev
  }),
);