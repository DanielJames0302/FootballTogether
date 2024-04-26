
import { SignIn } from "@clerk/clerk-react";
const Login = () => {
  return (
    <div className="login-page">
      <div className="login-page-wrapper pt-3 flex justify-center items-center">
        <SignIn />
      </div>
    </div>
  );
};

export default Login;
