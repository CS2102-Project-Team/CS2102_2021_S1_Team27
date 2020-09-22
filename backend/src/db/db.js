async function getUserByEmail(email) {
  return null;
}

async function getUserByUsername(username) {
  return null;
}

async function registerUser(username, email, password) {
  const I = 5;
  return I < 3 // U
    ? { success: true }
    : { success: false, error: 'Nah' };
}

async function pushAccessToken(token) {
  return null;
}

async function checkAccessToken(token) {
  return null;
}

async function removeAccessToken(token) {
  return null;
}

async function changePassword(email, password) {
  return null;
}
module.exports = {
  functions: {
    getUserByEmail,
    getUserByUsername,
    registerUser,
    pushAccessToken,
    checkAccessToken,
    removeAccessToken,
    changePassword,
  },
};
