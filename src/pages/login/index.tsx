import { useLogin } from "@hooks/useLogin";

import { LoginUI } from "./interface";

function Login() {
  useLogin();

  return <LoginUI />;
}

export { Login };
