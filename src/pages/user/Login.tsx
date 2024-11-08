import { Button, HStack, Input } from "@chakra-ui/react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import postLogin from "../../hooks/postLogin";
import useTokenData from "../../others/useTokenData";

const Login = () => {
  const { isSending, sendLoginForm } = postLogin();
  const { CheckUserType } = useTokenData();

  const refLogin = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    event?.preventDefault();
    if (!refLogin.current || !refPassword.current) return;
    await sendLoginForm(
      refLogin.current?.value ?? "",
      refPassword.current?.value ?? ""
    );
    if (!isSending) {
      if (CheckUserType() != "none") return navigate("/");
    }
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      if (refPassword.current?.value.length ?? 0 > 0) handleLogin();
    }
  };

  return (
    <>
      <p>Proszę uzupełnić poniższy formularz</p>
      <HStack width="50%" marginY="3%">
        <p>Login</p>
        <Input ref={refLogin}></Input>
      </HStack>
      <HStack width="50%" marginY="3%">
        <p>Hasło</p>
        <Input
          type="password"
          ref={refPassword}
          onKeyUp={handleKeyPress}
        ></Input>
      </HStack>
      <Button onClick={handleLogin}>Zaloguj się</Button>
      <HStack width="50%" marginY="3%">
        <p>Jeszcze nie posiadasz konta?</p>
        <Link to="/register">
          <Button>Zarejestruj się</Button>
        </Link>
      </HStack>
    </>
  );
};

export default Login;
