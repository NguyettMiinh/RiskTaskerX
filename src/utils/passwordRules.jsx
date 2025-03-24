export const getPasswordRules = (passwordValue) => {
    const rules = [
      { text: "At least 8 characters", valid: passwordValue.length >= 8 },
      { text: "No spaces allowed", valid: !/\s/.test(passwordValue) },
      {
        text: "At least one uppercase letter",
        valid: /[A-Z]/.test(passwordValue),
      },
      { text: "At least one number", valid: /[0-9]/.test(passwordValue) },
      {
        text: "At least one special character (@$!%*?&)",
        valid: /[@$!%*?&]/.test(passwordValue),
      },
    ];
  
    return rules.map((rule, index) => ({
      key: index,
      label: <span style={{ color: rule.valid ? "black" : "red" }}>{rule.text}</span>,
    }));
  };
  