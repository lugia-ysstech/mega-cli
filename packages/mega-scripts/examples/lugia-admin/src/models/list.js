import lugiax from '@lugia/lugiax';

const __LUGIAX_MODEL_DEFINE__ = 'list'; // lugiax-model-define

const state = {
  counter: 0
};

export default lugiax.register({
  model: __LUGIAX_MODEL_DEFINE__,
  state,
  mutations: {
    sync: {
      increment(state) {
        const newCounter = state.get('counter') + 1;
        return state.set('counter', newCounter);
      },
      decrement(state) {
        const newCounter = state.get('counter') - 1;
        return state.set('counter', newCounter);
      }
    },
    async: {
      async incrementAsync(state, delay = 1000, { mutations }) {
        await mutations.decrement();
        setTimeout(() => {
          mutations.increment();
        }, delay);
      }
    }
  }
});
