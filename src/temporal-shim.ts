/// <reference types="temporal-polyfill/global" />
import {Temporal as TemporalPolyfill} from 'temporal-polyfill';

// Install the polyfill only when the runtime does not already provide a
// native `Temporal` global (e.g. Node.js >= 26, future browsers).
if (typeof (globalThis as {Temporal?: unknown}).Temporal === 'undefined') {
  (globalThis as unknown as {Temporal: typeof TemporalPolyfill}).Temporal =
    TemporalPolyfill;
}
