import React, { useState } from 'react';
import { School, ArrowRight, AlertCircle, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextShimmer } from './TextShimmer';
import { InteractiveHoverButton } from './InteractiveHoverButton';

interface LoginProps {
  onLogin: () => void;
  expectedStudentId: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, expectedStudentId }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realistic feel
    setTimeout(() => {
      if (!email || !password) {
        setError('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }

      // STRICT VALIDATION: Check for ncuindia.edu domain
      // Also checking for 'ncu@india.edu' as per specific prompt request, 
      // though standard domain is ncuindia.edu
      const lowerEmail = email.toLowerCase();
      const hasValidDomain = lowerEmail.includes('@ncuindia.edu') || lowerEmail.includes('ncu@india.edu');

      if (!hasValidDomain) {
        setError('Access Restricted. You must use an official @ncuindia.edu email address.');
        setIsLoading(false);
        return;
      }

      // PASSWORD VALIDATION: Must be Roll Number
      const isPasswordCorrect = password.trim().toUpperCase() === expectedStudentId.toUpperCase();

      if (!isPasswordCorrect) {
        setError(isSignUp 
          ? 'Verification Failed. Roll Number does not match our records for this email.' 
          : 'Invalid credentials. Please verify your Roll Number.'
        );
        setIsLoading(false);
        return;
      }

      // Success
      onLogin();
    }, 1500);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20"
          >
            <School className="w-8 h-8 text-slate-900 stroke-[2]" />
          </motion.div>
          
          <TextShimmer className='font-bold text-3xl mb-2' duration={2.5}>
            NCU Portal
          </TextShimmer>
          
          <p className="text-slate-400 text-sm tracking-wide">
            {isSignUp ? 'Student Account Activation' : 'Student Login'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wider">
              Official Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@ncuindia.edu"
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 placeholder-slate-600 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wider">
              {isSignUp ? 'University Roll Number' : 'Password (Roll Number)'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. 25CSU078"
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 placeholder-slate-600 transition-all shadow-inner"
              />
            </div>
            {isSignUp && (
              <p className="text-[10px] text-slate-500 ml-1">
                Use your university assigned Roll Number to verify identity.
              </p>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 text-red-200 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <InteractiveHoverButton 
            type="submit"
            disabled={isLoading}
            text={isLoading ? 'Verifying...' : (isSignUp ? 'Activate Account' : 'Sign In')}
            className="mt-4 w-full"
          />

        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-slate-400 mb-2">
            {isSignUp ? 'Already have an account?' : 'New Student?'}
          </p>
          <button 
            onClick={toggleMode}
            className="text-amber-500 hover:text-amber-400 font-semibold text-sm flex items-center justify-center gap-2 mx-auto hover:underline transition-all"
          >
            {isSignUp ? (
              <>
                <LogIn className="w-4 h-4" /> Back to Login
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create Account
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-600">
                Authorized Access Only • The NorthCap University
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
