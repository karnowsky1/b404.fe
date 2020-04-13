const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateEmail = (email) => {
  if (!email) {
    return;
  } else if (!emailRegex.test(email)) {
    console.log(email);
    return 'Invalid email address';
  }
};

export const required = (input) => {
  if (!input || (typeof input.length === 'number' && input.length === 0)) {
    return 'Required';
  }
};

export const validatePassword = (password) => {
  if (!password) {
    return;
  } else if (!passwordRegex.test(password)) {
    return 'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters';
  }
};

export const validateRequiredPassword = (password) => {
  if (!password) {
    return 'Required';
  } else if (!passwordRegex.test(password)) {
    return 'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters';
  }
};
