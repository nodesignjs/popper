import {
  addClass, Destroyable, removeClass, destroy, throttle, $, getChangedAttrs,
} from 'wblib';
import type {
  Position, Rect, PopperConfig, CssName, TransitionInfo,
} from './type';
import { EmitType, PLACEMENT } from './constant';

function getConfig(config: PopperConfig) {
  return {
    container: document.body,
    placement: PLACEMENT.T,
    autoPlacement: true,
    autoUpdate: true,
    autoScroll: true,
    translate: [0, 0],
    clickOutsideClose: true,
    enterable: true,
    closeDelay: 50,
    ...config,
  } as PopperConfig;
}

export function createArrow(style?: CSSStyleDeclaration, cls?: string) {
  const el = $();
  if (cls) addClass(el, cls);
  Object.assign(el.style, {
    width: '12px',
    height: '12px',
    transform: 'rotate(45deg)',
    transformOrigin: 'center',
    ...style,
  });
  return el as HTMLElement;
}

export class Popper implements Destroyable {
  el!: HTMLElement;

  config!: PopperConfig;

  opening = false;

  isAnimating = false;

  private closed = true;

  private cel!: HTMLElement;

  private cssName?: CssName;

  private showRaf?: any;

  private hideRaf?: any;

  private showTransInfo?: ReturnType<typeof getTransitionInfo>;

  private hideTransInfo?: ReturnType<typeof getTransitionInfo>;

  private clearShow?: () => void;

  private clearHide?: () => void;

  private scrollEls?: HTMLElement[];

  private isTriggerEl!: boolean;

  private arrowEl?: HTMLElement;

  private popHide = false;

  private arrowHide = false;

  private ro?: ResizeObserver;

  private openTimer?: any;

  private closeTimer?: any;

  constructor(config: PopperConfig) {
    if (config) this.init(config);
  }

  protected init(config: PopperConfig) {
    const oldContainer = config.container;
    config = this.config = getConfig(config);

    this.cel = $();
    const { style } = this.cel;
    style.position = 'absolute';
    style.left = style.top = '0';

    const {
      content, container, trigger,
    } = config;

    const info = getContainerInfo(container!);
    if (config.overflowHidden == null) config.overflowHidden = info.clip;
    if (oldContainer && !info.position || info.position === 'static') {
      container!.style.position = 'relative';
    }

    this.el = this.cel.appendChild($());
    this.el.appendChild(content);

    this.isTriggerEl = trigger instanceof Element;
    if (config.autoUpdate) this.observe();

    if (this.needListenScroll()) {
      this.scrollEls = getScrollElements(trigger as HTMLElement, container!);
    }

    if (config.arrow) {
      this.arrowEl = createArrowWrapper();
      this.arrowEl.appendChild(config.arrow);
      this.el.appendChild(this.arrowEl);
    }

    this.setCssName();
    this.addTriEv();
    this.addEnterEv();

    if (config.open) this.open();
  }

  update() {
    if (this.opening && !this.isAnimating) this.open();
  }

