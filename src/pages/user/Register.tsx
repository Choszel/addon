import { Box, HStack, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postRegister from "../../hooks/postRegister";
import postLogin from "../../hooks/postLogin";
import useTokenData from "../../others/useTokenData";

const Register = () => {
  const [loginInput, setLoginInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const { isSending, sendRegisterForm } = postRegister();
  const { sendLoginForm, isSending: isLoggingIn } = postLogin();
  const { CheckUserType } = useTokenData();
  const navigate = useNavigate();

  const refLogin = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const isLoginError = loginInput === "";
  const isPassError = passInput === "";

  const handleRegistration = async (event: React.FormEvent) => {
    event?.preventDefault();
    if (isLoginError || isPassError) return;
    await sendRegisterForm(
      refLogin.current?.value ?? "",
      refPassword.current?.value ?? ""
    );
    if (!isSending) {
      await sendLoginForm(
        refLogin.current?.value ?? "",
        refPassword.current?.value ?? ""
      );
      if (!isLoggingIn) {
        if (CheckUserType() != "none") return navigate("/");
      }
    }
  };
  return (
    <>
      <p>Proszę uzupełnić poniższy formularz, aby się zarejestrować</p>
      <HStack
        width={{ base: "100%", lg: "50%" }}
        marginTop={{ base: "10%", lg: "3%" }}
        marginBottom="1%"
      >
        <p>Login</p>
        <Input
          ref={refLogin}
          onChange={(e) => setLoginInput(e.target.value)}
          className="basic_style"
          _focus={{ border: "2px solid var(--secondary-dark)" }}
          maxLength={35}
        ></Input>
      </HStack>
      {isLoginError && (
        <label className="small" style={{ color: "var(--error)" }}>
          Pole "Login" nie może być puste.
        </label>
      )}
      <HStack
        width={{ base: "100%", lg: "50%" }}
        marginTop={{ base: "10%", lg: "3%" }}
        marginBottom="1%"
      >
        <p>Hasło</p>
        <Input
          type="password"
          ref={refPassword}
          onChange={(e) => setPassInput(e.target.value)}
          autoComplete="new-password"
          className="basic_style"
          _focus={{ border: "2px solid var(--secondary-dark)" }}
        ></Input>
      </HStack>
      {isPassError && (
        <div>
          <label className="small" style={{ color: "var(--error)" }}>
            Pole "Nazwa Użytkownika" nie może być puste.
          </label>
          <br />
          <br />
        </div>
      )}
      <Box marginTop={{ base: "7%", lg: "3%" }}>
        <button onClick={handleRegistration} className="button_secondary">
          Zarejestruj się
        </button>
      </Box>
      <HStack marginTop={{ base: "10%", lg: "3%" }}>
        <p>Posiadasz już konto?</p>
        <Link to="/login">
          <button className="button_secondary">Zaloguj się</button>
        </Link>
      </HStack>
    </>
  );
};

export default Register;
