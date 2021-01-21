import { useState, useEffect } from '../tinyact.js';

let _routes, _render;

const pathToRegexp = path => {
  if (path instanceof RegExp) return path;
  let arr = path.split('/'), pattern = '', keys = [];
  (arr[0] === '') && arr.shift();
  arr.forEach((p, i) => {
    switch (p[0]) {
      case '*':
        pattern += '/(.+)';
        keys.push(p.substring(1) || `$${i}`);
        break;
      case ':':
        const o = p.substr(-1);
        const r = '([^/]+?)';
        const m = {
          '?': `(?:/${r})?`,
          '*': '(?:/)(.*)'
        };
        pattern += m[o] || `/${r}`;
        keys.push(p.substring(1, p.length - !!m[o]));
        break;
      default:
        pattern += `/${p}`;
        break;
    }
  });
  keys.length && (pattern += '(?:/)?');
  pattern = new RegExp(`^${pattern}\/?$`, 'i');
  pattern.keys = keys;
  pattern.parse = function (pathname) {
    if (this.test(pathname) === false) return null;
    return this.exec(pathname).slice(1).reduce((params, param, i) => {
      params[this.keys[i]] = param && decodeURIComponent(param);
      return params;
    }, {});
  };
  return pattern;
};

export function useRouter(routes) {
  const [component, render] = useState(null);

  _render = render;
  _routes = Object.entries(routes).map(([path, component]) => {
    const regexp = pathToRegexp(path);
    return {
      path,
      regexp,
      component,
    };
  });

  useEffect(() => {
    window.addEventListener('popstate', process);
    setTimeout(() => process(), 1000)
  }, []);
  return component;
}

const find = pathname => {
  for (const route of _routes) {
    const { regexp, component } = route;
    if (regexp.test(pathname)) {
      const props = regexp.parse(pathname);
      return component(props);
    }
  }
};

const process = () => {
  const pathname = location.hash.slice(1) || '/';
  const component = find(pathname);
  console.log(pathname, component);
  _render(component);
};

export function push(url) {
  window.history.pushState(null, null, `#${url}`);
  process();
}