  updateConfig(config: Partial<PopperConfig>) {
    const changed = getChangedAttrs(config, this.config, true);
    if (!changed.length) return;

    changed.forEach(([k, n, o]) => {
      switch (k) {
        case 'content':
          this.el.removeChild(o as HTMLElement);
          if (n) this.el.appendChild(n as HTMLElement);
          break;
        case 'emit':
          if (this.isTriggerEl) {
            this.removeEmitEv();
            if (n) this.addTriEv();
          }
          this.removeEnterEv();
          this.addEnterEv();
          break;
        case 'container':
          if (!n) config.container = document.body;
          if (this.ro) {
            this.ro.unobserve(o as HTMLElement);
            this.ro.observe(config.container as HTMLElement);
          }
          break;
        case 'enterable':
          this.removeEnterEv();
          if (n) this.addEnterEv();
          break;
        case 'trigger': {
          const oldIsTriggerEl = this.isTriggerEl;
          if (oldIsTriggerEl) this.removeEmitEv(o as HTMLElement);
          this.isTriggerEl = n instanceof Element;
          if (this.ro) {
            if (oldIsTriggerEl) this.ro.unobserve(o as HTMLElement);
            if (this.isTriggerEl) this.ro.observe(n as HTMLElement);
          }
          if (this.isTriggerEl) this.addTriEv();
          const need = this.needListenScroll();
          if (need) {
            if (!this.scrollEls) {
              const c = this.config;
              this.scrollEls = getScrollElements(c.trigger! as HTMLElement, c.container!);
            }
          } else if (this.scrollEls) {
            this.removeScrollEv();
            this.scrollEls = undefined;
          }
        }
          break;
        case 'autoScroll':
        case 'closeOnScroll':
          {
            const need = this.needListenScroll();
            if (need) {
              if (!this.scrollEls) {
                const c = this.config;
                this.scrollEls = getScrollElements(c.trigger! as HTMLElement, c.container!);
                if (this.opening) {
                  this.scrollEls?.forEach((x) => {
                    x.addEventListener('scroll', this.onScroll, { passive: true });
                  });
                }
              }
            } else if (this.scrollEls) {
              this.removeScrollEv();
              this.scrollEls = undefined;
            }
          }
          break;
        case 'arrow':
          if (this.arrowEl) {
            this.arrowEl.removeChild(o as HTMLElement);
            if (!n) {
              this.el.removeChild(this.arrowEl);
              this.arrowEl = undefined;
            }
          }
          if (n) {
            this.arrowEl = this.arrowEl || createArrowWrapper();
            this.arrowEl.appendChild(n as HTMLElement);
            this.el.appendChild(this.arrowEl);
          }
          break;
        case 'autoUpdate':
          if (n) {
            if (!this.ro) this.observe();
          } else if (this.ro) {
            this.ro.disconnect();
            this.ro = undefined;
          }
          break;
        case 'cssName':
          this.setCssName();
          break;
      }
    });

    this.update();
  }

  destroy() {
    const { container } = this.config;
    if (this.ro) {
      this.ro.disconnect();
      this.ro = undefined;
    }
    if (this.opening) {
      try {
        container!.removeChild(this.cel);
      } catch (e) {
        //
      }
    }
    cancelAnimationFrame(this.showRaf);
    cancelAnimationFrame(this.hideRaf);
    this.clearShow?.();
    this.clearHide?.();
    this.isAnimating = true;
    this.opening = false;
    this.removeScrollEv();
    this.removeDocClick();
    this.removeEmitEv();
    this.removeEnterEv();
    destroy(this);
  }

  open() {
    this.closed = false;
    const {
      config, cssName, opening, el, arrowEl,
    } = this;
    const { container, trigger } = config;
    const fromHide = !opening;
    if (fromHide) {
      if (this.isAnimating) return;
      container!.appendChild(this.cel);
      this.scrollEls?.forEach((x) => {
        x.addEventListener('scroll', this.onScroll, { passive: true });
      });
      document.addEventListener('click', this.onDocClick);
    }
    this.opening = true;
    const popBcr = el.getBoundingClientRect();
    const containerBcr = container!.getBoundingClientRect();
    const arrowBcr = arrowEl?.getBoundingClientRect();
    let triggerBcr = trigger.getBoundingClientRect() as Rect;

    if (this.isTriggerEl) {
      triggerBcr = {
        left: triggerBcr.left - containerBcr.left,
        top: triggerBcr.top - containerBcr.top,
        width: triggerBcr.width,
        height: triggerBcr.height,
      };
    }

    this.isAnimating = true;
    if (fromHide && cssName) {
      const { onBeforeEnter } = config;
      if (onBeforeEnter) onBeforeEnter();
      addClass(el, cssName.enterFrom);
      this.showRaf = requestAnimationFrame(() => {
        removeClass(el, cssName.enterFrom);
        addClass(el, cssName.enterActive);
        addClass(el, cssName.enterTo);
        const info = this.getTransitionInfo(el, this.showTransInfo);
        this.showTransInfo = info.info;
        this.clearShow = info.clear;
        info.promise.then(this.onShowTransitionEnd);
      });
    } else {
      requestAnimationFrame(() => {
        this.isAnimating = false;
      });
    }

    const ret = getPopStyle(
      config.placement!,
      containerBcr,
      triggerBcr,
      popBcr,
      config.translate!,
      config.autoPlacement,
      config.overflowHidden,
      config.coverTrigger,
      arrowBcr,
      config.hideOnInvisible,
    );

    const { onBeforePosition, onOpen } = config;
    if (onBeforePosition) onBeforePosition(ret);

    if (ret.xy) {
      if (this.popHide) {
        this.popHide = false;
        showDom(this.cel);
      }
      this.cel.style.transform = `translate3d(${ret.xy[0]}px,${ret.xy[1]}px,0)`;
    } else if (!this.popHide) {
      hideDom(this.cel);
      this.popHide = true;
    }
    if (arrowEl) {
      if (ret.arrowXY) {
        if (this.arrowHide) {
          this.arrowHide = false;
          showDom(arrowEl);
        }
        arrowEl.style.transform = `translate(${ret.arrowXY[0]}px,${ret.arrowXY[1]}px)`;
      } else if (!this.arrowHide) {
        this.arrowHide = true;
        hideDom(arrowEl);
      }
    }

    if (fromHide && onOpen) onOpen();
  }

