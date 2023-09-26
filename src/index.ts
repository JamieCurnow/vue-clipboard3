import Clipboard from 'clipboard'

interface Options {
  /** Fixes IE by appending element to body */
  appendToBody: boolean
}

export default (opts?: Options) => {
  // default appendToBody true
  const appendToBody = opts?.appendToBody === undefined ? true : opts.appendToBody
  return {
    toClipboard: (text: string, container?: HTMLElement) => {
      return new Promise((resolve, reject) => {
        // make fake element
        const fakeEl = document.createElement('button')
        // setup a new Clipboard.js
        const clipboard = new Clipboard(fakeEl, {
          text: () => text,
          action: () => 'copy',
          container: container !== undefined ? container : document.body
        })
        clipboard.on('success', (e) => {
          clipboard.destroy()
          resolve(e)
        })
        clipboard.on('error', (e) => {
          clipboard.destroy()
          reject(e)
        })
        // appendToBody fixes IE
        if (appendToBody) document.body.appendChild(fakeEl)
        // simulate click
        fakeEl.click()
        // remove from body if appended
        if (appendToBody) document.body.removeChild(fakeEl)
      })
    }
  }
}
