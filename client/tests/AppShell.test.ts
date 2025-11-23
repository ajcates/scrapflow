import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App.vue';

// Mock the material web components to prevent them from registering
vi.mock('@material/web/button/filled-button.js', () => ({}));
vi.mock('@material/web/textfield/outlined-text-field.js', () => ({}));

describe('App Shell', () => {
  it('renders the main layout structure', () => {
    const wrapper = mount(App);

    expect(wrapper.find('.app-container').exists()).toBe(true);
    expect(wrapper.find('.top-bar').exists()).toBe(true);
    expect(wrapper.find('.viewport').exists()).toBe(true);
    expect(wrapper.find('.bottom-bar').exists()).toBe(true);
  });

  it('renders the url input as a material text field', () => {
    const wrapper = mount(App);
    const input = wrapper.find('md-outlined-text-field');
    expect(input.exists()).toBe(true);
  });

  it('renders the Go button as a material filled button', () => {
    const wrapper = mount(App);
    const button = wrapper.find('md-filled-button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Go');
  });

  it('updates iframe src when Go is clicked', async () => {
    const wrapper = mount(App);

    const input = wrapper.find('md-outlined-text-field');

    // Set value directly on the element and trigger input
    const element = input.element as HTMLInputElement;
    element.value = 'https://test.com';
    await input.trigger('input');

    const button = wrapper.find('md-filled-button');
    await button.trigger('click');

    const iframe = wrapper.find('iframe');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes('src')).toContain('http://localhost:3000/proxy?url=https%3A%2F%2Ftest.com');
  });
});