  close() {
    this.closed = true;
    if (this.isAnimating || !this.opening) return;
    this.opening = false;

    const { config, cssName, el } = this;
    const { onClose } = config;
    if (cssName) {
      const { onBeforeExit } = config;
      if (onBeforeExit) onBeforeExit();
      addClass(el, cssName.exitFrom);
      this.isAnimating = true;
      this.hideRaf = requestAnimationFrame(() => {
        removeClass(el, cssName.exitFrom);
        addClass(el, cssName.exitActive);
        addClass(el, cssName.exitTo);
        const info = this.getTransitionInfo(el, this.hideTransInfo);
        this.hideTransInfo = info.info;
        this.clearHide = info.clear;
        info.promise.then(this.onHideTransitionEnd);
      });
    } else {
      config.container!.removeChild(this.cel);
    }

    this.removeScrollEv();
    this.removeDocClick();
    if (onClose) onClose();
    document.removeEventListener('click', this.onDocClick);
  }

  toggle() {
    if (this.opening) {
      this.close();
    } else {
      this.open();
    }
  }

  onScroll = throttle(() => {
    if (this.config.closeOnScroll) {
      this.close();
    } else {
      this.update();
    }
  });

  openWithDelay() {
    this.clearOCTimer();
    const { openDelay } = this.config;
    if (openDelay) {
      this.openTimer = setTimeout(() => {
        this.open();
      }, openDelay);
    } else {
      this.open();
    }
  }

