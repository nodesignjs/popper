import type { EmitType, PLACEMENT } from './constant';

export interface Position {
  position: PLACEMENT,
  xy?: number[];
  arrowXY?: number[];
}
export type Rect = { left: number, top: number, width: number, height: number }
export interface PopperConfig {
  content: Element;
  emit?: EmitType,
  clickOutsideClose?: boolean;
  openDelay?: number;
  closeDelay?: number;
  open?: boolean;
  enterable?: boolean;
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
  onClickOutside?: () => void;
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
