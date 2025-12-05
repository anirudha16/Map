
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Signup = () => {
//   const navigate = useNavigate();
//   const { signUp } = useAuth();

//   // UPDATED: added username + fullName
//   const [formState, setFormState] = useState({
//     username: '',
//     fullName: '',
//     email: '',
//     password: ''
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormState((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const { error: authError } = await signUp(formState);
//       if (authError) {
//         setError(authError.message);
//       } else {
//         navigate('/home');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h1>Create account</h1>
//         <p className="subtle-text">Join and review your favorite places.</p>

//         <form onSubmit={handleSubmit}>

//           {/* 🔵 USERNAME FIELD */}
//           <label htmlFor="username">Username</label>
//           <input
//             id="username"
//             name="username"
//             type="text"
//             value={formState.username}
//             onChange={handleChange}
//             placeholder="Enter username"
//             required
//           />

//           {/* 🔵 FULL NAME FIELD */}
//           <label htmlFor="fullName">Full Name</label>
//           <input
//             id="fullName"
//             name="fullName"
//             type="text"
//             value={formState.fullName}
//             onChange={handleChange}
//             placeholder="Enter full name"
//             required
//           />

//           {/* EXISTING EMAIL FIELD */}
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={formState.email}
//             onChange={handleChange}
//             placeholder="you@example.com"
//             required
//           />

//           {/* EXISTING PASSWORD FIELD */}
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             value={formState.password}
//             onChange={handleChange}
//             placeholder="Create a strong password"
//             required
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? 'Creating account...' : 'Sign up'}
//           </button>

//           {error && <p className="error-text">{error}</p>}
//         </form>

//         <p className="subtle-text">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formState, setFormState] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await signUp(formState);
      if (authError) {
        setError(authError.message);
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

      {/* LEFT BRAND PANEL */}
      <div className="auth-left">
        <h1 className="brand-title">Join Map Explorer</h1>
        <p className="brand-subtitle">Discover, explore, and share your experiences.</p>

        <ul className="feature-list">
          <li>⭐ Create an account in seconds</li>
          <li>⭐ Share reviews & rate places</li>
          <li>⭐ Save favourite locations</li>
        </ul>
      </div>

      {/* RIGHT SIGNUP CARD */}
      <div className="auth-right">
        <div className="auth-card">
          <h1>Create account</h1>
          <p className="subtle-text">Join and review your favorite places.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formState.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />

            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formState.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>

          <div style={{ marginTop: "20px" }}>
            <GoogleLoginButton />
          </div>

          <p className="subtle-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;


