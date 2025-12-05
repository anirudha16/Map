import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        'http://localhost:4000/auth/google',
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("Google Login Success:", res.data);
      window.location.href = "/"; 
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Google Login Failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