  closeWithDelay() {
    this.clearOCTimer();
    const { closeDelay } = this.config;
    if (closeDelay) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, closeDelay);
    } else {
      this.close();
    }
  }

  private onTriClick = () => {
    if (this.opening) {
      this.closeWithDelay();
    } else {
      this.openWithDelay();
    }
  };

  private onTriEnter = () => {
    this.clearOCTimer();
    if (this.opening) return;
    this.openWithDelay();
  };

  private onTriLeave = () => {
    this.clearOCTimer();
    if (!this.opening) return;
    this.closeWithDelay();
  };

  private clearOCTimer = () => {
    clearTimeout(this.openTimer);
    clearTimeout(this.closeTimer);
  };

  private removeDocClick = () => {
    document.removeEventListener('click', this.onDocClick);
  };

  private removeEmitEv(el?: HTMLElement) {
    el = el || (this.config.trigger as HTMLElement);
    if (el instanceof Element) {
      (el as HTMLElement).removeEventListener('click', this.onTriClick);
      (el as HTMLElement).removeEventListener('mouseenter', this.onTriEnter);
      (el as HTMLElement).removeEventListener('mouseleave', this.onTriLeave);
    }
  }

  private onDocClick = ({ target }: MouseEvent) => {
    const { onClickOutside, clickOutsideClose } = this.config;

    if (onClickOutside || clickOutsideClose) {
      if (
        this.el?.contains((target as HTMLElement))
        || (this.isTriggerEl && (this.config.trigger as HTMLElement)?.contains(target as HTMLElement))
      ) return;
      onClickOutside?.();
      if (clickOutsideClose) this.closeWithDelay();
    }
  };

  private observe() {
    const { config } = this;
    const ro = this.ro = new ResizeObserver(() => this.update());
    ro.observe(this.el);
    ro.observe(config.container!);
    if (this.isTriggerEl) ro.observe(config.trigger as HTMLElement);
  }

  private addTriEv() {
    const { config } = this;
    if (this.isTriggerEl && config.emit) {
      const { trigger } = config;
      if (config.emit === EmitType.CLICK) {
        (trigger as HTMLElement).addEventListener('click', this.onTriClick);
      } else {
        (trigger as HTMLElement).addEventListener('mouseenter', this.onTriEnter);
        (trigger as HTMLElement).addEventListener('mouseleave', this.onTriLeave);
      }
    }
  }

  private addEnterEv() {
    const { config } = this;
    if (config.enterable && config.emit === EmitType.HOVER) {
      this.cel.addEventListener('mouseenter', this.clearOCTimer);
      this.cel.addEventListener('mouseleave', this.onTriLeave);
    }
  }

  private removeEnterEv() {
    this.cel.removeEventListener('mouseenter', this.clearOCTimer);
    this.cel.removeEventListener('mouseleave', this.onTriLeave);
  }

  private removeScrollEv() {
    this.scrollEls?.forEach((x) => x.removeEventListener('scroll', this.onScroll));
  }

  private getTransitionInfo(el: Element, info?: TransitionInfo) {
    let clear: undefined | (() => void);
    const promise = new Promise((resolve) => {
      const { event, timeout } = info || getTransitionInfo(el);
      if (timeout) {
        const fn = () => {
          clear?.();
          resolve(null);
        };
        el.addEventListener(event!, fn);
        const timer = setTimeout(() => {
          clear?.();
          resolve(null);
        }, timeout + 2);
        clear = () => {
          clearTimeout(timer);
          el.removeEventListener(event!, fn);
        };
      } else {
        requestAnimationFrame(resolve);
      }
    });

    return {
      promise,
      clear,
      info,
    };
  }

  private onShowTransitionEnd = () => {
    const { cssName, el } = this;
    const { onEntered } = this.config;
    removeClass(el, cssName!.enterActive);
    removeClass(el, cssName!.enterTo);
    this.isAnimating = false;
    if (onEntered) onEntered();
    if (this.closed) this.closeWithDelay();
  };

  private onHideTransitionEnd = () => {
    const { cssName, config, el } = this;
    const { onExited } = config;
    config.container!.removeChild(this.cel);
    removeClass(el, cssName!.exitActive);
    removeClass(el, cssName!.exitTo);
    this.isAnimating = false;
    if (onExited) onExited();
    if (!this.closed) this.openWithDelay();
  };

  private needListenScroll() {
    const { config } = this;
    return this.isTriggerEl && config.container && (config.autoScroll || config.closeOnScroll);
  }

  private setCssName() {
    const { cssName } = this.config;
    this.cssName = cssName ? {
      enterFrom: `${cssName}-enter-from`,
      enterActive: `${cssName}-enter-active`,
      enterTo: `${cssName}-enter-to`,
      exitFrom: `${cssName}-exit-from`,
      exitActive: `${cssName}-exit-active`,
      exitTo: `${cssName}-exit-to`,
    } : undefined;
  }
}

