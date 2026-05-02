export default function authorizationBearer(): string {
  const userData = localStorage.getItem("user") ?? "{}";
  const user = JSON.parse(userData);
  if (user.accessToken) {
    return "Bearer " + user.accessToken;
  } else {
    return "";
  }
}
