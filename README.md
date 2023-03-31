# [Popper](https://cosmo-design.github.io/popper/)

[![npm version](https://img.shields.io/npm/v/@cosmo-design/popper?logo=npm)](https://github.com/cosmo-design/popper) 
[![npm version](https://img.badgesize.io/https:/unpkg.com/@cosmo-design/popper/dist/index.min.js?compression=gzip)](https://github.com/cosmo-design/popper) 

Popper is a small yet powerful pop-up tool library that can automatically pop up at a suitable position adjacent to the trigger. It also supports virtual elements, which can be used in canvas and CSS class animations.

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
import Popper from '@cosmo-design/popper'

const container = document.querySelector('.container'); // default: document.body
const trigger = document.querySelector('.trigger'); 
// or virtual element. type: { getBoundingClientRect: () =>  { left: number, top: number, width: number, height: number } }

const content = document.createElement('div'); // You need to pop up the displayed content
content.classList.add('content');

const popper = new Popper({
  container,
  trigger, // required
  content, // required
})

trigger.onclick = () => {
  popper.toggle()
  // or
  // if (popper.opening) {
  //   popper.close();
  // } else {
  //   popper.open();
  // }
}

// if you don't need it anymore
popper.destroy()
```

### CSS Animation

The cssName parameter allows you to add CSS animations when showing and hiding a pop-up layer.

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

The autoScroll parameter controls whether the pop-up layer automatically scrolls with the trigger element when it is scrolled.

The closeOnScroll parameter controls whether the pop-up layer automatically closes when the trigger element is scrolled.

The hideOnInvisible parameter controls whether the pop-up layer automatically hides when the trigger element is not visible on the screen.

### AutoUpdate

The autoUpdate parameter controls whether the pop-up layer's position is automatically updated when the size of the container, content, or trigger element changes. This feature relies on the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

The autoPlacement parameter controls whether the pop-up layer's position is automatically adjusted to ensure that it is fully displayed when there is not enough space.

### Hook

Popper provides rich hook functions that can execute code during various stages of the pop-up layer's lifecycle.

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
    // Executed before setting the pop-up layer's position.
    // pos.position: the final display position.
    // pos.xy: the position of the pop-up layer, undefined means not displayed.
    // pos.arrowXY: the position of the arrow, undefined means not displayed.
    // You can modify xy and arrowXY directly to change the final position.
    if (pos.xy) pos.xy[0] += 10
    if (pos.arrowXY) pos.arrowXY[0] += 10
  },
  onOpen() {
    // Executed when the pop-up layer is displayed.
  },
  onClose() {
    // Executed when the pop-up layer is closed.
  }
})
```

### Virtual Element

The trigger parameter can be a virtual element in addition to a DOM element. This allows you to use Popper with canvas. When the canvas is scrolled, you can manually call the `popper.onScroll()` method to trigger the pop-up layer to scroll.

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

| Name | Type | Description |
| -- | -- | -- |
| `container` | `HTMLElement` | The container of the popup. Default value: `document.body`. |
| `content` | `Element` | The content element to be popped up |
| `trigger` | `{ getBoundingClientRect: () => Rect } \| Element` | The trigger element |
| `arrow` | `Element` | The arrow element. |
| `placement` | `PLACEMENT` | The placement of the popup. Default: 't'. |
| `translate` | `[number, number]` | The custom xy offset. |
| `autoPlacement` | `boolean` | Whether to automatically switch the position when there is not enough space. Default: `true`. |
| `autoUpdate` | `boolean` | Whether to automatically update the position when the container, content, or trigger size changes. Default: `true`. |
| `autoScroll` | `boolean` | Whether to automatically follow the trigger element when it is scrolled. Default: `true`. |
| `cssName` | `string` | The CSS animation class name. |
| `overflowHidden` | `boolean` | Whether the container has overflow hidden. Default: automatically detected. |
| `coverTrigger` | `boolean` | Whether to cover the trigger element with the popup. |
| `closeOnScroll` | `boolean` | Whether to automatically close the popup when the trigger element is scrolled. |
| `hideOnInvisible` | `boolean` | Whether to automatically hide the popup when the trigger element is invisible on the screen. |
| `onBeforeEnter` | `() => void` | Called before the CSS enter animation starts. |
| `onEntered` | `() => void` | 	Called when the CSS enter animation ends. |
| `onBeforeExit` | `() => void` | Called before the CSS exit animation starts. |
| `onExited` | `() => void` | Called when the CSS exit animation ends. |
| `onBeforePosition` | `(pos: Position) => void` | Called before setting the position of the popup. You can modify the pos object to set the final position of the popup. |
| `onOpen` | `() => void` | Called when the popup is opened. |
| `onClose` | `() => void` | Called when the popup is closed. |

### Property

| Name | Type | Description |
| -- | -- | -- |
| `el` | `HTMLElement` | The pop-up layer element |
| `config` | `PopperConfig` | Popper configuration object |
| `opening` | `boolean` | Indicates whether the pop-up layer is currently displayed |
| `isAnimation` | `boolean` | Indicates whether a CSS animation is currently in progress |

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