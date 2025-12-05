

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();

//   // ⭐ we use signInWithIdentifier from AuthContext
//   const { signInWithIdentifier } = useAuth();

//   const [identifier, setIdentifier] = useState(''); // email or username
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // ⭐ Login using email OR username
//       const { error: authError } = await signInWithIdentifier(identifier, password);

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
//         <h1>Welcome back</h1>
//         <p className="subtle-text">Sign in to explore locations and reviews.</p>

//         <form onSubmit={handleSubmit}>

//           {/* ⭐ Email or Username */}
//           <label htmlFor="identifier">Email or Username</label>
//           <input
//             id="identifier"
//             name="identifier"
//             type="text"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             placeholder="Enter email or username"
//             required
//           />

//           {/* Password */}
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="••••••••"
//             required
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? 'Signing in...' : 'Login'}
//           </button>

//           {error && <p className="error-text">{error}</p>}
//         </form>

//         <p className="subtle-text">
//           New here? <Link to="/signup">Create an account</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithIdentifier } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await signInWithIdentifier(identifier, password);
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

      {/* LEFT SIDE PANEL */}
      <div className="auth-left">
        <h1 className="brand-title">Wassal Map</h1>
        <p className="brand-tagline">Your smart way to discover and explore places.</p>

        <p className="brand-description">Find places and share experiences.</p>

        <ul className="feature-list">
          <li>⭐ Explore thousands of locations</li>
          <li>⭐ Review & rate places</li>
          <li>⭐ Save favourite spots</li>
        </ul>
      </div>

      {/* RIGHT SIDE PANEL (original card preserved) */}
      <div className="auth-right">
        <div className="auth-card">
          <h1>Welcome to Wassal Map</h1>
          <p className="subtle-text">Sign in to explore locations and reviews.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="identifier">Email or Username</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter email or username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>

          <div style={{ marginTop: "20px" }}>
            <GoogleLoginButton />
          </div>

          <p className="subtle-text">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
