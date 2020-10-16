import { ready, querySelector as $ } from 'https://lsong.org/scripts/dom.js';
import { getJSON } from 'https://lsong.org/scripts/http.js';
import { format } from 'https://lsong.org/scripts/string.js';

const renderHTML = (templateId, data) => {
  const templateElement = $(templateId);
  const template = templateElement.innerHTML;
  return format(template, data);
};

const render = (templateId, data) => {
  const element = document.createElement('div');
  element.innerHTML = renderHTML(templateId, data);
  return element.firstElementChild;
};

const renderMap = {
  albums(album) {
    return renderHTML('#tmpl-album', album);
  },
  songs(song) {
    return renderHTML('#tmpl-song', song);
  }
};

ready(async () => {
  const app = $('#app');
  const data = await getJSON(`./data/data.json`);
  for (const section of data) {
    const { type, title, list } = section;
    const content = list.map(renderMap[type]).join('');
    const element = render('#tmpl-section', { type, title, content });
    app.appendChild(element);
  }

});