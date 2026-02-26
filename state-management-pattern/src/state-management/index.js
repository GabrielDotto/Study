export const stateManager = {
  state: {
    counter: 0,
  },

  updateCounter(counterValue) {
    this.state = { ...this.state, ...{ counter: counterValue } };
  },

  getCounter() {
    const state = { ...this.state };
    return state?.counter;
  },

  getState() {
    return { ...this.state };
  },
};
