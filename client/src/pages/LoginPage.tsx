import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormContainer from "../components/auth/FormContainer";
import EmailInput from "../components/auth/EmailInput";
import PasswordInput from "../components/auth/PasswordInput";
import LoginSubmitButton from "../components/login/LoginSubmitButton";
import FormTitleHeader from "../components/login/TitleHeader";
import CreateSubmitButton from "../components/signup/CreateSubmitButton";
import { useAuth } from "../context/AuthContext";

import { Box } from "@mui/material";

interface loginResp {
  token: string,
  user_id: string,
  profile_id: string
}

function LoginPage() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [formValues, setFormValues] = useState({ email: '', password: '' });
    const [invalidLogin, setInvalidLogin] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function updateAuthState(data: loginResp) {
      await login(
        data.token,
        formValues.email,
        data.user_id,
        data.profile_id
      );
    }

    function signUp() {
      navigate('/signup')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleInputChange(event: any) {
        setFormValues({ ...formValues, [event.target.name]: event.target.value });
    }

    function validateInputs() {
        let isValid = true;

        if (!formValues.email || !/\S+@\S+\.\S+/.test(formValues.email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!formValues.password || formValues.password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    }

    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        if (!validateInputs()) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let res: any | null = null;
        if (`${import.meta.env.VITE_APP_ENV}` === "production") {
          try {
            res = await axios.post(
              "/api/v1/auth/login",
              {
                email: formValues.email,
                password: formValues.password,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
                },
              }
            );
          } catch (err) {
            setInvalidLogin(true);
            console.log(`Encountered an error: ${err}`);
          }
        } else {
          try {
            res = await axios.post(
              `${import.meta.env.VITE_DEV_URL}/api/v1/auth/login`,
              {
                email: formValues.email,
                password: formValues.password,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `${import.meta.env.VITE_API_MANAGEMENT_KEY}`,
                },
              }
            );
          } catch (err) {
            setInvalidLogin(true);
            console.log(`Encountered an error: ${err}`);
          }
        }


        if (res.status === 200) {
          await updateAuthState(res.data);
          setFormValues({ email: '', password: '' });
          navigate('/', {replace: true});
        }
    }

    return (
        <>
            <FormContainer
              header={<FormTitleHeader/>}
              onSubmit={handleSubmit}
            >
                { 
                invalidLogin &&
                    <Box>
                        Incorrect Email and Password Combination
                    </Box>
                }
                <EmailInput
                    value={formValues.email}
                    error={emailError}
                    errorMessage={emailErrorMessage}
                    onChange={handleInputChange}
                />
                <PasswordInput
                    value={formValues.password}
                    error={passwordError}
                    errorMessage={passwordErrorMessage}
                    onChange={handleInputChange}
                />
                <LoginSubmitButton onClick={validateInputs} />
                <CreateSubmitButton onClick={signUp}/>
            </FormContainer>
        </>
      );    
}

export default LoginPage;