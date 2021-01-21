import {
  createElement as h,
} from '../tinyact.js';

export const Panel = ({ className, title, children }) => {
  return h('div', { className: `panel ${className}` },
    h('div', { className: 'panel-header' }, title),
    h('div', { className: 'panel-body' }, children),
    h('div', { className: 'panel-footer' }),
  );
};