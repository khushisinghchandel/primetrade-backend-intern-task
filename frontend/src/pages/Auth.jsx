import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/users/login' : '/users/register';
      
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await api.post(endpoint, payload);
      
      localStorage.setItem('user', JSON.stringify(data));
      toast.success(isLogin ? 'Logged in successfully!' : `Registered as ${data.role} successfully!`);
      
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
       
        {!isLogin && (
          <>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            
           
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}

        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );
};

export default AuthPage;