function getPopupOffset(
  position: PLACEMENT,
  triggerRect: Rect,
  popWH: Rect,
  translate: number[],
) {
  switch (position) {
    case PLACEMENT.T:
      return [
        triggerRect.left + triggerRect.width / 2 - popWH.width / 2 + translate[0],
        triggerRect.top - popWH.height + translate[1],
      ];
    case PLACEMENT.TL:
      return [
        triggerRect.left + translate[0],
        triggerRect.top - popWH.height + translate[1],
      ];
    case PLACEMENT.TR:
      return [
        triggerRect.left + triggerRect.width - popWH.width + translate[0],
        triggerRect.top - popWH.height + translate[1],
      ];
    case PLACEMENT.B:
      return [
        triggerRect.left + triggerRect.width / 2 - popWH.width / 2 + translate[0],
        triggerRect.top + triggerRect.height + translate[1],
      ];
    case PLACEMENT.BL:
      return [
        triggerRect.left + translate[0],
        triggerRect.top + triggerRect.height + translate[1],
      ];
    case PLACEMENT.BR:
      return [
        triggerRect.left + triggerRect.width - popWH.width + translate[0],
        triggerRect.top + triggerRect.height + translate[1],
      ];
    case PLACEMENT.L:
      return [
        triggerRect.left - popWH.width + translate[0],
        triggerRect.top + triggerRect.height / 2 - popWH.height / 2 + translate[1],
      ];
    case PLACEMENT.LT:
      return [
        triggerRect.left - popWH.width + translate[0],
        triggerRect.top + translate[1],
      ];
    case PLACEMENT.LB:
      return [
        triggerRect.left - popWH.width + translate[0],
        triggerRect.top + triggerRect.height - popWH.height + translate[1],
      ];
    case PLACEMENT.R:
      return [
        triggerRect.left + triggerRect.width + translate[0],
        triggerRect.top + triggerRect.height / 2 - popWH.height / 2 + translate[1],
      ];
    case PLACEMENT.RT:
      return [
        triggerRect.left + triggerRect.width + translate[0],
        triggerRect.top + translate[1],
      ];
    case PLACEMENT.RB:
      return [
        triggerRect.left + triggerRect.width + translate[0],
        triggerRect.top + triggerRect.height - popWH.height + translate[1],
      ];
    default:
      return [0, 0];
  }
}

function getBoundaryPosition(position: PLACEMENT) {
  switch (position) {
    case PLACEMENT.T:
    case PLACEMENT.TL:
    case PLACEMENT.TR:
      return PLACEMENT.T;
    case PLACEMENT.B:
    case PLACEMENT.BL:
    case PLACEMENT.BR:
      return PLACEMENT.B;
    case PLACEMENT.L:
    case PLACEMENT.LT:
    case PLACEMENT.LB:
      return PLACEMENT.L;
    case PLACEMENT.R:
    case PLACEMENT.RT:
    case PLACEMENT.RB:
      return PLACEMENT.R;
    default:
      return PLACEMENT.T;
  }
}

function changePosition(
  position: PLACEMENT,
  direction: ReturnType<typeof getBoundaryPosition>,
): PLACEMENT {
  switch (direction) {
    case PLACEMENT.T:
      switch (position) {
        case PLACEMENT.B:
          return PLACEMENT.T;
        case PLACEMENT.BL:
          return PLACEMENT.TL;
        case PLACEMENT.BR:
          return PLACEMENT.TR;
        default:
          return position;
      }
    case PLACEMENT.B:
      switch (position) {
        case PLACEMENT.T:
          return PLACEMENT.B;
        case PLACEMENT.TL:
          return PLACEMENT.BL;
        case PLACEMENT.TR:
          return PLACEMENT.BR;
        default:
          return position;
      }
    case PLACEMENT.L:
      switch (position) {
        case PLACEMENT.R:
          return PLACEMENT.L;
        case PLACEMENT.RT:
          return PLACEMENT.LT;
        case PLACEMENT.RB:
          return PLACEMENT.LB;
        default:
          return position;
      }
    case PLACEMENT.R:
      switch (position) {
        case PLACEMENT.L:
          return PLACEMENT.R;
        case PLACEMENT.LT:
          return PLACEMENT.RT;
        case PLACEMENT.LB:
          return PLACEMENT.RB;
        default:
          return position;
      }
    default:
      return position;
  }
}

