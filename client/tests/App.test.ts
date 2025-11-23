import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '../src/App.vue'

describe('App', () => {
  it('renders ScrapFlow app', () => {
    // What: Mount the App component
    // Why: Verify it renders the app title and main UI elements
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('ScrapFlow')
    expect(wrapper.text()).toContain('Enter a URL to start scraping')
  })
})
