'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { useDictionary } from '../../../lib/hooks/useDictionary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { 
  AuthContainer, 
  AuthCard, 
  AuthInput, 
  AuthButton, 
  AuthLink, 
  AuthIcon, 
  AuthError, 
  AuthSpinner, 
  AuthTitle, 
  AuthDescription, 
  AuthToggleButton,
  AuthBackground,
  FloatingParticles,
  BackgroundWaves,
  ConnectionLines
} from '../../../components/ui';
import { IconUser, IconMail, IconLock, IconArrowRight, IconEye, IconEyeOff } from '@tabler/icons-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useDictionary();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = t.auth.errors.usernameRequired;
    } else if (formData.username.length < 3) {
      newErrors.username = t.auth.errors.usernameMinLength;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.auth.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.auth.errors.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = t.auth.errors.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.auth.errors.passwordMinLength;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.errors.confirmPasswordRequired;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.auth.errors.passwordsDoNotMatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const success = await register(formData.username, formData.email, formData.password, 'customer');
      if (success) {
        // Redirigir al dashboard del cliente (nuevos usuarios son customers)
        router.push(`/${lang}/dashboard/customer`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling is done in the auth context with toasts
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Fondo animado */}
      <AuthBackground className="fixed inset-0">
        <BackgroundWaves />
        <FloatingParticles />
        <ConnectionLines />
      </AuthBackground>
      
      {/* Contenido principal */}
      <AuthContainer className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-16">
        <AuthCard className="w-full max-w-md">
          <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <AuthTitle>
                <CardTitle className="text-3xl font-bold text-text-inverse">
                  {t.auth.createAccount}
                </CardTitle>
              </AuthTitle>
              <AuthDescription>
                <CardDescription className="text-lg text-white">
                  {t.auth.joinDescription}
                </CardDescription>
              </AuthDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <AuthInput delay={0}>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-medium">
                      {t.auth.username}
                    </Label>
                    <div className="relative group">
                      <AuthIcon className="absolute left-3 top-3 h-5 w-5 group-focus-within:text-primary-400 transition-colors">
                        <IconUser />
                      </AuthIcon>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder={t.auth.usernamePlaceholder}
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        minLength={3}
                        className={`pl-12 pr-4 py-3 bg-white/10 border-white/20 text-text-inverse placeholder:text-text-inverse/50 focus:border-primary-400 focus:bg-white/20 transition-all duration-300 ${
                          errors.username ? 'border-error-500 focus:border-error-500' : ''
                        }`}
                      />
                    </div>
                    {errors.username && (
                      <AuthError>
                        <p className="text-sm text-error-500 font-medium">{errors.username}</p>
                      </AuthError>
                    )}
                  </div>
                </AuthInput>
                
                <AuthInput delay={0.1}>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      {t.auth.email}
                    </Label>
                    <div className="relative group">
                      <AuthIcon className="absolute left-3 top-3 h-5 w-5 group-focus-within:text-primary-400 transition-colors">
                        <IconMail />
                      </AuthIcon>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t.auth.emailPlaceholder}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`pl-12 pr-4 py-3 bg-white/10 border-white/20 text-text-inverse placeholder:text-text-inverse/50 focus:border-primary-400 focus:bg-white/20 transition-all duration-300 ${
                          errors.email ? 'border-error-500 focus:border-error-500' : ''
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <AuthError>
                        <p className="text-sm text-error-500 font-medium">{errors.email}</p>
                      </AuthError>
                    )}
                  </div>
                </AuthInput>
                
                <AuthInput delay={0.2}>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-medium">
                      {t.auth.password}
                    </Label>
                    <div className="relative group">
                      <AuthIcon className="absolute left-3 top-3 h-5 w-5 group-focus-within:text-primary-400 transition-colors">
                        <IconLock />
                      </AuthIcon>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t.auth.passwordPlaceholder}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className={`pl-12 pr-12 py-3 bg-white/10 border-white/20 text-text-inverse placeholder:text-text-inverse/50 focus:border-primary-400 focus:bg-white/20 transition-all duration-300 ${
                          errors.password ? 'border-error-500 focus:border-error-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-text-inverse/60 hover:text-text-inverse transition-colors"
                      >
                        {showPassword ? (
                          <IconEyeOff className="h-5 w-5" />
                        ) : (
                          <IconEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <AuthError>
                        <p className="text-sm text-error-500 font-medium">{errors.password}</p>
                      </AuthError>
                    )}
                  </div>
                </AuthInput>
                
                <AuthInput delay={0.3}>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-medium">
                      {t.auth.confirmPassword}
                    </Label>
                    <div className="relative group">
                      <AuthIcon className="absolute left-3 top-3 h-5 w-5 group-focus-within:text-primary-400 transition-colors">
                        <IconLock />
                      </AuthIcon>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t.auth.confirmPasswordPlaceholder}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className={`pl-12 pr-12 py-3 bg-white/10 border-white/20 text-text-inverse placeholder:text-text-inverse/50 focus:border-primary-400 focus:bg-white/20 transition-all duration-300 ${
                          errors.confirmPassword ? 'border-error-500 focus:border-error-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-text-inverse/60 hover:text-text-inverse transition-colors"
                      >
                        {showConfirmPassword ? (
                          <IconEyeOff className="h-5 w-5" />
                        ) : (
                          <IconEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <AuthError>
                        <p className="text-sm text-error-500 font-medium">{errors.confirmPassword}</p>
                      </AuthError>
                    )}
                  </div>
                </AuthInput>
                
                <AuthButton>
                  <Button
                    type="submit"
                    disabled={isLoading || formData.password !== formData.confirmPassword}
                    className="w-full bg-gradient-primary hover:bg-gradient-primary-hover text-text-inverse font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <AuthSpinner>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
                          <span>{t.auth.creatingAccount}</span>
                        </div>
                      </AuthSpinner>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>{t.auth.createAccount}</span>
                        <IconArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </AuthButton>
              </form>
              
              <AuthLink>
                <div className="mt-8 text-center">
                  <p className="text-white text-base">
                    {t.auth.hasAccount}{' '}
                    <Button
                      variant="link"
                      onClick={() => router.push(`/${lang}/login`)}
                      className="p-0 h-auto text-primary-400 hover:text-primary-300 font-semibold text-base transition-colors duration-300"
                    >
                      {t.auth.signIn}
                    </Button>
                  </p>
                </div>
              </AuthLink>
            </CardContent>
          </Card>
        </AuthCard>
      </AuthContainer>
    </div>
  );
} 