// import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const GoogleLoginButton = () => {
//   const navigate = useNavigate();

//   const handleSuccess = async (credentialResponse) => {
//     try {
//       console.log('🔐 Sending Google credential to backend...');
//       const res = await axios.post(
//         'http://localhost:4000/auth/google',
//         { credential: credentialResponse.credential },
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       console.log("✅ Google Login Success:", res.data);
      
//       if (res.data.success && res.data.session) {
//         localStorage.setItem('supabase_session', JSON.stringify(res.data.session));
//         localStorage.setItem('user', JSON.stringify(res.data.user));
//         navigate('/home');
//       } else {
//         console.error("Unexpected response:", res.data);
//       }
//     } catch (error) {
//       console.error("❌ Google Login Failed:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <div>
//         <GoogleLogin
//           onSuccess={handleSuccess}
//           onError={() => console.log("❌ Google Login Error")}
//         />
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleLoginButton;
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      console.log("🔐 Token Received:", response);

      const res = await axios.post(
        "http://localhost:4000/auth/google",
        { credential: response.credential },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ Login Success:", res.data);

      if (res.data.success) {
        localStorage.setItem("supabase_session", JSON.stringify(res.data.session));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      }
    } catch (err) {
      console.log("❌ Login failed:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("❌ Google Login Failed")}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
