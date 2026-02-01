export const validateEmail = (email) =>
  /\S+@\S+\.\S+/.test(email);

export const validatePhone = (phone) =>
  /^[0-9]{11}$/.test(phone);

export const validateAccount = (num) =>
  /^[0-9]{10}$/.test(num);