function getFitPosition(
  position: PLACEMENT,
  popupPosition: number[],
  containerRect: Rect,
  popWH: Rect,
  triggerRect: Rect,
  translate: number[],
  direction: PLACEMENT,
  overflow?: boolean,
) {
  const viewPortSize = [
    document.documentElement.clientWidth || window.innerWidth,
    document.documentElement.clientHeight || window.innerHeight,
  ];

  const boundary = [
    overflow ? Math.max(containerRect.left, 0) : 0,
    overflow ? Math.max(containerRect.top, 0) : 0,
    overflow ? Math.min(containerRect.left + containerRect.width, viewPortSize[0]) : viewPortSize[0],
    overflow ? Math.min(containerRect.top + containerRect.height, viewPortSize[1]) : viewPortSize[1],
  ];
  const x = containerRect.left + popupPosition[0];
  const y = containerRect.top + popupPosition[1];
  const popRect = [
    containerRect.left + popupPosition[0],
    containerRect.top + popupPosition[1],
    x + popWH.width,
    y + popWH.height,
  ];
  const triggerX = containerRect.left + triggerRect.left;
  const triggerY = containerRect.top + triggerRect.top;
  const triggerEx = triggerX + triggerRect.width;
  const triggerEy = triggerY + triggerRect.height;
  let finalPosition = position;
  if (direction === PLACEMENT.T) {
    if (y < boundary[1]) {
      if (boundary[3] - triggerEy + translate[1] >= popWH.height && triggerEy - translate[1] >= boundary[1]) {
        popupPosition[1] = getPopupOffset(PLACEMENT.B, triggerRect, popWH, [translate[0], -translate[1]])[1];
        finalPosition = changePosition(position, PLACEMENT.B);
      } else {
        popupPosition[1] = overflow ? 0 : -containerRect.top;
      }
    } else if (popRect[3] > boundary[3]) {
      popupPosition[1] = overflow ? containerRect.height - popWH.height : viewPortSize[1] - containerRect.top - popWH.height;
    }
  } else if (direction === PLACEMENT.B) {
    if (popRect[3] > boundary[3]) {
      if (triggerY - boundary[1] - translate[1] >= popWH.height && triggerY - translate[1] <= boundary[3]) {
        popupPosition[1] = getPopupOffset(PLACEMENT.T, triggerRect, popWH, [translate[0], -translate[1]])[1];
        finalPosition = changePosition(position, PLACEMENT.T);
      } else {
        popupPosition[1] = overflow ? containerRect.height - popWH.height : viewPortSize[1] - containerRect.top - popWH.height;
      }
    } else if (y < boundary[1]) {
      popupPosition[1] = overflow ? 0 : -containerRect.top;
    }
  } else if (direction === PLACEMENT.L) {
    if (x < boundary[0]) {
      if (boundary[2] - triggerEx + translate[0] >= popWH.width && triggerEx - translate[0] >= boundary[0]) {
        finalPosition = changePosition(position, PLACEMENT.R);
        popupPosition[0] = getPopupOffset(PLACEMENT.R, triggerRect, popWH, [-translate[0], translate[1]])[0];
      } else {
        popupPosition[0] = overflow ? 0 : -containerRect.left;
      }
    } else if (popRect[2] > boundary[2]) {
      popupPosition[0] = overflow ? containerRect.width - popWH.width : viewPortSize[0] - containerRect.left + popWH.width;
    }
  } else if (direction === PLACEMENT.R) {
    if (popRect[2] > boundary[2]) {
      if (triggerX - boundary[0] - translate[0] >= popWH.width && triggerX - translate[0] <= boundary[2]) {
        finalPosition = changePosition(position, PLACEMENT.L);
        popupPosition[0] = getPopupOffset(PLACEMENT.L, triggerRect, popWH, [-translate[0], translate[1]])[0];
      } else {
        popupPosition[0] = overflow ? containerRect.width - popWH.width : viewPortSize[0] - containerRect.left + popWH.width;
      }
    } else if (x < boundary[0]) {
      popupPosition[0] = overflow ? 0 : -containerRect.left;
    }
  }

  if (direction === PLACEMENT.T || direction === PLACEMENT.B) {
    if (x < boundary[0]) {
      popupPosition[0] = overflow ? 0 : -containerRect.left;
    } else if (popRect[2] > boundary[2]) {
      popupPosition[0] = overflow ? containerRect.width - popWH.width : viewPortSize[0] - containerRect.left + popWH.width;
    }
  } else if (direction === PLACEMENT.L || direction === PLACEMENT.R) {
    if (y < boundary[1]) {
      popupPosition[1] = overflow ? 0 : -containerRect.top;
    } else if (popRect[3] > boundary[3]) {
      popupPosition[1] = overflow ? containerRect.height - popWH.height : viewPortSize[1] - containerRect.top - popWH.height;
    }
  }

  return finalPosition;
}

