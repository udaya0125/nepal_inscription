import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const logo = '/images/logo3.jpeg'; // Replace with your logo path

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Card Container */}
                <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                    <Head title="Log in" />

                    {/* Header */}
                    <div className="text-center space-y-2 mb-10">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="w-24 rounded-2xl">
                                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400"
                                        autoComplete="username"
                                        autoFocus
                                    />
                                    {focusedField === 'email' && (
                                        <div className="absolute inset-0 rounded-xl bg-slate-900/5 -z-10 blur-sm"></div>
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 font-medium mt-2">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5" />
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                    {focusedField === 'password' && (
                                        <div className="absolute inset-0 rounded-xl bg-slate-900/5 -z-10 blur-sm"></div>
                                    )}
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 font-medium mt-2">{errors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password & Remember Me */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-sm text-slate-600">Remember me</span>
                                </label>
                                {/* {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )} */}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold tracking-wide transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                            >
                                <span>{processing ? 'Signing In...' : 'Sign In'}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}