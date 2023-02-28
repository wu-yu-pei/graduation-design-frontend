export default function markdownPlugin() {
  return {
    // 插件名称
    name: 'vite:log',

    // 该插件在 plugin-vue 插件之前执行，这样就可以直接解析到原模板文件
    enforce: 'pre',

    // 代码转译，这个函数的功能类似于 `webpack` 的 `loader`
    transform(code, id, opt) {
      let str = '';
      const res = code.replaceAll(/\/\/\/([a-zA-Z,]{1,200})/g, (a, b, c, d) => {
        b.split(',').forEach((item) => (str += `console.log('${item} ->',${item});`));
        return str;
      });
      return res;
    },
  };
}
