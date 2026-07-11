'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Phone, User, Key, ArrowRight, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { APP_NAME } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, currentUser } = useAppStore();
  
  const [mode, setMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP States
  const [otpStep, setOtpStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    router.push('/dashboard');
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    // Simulate API request to send OTP
    await new Promise((r) => setTimeout(r, 1200));
    
    setGeneratedOtp('123456'); // Static mock OTP for demonstration
    setOtpStep(2);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setErrorMsg('Invalid OTP. Please enter the demo code "123456"');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    await new Promise((r) => setTimeout(r, 1000));

    setCurrentUser({
      id: generateId(),
      name: name || 'Citizen Guest',
      email: email || `${phone}@myeseva.in`,
      phone: phone,
    });

    setLoading(false);
    router.push('/dashboard');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setErrorMsg('Full Name and Email are required');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    await new Promise((r) => setTimeout(r, 1000));

    setCurrentUser({
      id: generateId(),
      name: name,
      email: email,
      phone: phone || 'N/A',
    });

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mesh">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Login to manage your applications
          </p>
        </div>

        {/* Mode Toggle (Hidden when entering OTP code) */}
        {!(mode === 'otp' && otpStep === 2) && (
          <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
            <button
              onClick={() => {
                setMode('email');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                mode === 'email'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => {
                setMode('otp');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                mode === 'otp'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              OTP / Mobile
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 mb-5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2 border border-red-200 dark:border-red-900/50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'email' ? (
            /* Email / Password Form */
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleEmailLogin}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Mobile Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? 'Logging in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.form>
          ) : (
            /* OTP Form Flow */
            <motion.div
              key="otp-form-container"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {otpStep === 1 ? (
                /* Step 1: Request Mobile Number */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full Name (Optional)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 cursor-pointer mt-6"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP code'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              ) : (
                /* Step 2: Verification code form */
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs text-muted-foreground">OTP code sent to mobile</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{phone}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep(1);
                        setErrorMsg('');
                        setOtpCode('');
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Change number
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Enter 6-Digit OTP *</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        placeholder="######"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-center text-lg tracking-widest"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2.5">
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/30">
                        Demo code: 123456
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          setLoading(true);
                          await new Promise((r) => setTimeout(r, 1000));
                          setLoading(false);
                          setErrorMsg('');
                          alert('OTP code re-sent! Use code 123456');
                        }}
                        className="text-xs text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {loading ? 'Verifying OTP...' : 'Verify & Login'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Login Stub */}
        <div className="mt-4">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-slate-800 px-4 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium">Google</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-xs text-muted-foreground hover:text-blue-600 transition-colors">
            Admin Login →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
