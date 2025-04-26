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
import { useProfile } from "../context/ProfileContext";

interface loginResp {
  token: string,
  email: string,
  user_id: string,
  profile_id: string,
  isAdmin: boolean,
  admin_id: string
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
    const {setProfileName, setProfileImage} = useProfile();
    const baseUrl = `${import.meta.env.VITE_APP_ENV}` === "production" 
        ? `${import.meta.env.VITE_PROD_URL}`
        : `${import.meta.env.VITE_DEV_URL}`;

    async function updateProfileState(profName: string, profImg: string) {
      await setProfileName(profName);
      await setProfileImage(profImg);
    }

    async function updateAuthState(data: loginResp) {
      await login(
        data.token,
        data.email,
        data.user_id,
        data.profile_id,
        data.isAdmin,
        data.admin_id
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
    
        try {
          let res = await axios.post(
            `${baseUrl}/api/v1/auth/login`,
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
          console.log(res.status);
          console.log(res.data);
          if (res.status === 200) {
            const loginRespData: loginResp = {
              token: res.data.token,
              user_id: res.data.user_id,
              email: res.data.email,
              profile_id: res.data.profile_id,
              isAdmin: false,
              admin_id: ""
            };
            res = await axios.get(
              `${baseUrl}/api/v1/admin/user/${loginRespData.user_id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${loginRespData.token}`,
                }
              }
            );
            console.log(`Admin Resp: ${res.data}`);
            if (res.status !== 200) return;
            if (res.data.isAdmin === 'true') {
              console.log("Admin");
              loginRespData.isAdmin = true
              loginRespData.admin_id = res.data.admin_id;
            } else console.log("Not an admin");
            res = await axios.get(`
              ${baseUrl}/api/v1/profile/${loginRespData.profile_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loginRespData.token}`,
              }
            });
            if (res.status !== 200) return;
            const profileName = res.data.profile.profile_name;
            const profileImg = res.data.profile.profile_img;
            await updateAuthState(loginRespData);
            await updateProfileState(profileName, profileImg); 
            setFormValues({ email: '', password: '' });
            navigate('/', {replace: true});
          }
        } catch (err) {
          setInvalidLogin(true);
          console.log(`Encountered an error: ${err}`);
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