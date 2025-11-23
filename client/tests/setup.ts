import { beforeAll } from 'vitest';

// Polyfill for ElementInternals
if (typeof HTMLElement.prototype.attachInternals !== 'function') {
  HTMLElement.prototype.attachInternals = function() {
    return {
      setFormValue: () => {},
      setValidity: () => {},
      checkValidity: () => true,
      reportValidity: () => true,
      validationMessage: '',
      willValidate: true,
      validity: { valid: true },
      labels: [],
      form: null,
    } as unknown as ElementInternals;
  };
}
