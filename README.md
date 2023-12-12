# 🌃refr

[![npm](https://img.shields.io/npm/v/refr.svg)](https://www.npmjs.com/package/refr)
[![npm](https://img.shields.io/npm/dm/refr.svg)](https://www.npmjs.com/package/refr)
[![npm](https://img.shields.io/npm/l/refr.svg)](https://www.npmjs.com/package/refr)

- **Performance:** It's the fastest way to animate in React. It doesn't have to go through the React reconciler.
- **Familiar:** It's a hook, so you can use it in any function component.
- **Simple:** It's just a single function that you can call from anywhere.
- **Predictable:** You can cancel your animation at any time and it will run at 60fps.
- **Composable:** You can use it in conjunction with the state hook to create animations.
- **Extensible:** You can write your own hooks that depend on it.
- **Flexible:** You can use it to schedule updates or to set timeouts.

It's just a single function that you can call from anywhere. It's a hook that will run on every frame and give you the time delta. If you return `true` it will keep running, otherwise it will cancel.

You can also use it to set timeouts that will run on the next frame. This is useful when you want to force an update after a state change.

---

## Installation

```ruby
npm install refr
```

---

<table>
<td width="1000px" valign="top">

## Documentation

###### [Docs][docs] : refr Introduction

###### [API][api] : refr API and feature

###### [Guide][guide] : refr Getting Started

[docs]: https://refr.tsei.jp/docs
[api]: https://refr.tsei.jp/api
[guide]: https://refr.tsei.jp/guide

</td>
<td width="1000px" valign="top">

## Ecosystem

###### 🌇 [glre][glre]: GLSL Reactive Engine

###### ⛪️ [reev][reev]: reactive event state manager

[glre]: https://github.com/tseijp/refr
[refr]: https://github.com/tseijp/refr

</td>
<td width="1000px" valign="top">

## Staying informed

###### [github discussions][github] welcome✨

###### [@tseijp][twitter] twitter

###### [tsei.jp][articles] articles

[github]: https://github.com/tseijp/refr/discussions
[twitter]: https://twitter.com/tseijp
[articles]: https://tsei.jp/articles

</td>
</table>

---

## PRs

###### welcome✨

---

## API

```ts
import frame from 'refr'

// Schedule an update
frame.mount((dt) => {})

// Start an update loop
frame.mount((dt) => true)

// Cancel an update
frame.cancel(fn)

// Start the update loop
frame.start()

// Pause the update loop
frame.pause()

// Stop the update loop
frame.stop()

// Restart the update loop
frame.restart()

// Set a timeout that runs on nearest frame
frame.setTimeout(() => {}, 1000)

// Get the current time
frame.now() // => number
```

## Getting Started

```ts
import { useRef } from 'react'
import { useFrame } from 'refr'

function TrailSphere() {
        const ref = useRef()

        // Schedule an update
        useFrame((ts) => {})

        // Start an update loop
        useFrame((ts) => true)
}
```

## License

MIT
