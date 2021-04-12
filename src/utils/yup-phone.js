import * as Yup from "yup";

Yup.addMethod(
  Yup.string,
  "phoneNumber",
  function (messageError = "The phone number is not valid") {
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    return this.test("phoneNumber", messageError, (value) => {
      if (value && value.length > 0) {
        return phoneRegExp.test(value);
      }
      return true;
    });
  }
);
