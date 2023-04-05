# [Popper](https://cosmo-design.github.io/popper/)

[![npm version](https://img.shields.io/npm/v/@cosmo-design/popper?logo=npm)](https://github.com/cosmo-design/popper) 
[![npm version](https://img.shields.io/bundlephobia/minzip/@cosmo-design/popper)](https://github.com/cosmo-design/popper)

Popper is a small yet powerful popper library that can automatically pop up at a suitable position adjacent to the trigger. It also supports virtual elements, which can be used in canvas and CSS class animations.

[Playground](https://cosmo-design.github.io/popper/)

[![@cosmo-design/popper](./demo/p.png)](https://cosmo-design.github.io/popper/)

[中文文档](./README_zh.md)

## Install

```
npm i @cosmo-design/popper
```

or via CDN

```html
<script src="https://unpkg.com/@cosmo-design/popper@latest/dist/index.min.js"></script>
<script>
  console.log(popper)
</script>
```

## Usage

```js
import Popper, { PLACEMENT, EmitType } from '@cosmo-design/popper'

const container = document.querySelector('.container'); // default: document.body
const trigger = document.querySelector('.trigger'); 
// or virtual element. type: { getBoundingClientRect: () =>  { left: number, top: number, width: number, height: number } }

const content = document.createElement('div'); // You need to pop up the displayed content
content.classList.add('content');

const popper = new Popper({
  container,
  trigger, // required
  content, // required
  placement: PLACEMENT.T, // Set the position of the popper
  emit: EmitType.HOVER // Set to open the popper when the mouse hovers over the trigger
})

trigger.onclick = () => {
  popper.toggle()
  // or
  // if (popper.opened) {
  //   popper.close();
  // } else {
  //   popper.open();
  // }
}

// if you don't need it anymore
popper.destroy()
```

### CSS Animation

The cssName parameter allows you to add CSS animations when showing and hiding the popper.

```js
const popper = new Popper({
  cssName: 'fade'
})
```

Popper will add the following 6 classes through the cssName.

```js
`${cssName}-enter-from` // Starts displaying and is removed in the next frame.
`${cssName}-enter-active` // Added in the next frame and removed when the animation ends.
`${cssName}-enter-to` // Added in the next frame and removed when the animation ends.
`${cssName}-exit-from` // Starts hiding and is removed in the next frame.
`${cssName}-exit-active` // Added in the next frame and removed when the animation ends.
`${cssName}-exit-to` // Added in the next frame and removed when the animation ends.
`${cssName}-${PLACEMENT}` // Current popper placement
```

You can write CSS styles like this:

```css
.fade-enter-from, .fade-exit-to {
  transform: scale(.7);
  opacity: 0;
}
.fade-enter-active, .fade-exit-active {
  transition: transform .1s ease, opacity .1s ease;
}
```

### Arrow

The arrow parameter allows you to add a custom arrow element.

```js
const arrow = document.createElement('div')
arrow.classList.add('arrow')

const popper = new Popper({
  arrow
})
```

```css
.arrow {
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
  transform-origin: center;
  background: #000;
}
```

Alternatively, an arrow can be quickly created using the built-in `createArrow` function.

```ts
import Popper, { createArrow } from '@cosmo-design/popper' 

const popper = new Popper({
  arrow: createArrow({ background: '#000' })
})
```

### Scroll

The autoScroll parameter controls whether the popper automatically scrolls with the trigger element when it is scrolled.

The closeOnScroll parameter controls whether the popper automatically closes when the trigger element is scrolled.

The hideOnInvisible parameter controls whether the popper automatically hides when the trigger element is not visible on the screen.

### AutoUpdate

The autoUpdate parameter controls whether the popper's position is automatically updated when the size of the container, content, or trigger element changes. This feature relies on the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

The autoPlacement parameter controls whether the popper's position is automatically adjusted to ensure that it is fully displayed when there is not enough space.

### Hook

Popper provides rich hook functions that can execute code during various stages of the popper's lifecycle.

```js
new Popper({
  onBeforeEnter() {
    // Executed before the CSS display animation starts.
  },
  onEntered() {
    // Executed after the CSS display animation completes.
  },
  onBeforeExit() {
    // Executed before the CSS hide animation starts.
  },
  onExited() {
    // Executed after the CSS hide animation completes.
  },
  onBeforePosition(pos) {
    // Executed before setting the popper's position.
    // pos.position: the final display position.
    // pos.xy: the position of the popper, undefined means not displayed.
    // pos.arrowXY: the position of the arrow, undefined means not displayed.
    // You can modify xy and arrowXY directly to change the final position.
    if (pos.xy) pos.xy[0] += 10
    if (pos.arrowXY) pos.arrowXY[0] += 10
  },
  onOpen() {
    // Executed when the popper is displayed.
  },
  onClose() {
    // Executed when the popper is closed.
  }
})
```

### Virtual Element

The trigger parameter can be a virtual element in addition to a DOM element. This allows you to use Popper with canvas. When the canvas is scrolled, you can manually call the `popper.onScroll()` method to trigger the popper to scroll.

```js
const popper = new Popper({
  trigger: {
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    }
  }
})

canvas.on('scroll', () => popper.onScroll())
```

## API

### Config

| Name | Type | Default | Description |
| -- | -- | -- | -- |
| `container` | `HTMLElement` | `document.body` | The container of the popper. |
| `content` | `Element` | | Required. The content element to be popped up |
| `trigger` | `{ getBoundingClientRect: () => Rect } \| Element` | | Required. The trigger element |
| `arrow` | `Element` | | The arrow element. |
| `placement` | `PLACEMENT` | `PLACEMENT.T` | The placement of the popper. |
| `translate` | `[number, number]` | `[0, 0]` | The custom xy offset. |
| `autoPlacement` | `boolean` | `true` | Whether to automatically switch the position when there is not enough space. |
| `autoUpdate` | `boolean` | `true` | Whether to automatically update the position when the container, content, or trigger size changes. |
| `autoScroll` | `boolean` | `true` | Whether to automatically follow the trigger element when it is scrolled. |
| `cssName` | `string` | | The CSS animation class name. |
| `emit` | `EmitType` |  | Trigger emit type |
| `clickOutsideClose` | `boolean` | `true` | Automatically close the popper when clicking outside |
| `openDelay` | `number` | | Open delay |
| `closeDelay` | `number` | `50` | Close delay |
| `open` | `boolean` | | Is it enabled by default |
| `disabled` | `boolean` | | Disabled |
| `triggerOpenClass` | `string` | | The `class` added to the `trigger` when the popper is opened. |
| `enterable` | `boolean` | `true` | When `emit` is set to `hover`, can the mouse enter the popper |
| `overflowHidden` | `boolean` | automatically detected | Whether the container has overflow hidden. |
| `coverTrigger` | `boolean` | | Whether to cover the trigger element with the popper. |
| `closeOnScroll` | `boolean` | | Whether to automatically close the popper when the trigger element is scrolled. |
| `hideOnInvisible` | `boolean` | | Whether to automatically hide the popper when the trigger element is invisible on the screen. |
| `onBeforeEnter` | `() => void` | | Called before the CSS enter animation starts. |
| `onEntered` | `() => void` | | 	Called when the CSS enter animation ends. |
| `onBeforeExit` | `() => void` | | Called before the CSS exit animation starts. |
| `onExited` | `() => void` | | Called when the CSS exit animation ends. |
| `onBeforePosition` | `(pos: Position) => void` | | Called before setting the position of the popper. You can modify the pos object to set the final position of the popper. |
| `onOpen` | `() => void` | | Called when the popper is opened. |
| `onClose` | `() => void` | |Called when the popper is closed. |
| `onClickOutside` | `() => void` | | When the popper is closed. |

### Property

| Name | Type | Description |
| -- | -- | -- |
| `el` | `HTMLElement` | The popper element |
| `config` | `PopperConfig` | Popper configuration object |
| `opened` | `boolean` | Indicates whether the popper is currently displayed |
| `isAnimating` | `boolean` | Indicates whether a CSS animation is currently in progress |

### Methods

#### open()

Open the Popper instance.

```ts
open(): void;
```

#### close()

Close the Popper instance.

```ts
close(): void;
```

#### toggle()

Toggle the Popper instance open or close.

```ts
toggle(): void;
```

#### openWithDelay()

Open the popper after `config.openDelay` time.

```ts
openWithDelay(): void;
```

#### closeWithDelay()

Close the popper after `config.closeDelay` time.

```ts
closeWithDelay(): void;
```

#### enable()

Enable.

```ts
enable(): void
```

#### disable()

Disable and close popper.

```ts
disable(): void
```

#### updateConfig()

Update config.

```ts
updateConfig(config: Partial<PopperConfig>): void;
```

#### destroy()

Destroy the Popper instance.

```ts
destroy(): void;
```

#### onScroll()

Manually trigger the `onScroll` event. Generally only used when using a virtual element.

```ts
onScroll(): void;
```

#### update()

Manually update the position of the Popper instance.

```ts
update(): void;
```

### Utils

Popper also provides utility methods for quickly creating `arrow` elements.

```ts
import Popper, { createArrow } from '@cosmo-design/popper'

new Popper({
  arrow: createArrow()
})
```

#### createArrow()

Quickly create `arrow` DOM elements that can accept CSS style objects and class names as parameters.

```ts
createArrow(style?: CSSStyleDeclaration, className?: string): HTMLElement;
```
