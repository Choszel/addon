import { Button, HStack, Input } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import postRegister from "../../hooks/postRegister";

const Register = () => {
  const [loginInput, setLoginInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const { isSending, sendRegisterForm } = postRegister();

  const refLogin = useRef<HTMLInputElement>(null);
  const refPassword = useRef<HTMLInputElement>(null);

  const isLoginError = loginInput === "";
  const isPassError = passInput === "";

  const handleRegistration = async (event: React.FormEvent) => {
    event?.preventDefault();
    if (isLoginError || isPassError) return;
    sendRegisterForm(
      refLogin.current?.value ?? "",
      refPassword.current?.value ?? ""
    );
    if (!isSending) {
    }
  };
  return (
    <>
      <p>Proszę uzupełnić poniższy formularz, aby się zarejestrować</p>
      <HStack width="50%" marginY="3%">
        <p>Login</p>
        <Input
          ref={refLogin}
          onChange={(e) => setLoginInput(e.target.value)}
        ></Input>
      </HStack>
      {isLoginError && (
        <label className="small" style={{ color: "var(--error)" }}>
          Pole "Login" nie może być puste.
        </label>
      )}
      <HStack width="50%" marginY="3%">
        <p>Hasło</p>
        <Input
          type="password"
          ref={refPassword}
          onChange={(e) => setPassInput(e.target.value)}
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
      <Button onClick={handleRegistration}>Zarejestruj się</Button>
      <HStack width="50%" marginY="3%">
        <p>Posiadasz już konto?</p>
        <Link to="/login">
          <Button>Zaloguj się</Button>
        </Link>
      </HStack>
    </>
  );
};

export default Register;
