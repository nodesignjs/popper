import type { EmitType, PLACEMENT } from './constant';

export interface Position {
  position: PLACEMENT,
  xy?: number[];
  arrowXY?: number[];
  maxHeight?: number;
  maxWidth?: number;
}
export type Rect = { left: number, top: number, width: number, height: number }
export interface PopperConfig {
  content: Node;
  emit?: EmitType,
  clickOutsideClose?: boolean;
  clickOutsideIgnoreEl?: Element;
  openDelay?: number;
  closeDelay?: number;
  open?: boolean;
  maxHeight?: boolean;
  maxWidth?: boolean;
  changePosOnly?: boolean;
  disabled?: boolean;
  dragEl?: HTMLElement;
  enterable?: boolean;
  container?: HTMLElement;
  trigger: { getBoundingClientRect: () => Rect } | Element;
  arrow?: Node;
  triggerOpenClass?: string;
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
  keepDom?: boolean;
  useTriggerPos?: boolean;
  closeAni?: boolean;
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
