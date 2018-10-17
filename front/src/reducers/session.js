export default (state = null, action) => {
  switch (action.type) {
    case 'USER_CREATED':
      return action.data.email;
    case 'USER_LOGOUT':
      return null;
    default:
      return state;
  }
};
