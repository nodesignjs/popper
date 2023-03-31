import type { PLACEMENT } from './constant';

export interface Position {
  position: PLACEMENT,
  xy?: number[];
  arrowXY?: number[];
}
export type Rect = { left: number, top: number, width: number, height: number }
export interface PopperConfig {
  content: Element;
  container?: HTMLElement;
  trigger: { getBoundingClientRect: () => Rect } | Element;
  arrow?: Element;
  placement?: PLACEMENT;
  translate?: number[];
  autoPlacement?: boolean;
  autoUpdate?: boolean;
  autoScroll?: boolean;
  cssName?: string;
  overflowHidden?: boolean;
  coverTrigger?: boolean;
  closeOnScroll?: boolean;
  hideOnInvisible?: boolean;
  onBeforeEnter?: () => void;
  onEntered?: () => void;
  onBeforeExit?: () => void;
  onExited?: () => void;
  onBeforePosition?: (pos: Position) => void;
  onOpen?: () => void;
  onClose?: () => void;
}
export interface CssName {
  enterFrom: string,
  enterActive: string,
  enterTo: string,
  exitFrom: string,
  exitActive: string,
  exitTo: string
}
export interface TransitionInfo {
  event?: 'transitionend' | 'animationend';
  timeout: number;
}