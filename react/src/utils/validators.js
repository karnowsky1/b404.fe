const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const validateEmail = email => {
  if (!email) {
    return
  } else if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
};


export const required = input => {
  if (!input) {
    return 'Required';
  }
}

export const validatePassword = password => {
  if (!password) {
    return
  } else if (!passwordRegex.test(password)) {
    return 'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters';
  }
};

export const validateRequiredPassword = password => {
  if (!password) {
    return 'Required';
  } else if (!passwordRegex.test(password)) {
    return 'Password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters';
  }
};



