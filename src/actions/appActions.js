export default {
  handleResize: dimensions => ({ type: 'resizeWindow', data: dimensions }),

  showAlert: (message, type) => ({
    type: 'showAlert',
    data: { message, type },
  }),

  hideAlert: () => ({ type: 'hideAlert' }),
};
