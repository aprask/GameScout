import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TitleHeader from "../components/signup/TitleHeader";
import FormContainer from "../components/auth/FormContainer";
import EmailInput from "../components/auth/EmailInput";
import PasswordInput from "../components/auth/PasswordInput";
import CreateSubmitButton from "../components/signup/CreateSubmitButton";
import LoginSubmitButton from "../components/login/LoginSubmitButton";
import ConfirmPasswordInput from "../components/auth/ConfirmPasswordInput copy";

function SignUpPage() {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [formValues, setFormValues] = useState({ email: '', password: '', confirmedPassword: '' });
    const navigate = useNavigate();

    
    function signIn() {
      navigate('/login')
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
        } else if (formValues.password !== formValues.confirmedPassword) {
          setPasswordError(true);
          setPasswordErrorMessage('Passwords do not match');
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    }

    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        if (!validateInputs()) return;

        if (formValues.password !== formValues.confirmedPassword) {
          setPasswordError(true);
          setPasswordErrorMessage('Passwords do not match');
          return;
        }
        let res: import("axios").AxiosResponse | null = null;
        if (`${import.meta.env.VITE_APP_ENV}` === "production") {
          try {
            res = await axios.post(
              "/api/v1/users",
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
          console.log(`Encountered an error: ${err}`);
        }
        } else {
          try {
            res = await axios.post(
              `${import.meta.env.VITE_DEV_URL}/api/v1/users`,
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
            console.log(`Encountered an error: ${err}`);
          }
        }
        if (res !== null && res.status === 201) {
          setFormValues({ email: '', password: '', confirmedPassword: '' });
          navigate('/login', {replace: true});
        }
    }

    return (
        <>
            <FormContainer
              header={<TitleHeader/>}
              onSubmit={handleSubmit}
            >
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
                <ConfirmPasswordInput
                  value={formValues.confirmedPassword}
                  error={passwordError}
                  errorMessage={passwordErrorMessage}
                  onChange={handleInputChange}
                />
                <CreateSubmitButton onClick={validateInputs} />
                <LoginSubmitButton onClick={signIn}/>
            </FormContainer>
        </>
      );    
    
}

export default SignUpPage;