/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "selector-id-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
    "selector-class-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$"
  }
};
