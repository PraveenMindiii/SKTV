
export const ValidateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === '') {
    return {isValid: false, message: 'PLEASE_ENTER_EMAIL'};
  }
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'VALID_EMAIL',
    };
  }
  return {isValid: true, message: ''};
};

export const ValidatePassword = password => {
  if (!password || password.trim() === '') {
    return {isValid: false, message: 'PLEASE_ENTER_PASSWORD'};
  }
  return {isValid: true, message: ''};
};

export const ValidateFirstName = firstName => {
  if (!firstName || firstName.trim() === '') {
    return {isValid: false, message: 'PLEASE_ENTER_FULL_NAME'};
  }
  if (firstName.length < 2) {
    return {
      isValid: false,
      message: 'FULL_NAME_2_CHAR_OR_MORE',
    };
  }
  return {isValid: true, message: ''};
};

export const ValidateLastName = lastName => {
  if (!lastName || lastName.trim() === '') {
    return {isValid: false, message: 'Please enter last name'};
  }
  if (lastName.length < 2) {
    return {
      isValid: false,
      message: 'Full name should contain 2 characters or more',
    };
  }
  return {isValid: true, message: ''};
};

export const ValidatePhoneNumber = phoneNumber => {
  if (!phoneNumber || phoneNumber.trim() === '') {
    return {isValid: false, message: 'Please enter phone number'};
  }
  if (phoneNumber.length < 5) {
    return {isValid: false, message: 'Phone number should be minimum 5 digit'};
  }
  if (true) {
    let numbers = '0123456789';
    for (var i = 0; i < phoneNumber.length; i++) {
      if (numbers.indexOf(phoneNumber[i]) > -1) {
      } else {
        return {isValid: false, message: 'Please enter valid contact number'};
      }
    }
  }
  return {isValid: true, message: ''};
};

export const ValidateSignUpPassword = password => {
  let passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&~^])[A-Za-z\d#@$!%*?&~^]{6,}$/;
  if (!password || password.trim() === '') {
    return {isValid: false, message: 'Please enter password'};
  }
  if (password?.length < 8) {
    return {isValid: false, message: 'Password minimum length should be 8'};
  }
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message:
        'Password must contain at least one uppercase, lowercase, number, and a special character',
    };
  }
  return {isValid: true, message: ''};
};

export const ValidateConfirmPassword = (password ,confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return {isValid: false, message: 'Please enter confirm password'};
  }
 if (password !== confirmPassword) {
    return {isValid: false, message: 'Password does not match'};
  }
  return {isValid: true, message: ''};
};
