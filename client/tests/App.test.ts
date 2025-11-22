import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '../src/App.vue'

describe('App', () => {
  it('renders hello world', () => {
    // What: Mount the App component
    // Why: Verify it renders the expected welcome message
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Hello World')
  })
})