function getPopStyle(
  position: PLACEMENT,
  containerRect: Rect,
  triggerRect: Rect,
  popWH: Rect,
  translate: number[],
  // eslint-disable-next-line default-param-last
  autoFit = true,
  overflow?: boolean,
  coverTrigger?: boolean,
  arrowWH?: Rect,
  hideOnInvisible?: boolean,
): Position {
  const triggerOut = triggerRect.left >= containerRect.width
  || triggerRect.top >= containerRect.height
  || triggerRect.left + triggerRect.width <= 0
  || triggerRect.top + triggerRect.height <= 0;

  if (hideOnInvisible && triggerOut) {
    return { position };
  }

  let der = getBoundaryPosition(position);
  if (coverTrigger) {
    translate = [...translate];
    if (der === PLACEMENT.T) {
      translate[1] += triggerRect.height;
    } else if (der === PLACEMENT.B) {
      translate[1] -= triggerRect.height;
    } else if (der === PLACEMENT.L) {
      translate[0] += triggerRect.width;
    } else {
      translate[0] -= triggerRect.width;
    }
  }

  const popupPosition = getPopupOffset(position, triggerRect, popWH, translate);

  if (autoFit) {
    position = getFitPosition(
      position,
      popupPosition,
      containerRect,
      popWH,
      triggerRect,
      translate,
      der,
      overflow,
    );
  }

  let arrowXY: undefined | number[];
  if (!triggerOut && arrowWH) {
    der = getBoundaryPosition(position);
    arrowXY = [];
    const half = [arrowWH.width / 2, arrowWH.height / 2];
    const isL = der === PLACEMENT.L;
    if (isL || der === PLACEMENT.R) {
      arrowXY[1] = triggerRect.top + triggerRect.height / 2 - popupPosition[1] - half[1];
      if (arrowXY[1] < half[1] || arrowXY[1] > popWH.height - arrowWH.height - half[1]) {
        arrowXY = undefined;
      } else {
        arrowXY[0] = (isL ? popWH.width : 0) - half[0];
      }
    } else {
      arrowXY[0] = triggerRect.left + triggerRect.width / 2 - popupPosition[0] - half[0];
      if (arrowXY[0] < half[0] || arrowXY[0] > popWH.width - arrowWH.width - half[0]) {
        arrowXY = undefined;
      } else {
        arrowXY[1] = (der === PLACEMENT.T ? popWH.height : 0) - half[1];
      }
    }
  }

  return {
    xy: popupPosition,
    arrowXY,
    position,
  };
}

function createArrowWrapper() {
  const arrowEl = $();
  const style = arrowEl.style;
  style.position = 'absolute';
  style.left = style.top = '0';
  style.zIndex = '-1';
  return arrowEl;
}

function getTransitionInfo(el: Element): TransitionInfo {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key: keyof typeof styles) => ((styles[key] || '') as any).split(', ');
  const transitionDelays = getStyleProperties('transitionDelay');
  const transitionDurations = getStyleProperties('transitionDuration');
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties('animationDelay');
  const animationDurations = getStyleProperties('animationDuration');
  const animationTimeout = getTimeout(animationDelays, animationDurations);

  const timeout = Math.max(transitionTimeout, animationTimeout);

  return {
    event: timeout > 0 ? transitionTimeout > animationTimeout ? 'transitionend' : 'animationend' : undefined,
    timeout,
  };
}

function getTimeout(delays: string[], durations: string[]): number {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}

function toMs(s: string): number {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function getContainerInfo(element: Element) {
  const {
    overflow, overflowX, overflowY, position,
  } = window.getComputedStyle(element);
  const o = overflow + overflowY + overflowX;
  return {
    clip: o.includes('hidden') || o.includes('clip'),
    position,
  };
}

function hideDom(el: HTMLElement) {
  const { style } = el;
  style.opacity = '0';
  style.pointerEvents = 'none';
}
function showDom(el: HTMLElement) {
  const { style } = el;
  style.opacity = style.pointerEvents = '';
}

function isScrollElement(element: HTMLElement) {
  return (
    element.scrollHeight > element.offsetHeight
    || element.scrollWidth > element.offsetWidth
  );
}

function getScrollElements(el: HTMLElement, container: HTMLElement) {
  const scrollElements: HTMLElement[] = [];
  while (el && el !== container) {
    if (isScrollElement(el)) {
      scrollElements.push(el);
    }
    el = el.parentElement!;
  }
  if (scrollElements.length) return scrollElements;
}
