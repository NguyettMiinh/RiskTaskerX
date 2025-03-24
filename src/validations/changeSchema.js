import * as yup from "yup";


export const changeSchema = (storedPassword) =>
  yup.object().shape(
    {
      currentPassword: yup
        .string()
        .required("Please enter your current password")
        .test(
          "match-password",
          "The current password is incorrect. Please try again.",
          (value) => {
            return value === storedPassword;
          }
        ),
      password: yup
        .string()
        .required("Please enter your password")
        .min(8, "")
        .test(
          "match-password",
          "New password cannot be the same as the current password.",
          (value) => {
            return value !== storedPassword;
          }
        )
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