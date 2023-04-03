import {
  Popper, createArrow, PLACEMENT, EmitType,
} from '../src';

window.onload = function () {
  const container = document.querySelector('.container')! as HTMLElement;
  const c = document.querySelector('.c')! as HTMLElement;
  const btn = document.querySelector('#btn')! as HTMLElement;
  const content = document.createElement('div');
  content.classList.add('content');

  const cbb = container.getBoundingClientRect();

  c.scrollTop = (2000 - cbb.height) / 2 + 10;
  c.scrollLeft = (2000 - cbb.width) / 2 + 10;

  // btn.onclick = () => {
  //   popup.toggle();
  // };

  const arrow = createArrow(undefined, 'arrow');

  const config = {
    container,
    content,
    trigger: btn,
    autoPlacement: true,
    autoUpdate: true,
    autoScroll: true,
    translate: [0, -10],
    arrow,
    cssName: 'fade',
    placement: PLACEMENT.T,
    openDelay: 0,
    closeDelay: 50,
    emit: EmitType.CLICK,
    open: true,
  };
  const popup = new Popper(config as any);

  const update = () => {
    popup.updateConfig(config);
  };

  const selection = document.querySelector('.section') as HTMLElement;
  selection.onchange = ({ target }) => {
    const { name, value, checked } = target as any;
    if (name === 'cb') {
      if (value === 'arrow') {
        config.arrow = (checked ? arrow : undefined) as any;
      } else if (value === 'css') {
        config.cssName = checked ? 'fade' : '';
      } else {
        config[value] = checked;
      }
      update();
    } else if (name === 'placement') {
      config.placement = value;
      update();
    } else if (name === 'emit') {
      config.emit = value || undefined;
      update();
    }
  };

  const transXs = document.querySelector('.translate-x-s') as HTMLElement;
  const transYs = document.querySelector('.translate-y-s') as HTMLElement;
  const openD = document.querySelector('.open-delay') as HTMLElement;
  const closeD = document.querySelector('.close-delay') as HTMLElement;

  selection.oninput = ({ target }) => {
    const { name, value } = target as any;
    if (name === 'translateX') {
      transXs.textContent = `${value}px`;
      config.translate = [Number(value), config.translate[1]];
      update();
    } else if (name === 'translateY') {
      transYs.textContent = `${value}px`;
      config.translate = [config.translate[0], Number(value)];
      update();
    } else if (name === 'openDelay') {
      openD.textContent = `${value}ms`;
      config.openDelay = Number(value);
      update();
    } else if (name === 'closeDelay') {
      closeD.textContent = `${value}ms`;
      config.closeDelay = Number(value);
      update();
    }
  };
};
