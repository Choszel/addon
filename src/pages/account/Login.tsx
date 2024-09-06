import { Button, HStack, Input } from "@chakra-ui/react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import postLogin from "../../hooks/postLogin";

const Login = () => {
  const { isSending, sendLoginForm } = postLogin();

  const refLogin = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event?.preventDefault();
    if (!refLogin.current || !refPassword.current) return;
    await sendLoginForm(
      refLogin.current?.value ?? "",
      refPassword.current?.value ?? ""
    );
    if (!isSending) {
      return navigate("/");
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
        <Input type="password" ref={refPassword}></Input>
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
