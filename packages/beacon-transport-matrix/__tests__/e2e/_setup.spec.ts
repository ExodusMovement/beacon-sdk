import { MockLocalStorage } from '../../../../test/test-utils/MockLocalStorage'
;(global as any).localStorage = new MockLocalStorage()


beforeEach(() => {
  ;(global as any).localStorage.clear()
})

/**
 * Create a JSDOM instance to support localStorage and other DOM methods
 */
const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/'
})

;(global as any).window = dom.window
;(global as any).document = dom.window.document

