export const checkPasswordValidate = (value: string) => {
  let isValidPassword =
    /^(?=.*[A-Z])(?=.*[@*#$%^&+!=])[A-Za-z0-9\d@*#$%^&+!=]{8,}$/;
  if (!value) {
    return {
      isValid: false,
      message: "Please input your password!"
    };
  } else if (isValidPassword.test(String(value))) {
    return {
      isValid: true
    };
  } else {
    return {
      isValid: false,
      message: "At least 8 letters with a capital, special characters."
    };
  }
};

export const checkEmailOrPhoneValidate = (value: string) => {
  let isValidEmail =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // mobile phone valid format
  // XXX-XXX-XXX-XXXX
  // +XXXXXXXXXX
  let phoneFormat1 = /^\+?([0-9-]{0,20})$/;
  // XXXXXXXXXX
  let phoneFormat2 = /^\d+$/;
  if (!value) {
    return {
      isValid: false,
      message: "Please input your mobile or email!"
    };
  } else if (isValidEmail.test(String(value).toLowerCase())) {
    return {
      isValid: true
    };
  } else if (
    (phoneFormat1.test(String(value).toLowerCase()) ||
    phoneFormat2.test(String(value).toLowerCase())) &&
    value.indexOf(' ') < 0
  ) {
    return {
      isValid: true
    };
  } else {
    return {
      isValid: false,
      message: "Invalid email or phone number!"
    };
  }
};

export const checkEmailValidate = (value: string) => {
  let isValidEmail =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!value) {
    return {
      isValid: false,
      message: "Please input your email!"
    };
  } else if (isValidEmail.test(String(value).toLowerCase()) && value.indexOf(' ') < 0) {
    return {
      isValid: true
    };
  } else {
    return {
      isValid: false,
      message: "Invalid email address!"
    };
  }
};

// required phone number
export const phoneNumberValidate = (value: string) => {
  // mobile phone valid format
  // XXX-XXX-XXX-XXXX
  // +XXXXXXXXXX
  let phoneFormat1 = /^\+?([0-9-]{0,20})$/;
  // XXXXXXXXXX
  let phoneFormat2 = /^\d+$/;
  if (!value) {
    return {
      isValid: false,
      message: "Please input your phone number!"
    };
  } else if (
    (phoneFormat1.test(String(value).toLowerCase()) ||
    phoneFormat2.test(String(value).toLowerCase())) &&
    value.indexOf(' ') < 0
  ) {
    return {
      isValid: true
    };
  } else {
    return {
      isValid: false,
      message: "Invalid phone number!"
    };
  }
};

// not required phone number
export const phoneValidate = (value: string) => {
  // mobile phone valid format
  // XXX-XXX-XXX-XXXX
  // +XXXXXXXXXX
  let phoneFormat1 = /^\+?([0-9-]{0,20})$/;
  // XXXXXXXXXX
  let phoneFormat2 = /^\d+$/;
  if (!value) {
    return {
      isValid: true
    };
  } else if (
    (phoneFormat1.test(String(value).toLowerCase()) ||
    phoneFormat2.test(String(value).toLowerCase())) &&
    value.indexOf(' ') < 0
  ) {
    return {
      isValid: true
    };
  } else {
    return {
      isValid: false,
      message: "Invalid phone number!"
    };
  }
};