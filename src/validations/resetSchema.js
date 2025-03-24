import * as yup from "yup";

export const resetSchema = yup.object().shape(
  {
    password: yup
    .string()
    .required("Please enter your password")
    .min(8, "")
    .test("no-spaces", "", (value) => !value || !/\s/.test(value))
    .test("uppercase", "", (value) => !value || /[A-Z]/.test(value))
    .test("number", "", (value) => !value || /[0-9]/.test(value))
    .test("special-char", "", (value) => !value || /[@$!%*?&]/.test(value)),
      
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Confirmation password does not match.")
      .required("Please confirm your password"),
  },
  { abortEarly: false }
);
