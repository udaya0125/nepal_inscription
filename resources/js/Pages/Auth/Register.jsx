// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Register() {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         name: '',
//         email: '',
//         password: '',
//         password_confirmation: '',
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('register'), {
//             onFinish: () => reset('password', 'password_confirmation'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Register" />

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="name" value="Name" />

//                     <TextInput
//                         id="name"
//                         name="name"
//                         value={data.name}
//                         className="mt-1 block w-full"
//                         autoComplete="name"
//                         isFocused={true}
//                         onChange={(e) => setData('name', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.name} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         onChange={(e) => setData('email', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="new-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                         required
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel
//                         htmlFor="password_confirmation"
//                         value="Confirm Password"
//                     />

//                     <TextInput
//                         id="password_confirmation"
//                         type="password"
//                         name="password_confirmation"
//                         value={data.password_confirmation}
//                         className="mt-1 block w-full"
//                         autoComplete="new-password"
//                         onChange={(e) =>
//                             setData('password_confirmation', e.target.value)
//                         }
//                         required
//                     />

//                     <InputError
//                         message={errors.password_confirmation}
//                         className="mt-2"
//                     />
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     <Link
//                         href={route('login')}
//                         className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                     >
//                         Already registered?
//                     </Link>

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Register
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }

import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const logo = '/images/logo3.png'; // Replace with your logo path

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
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
                    {/* Header */}
                    <div className="text-center space-y-2 mb-10">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-2xl shadow-lg overflow-hidden">
                                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Fill in your details to get started
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        {/* Name Input */}
                        <div className="space-y-2 mb-5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-3.5 h-3.5" />
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400"
                                    autoComplete="name"
                                    required
                                />
                                {focusedField === 'name' && (
                                    <div className="absolute inset-0 rounded-xl bg-slate-900/5 -z-10 blur-sm"></div>
                                )}
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2 mb-5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" />
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400"
                                    autoComplete="username"
                                    required
                                />
                                {focusedField === 'email' && (
                                    <div className="absolute inset-0 rounded-xl bg-slate-900/5 -z-10 blur-sm"></div>
                                )}
                            </div>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 mb-5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400"
                                    autoComplete="new-password"
                                    required
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
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2 mb-5">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    onFocus={() => setFocusedField('confirmPassword')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all duration-300 text-slate-900 placeholder-slate-400"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                                {focusedField === 'confirmPassword' && (
                                    <div className="absolute inset-0 rounded-xl bg-slate-900/5 -z-10 blur-sm"></div>
                                )}
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        {/* Terms and Conditions */}
                        <div className="pt-1 mb-6">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 mt-0.5" />
                                <span className="text-sm text-slate-600">
                                    I agree to the <button type="button" className="text-slate-900 font-medium hover:underline">Terms of Service</button> and <button type="button" className="text-slate-900 font-medium hover:underline">Privacy Policy</button>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold tracking-wide transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            <span>{processing ? 'Creating Account...' : 'Create Account'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center pt-4">
                            <p className="text-sm text-slate-600">
                                Already have an account?{' '}
                                <Link 
                                    href={route('login')} 
                                    className="text-slate-900 font-semibold hover:underline"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}