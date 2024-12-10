import { Box, HStack, Input } from "@chakra-ui/react";
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
      <HStack
        width={{ base: "100%", lg: "50%" }}
        marginTop={{ base: "10%", lg: "3%" }}
        marginBottom="1%"
      >
        <p>Login</p>
        <Input
          ref={refLogin}
          className="basic_style"
          _focus={{ border: "2px solid var(--secondary-dark)" }}
          id="user-name"
        ></Input>
      </HStack>
      <HStack
        width={{ base: "100%", lg: "50%" }}
        marginTop={{ base: "10%", lg: "3%" }}
        marginBottom="1%"
      >
        <p>Hasło</p>
        <Input
          type="password"
          ref={refPassword}
          onKeyUp={handleKeyPress}
          className="basic_style"
          _focus={{ border: "2px solid var(--secondary-dark)" }}
          id="password"
        ></Input>
      </HStack>
      <Box marginTop={{ base: "7%", lg: "3%" }}>
        <button
          className="button_secondary"
          onClick={handleLogin}
          id="login-submit"
        >
          Zaloguj się
        </button>
      </Box>
      <HStack marginY="3%">
        <p>Jeszcze nie posiadasz konta?</p>
        <Link to="/register">
          <button className="button_secondary">Zarejestruj się</button>
        </Link>
      </HStack>
    </>
  );
};

export default Login;
