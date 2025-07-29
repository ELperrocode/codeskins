'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { useTranslation } from '../../../lib/hooks/useTranslation';
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
  AuthBackground
} from '../../../components/ui';
import { IconUser, IconLock, IconArrowRight, IconEye, IconEyeOff } from '@tabler/icons-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = t('auth.login.usernameRequired');
    }

    if (!formData.password) {
      newErrors.password = t('auth.login.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.login.passwordMinLength');
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
      const result = await login(formData.username, formData.password);
      if (result.success && result.user) {
        // Redirigir según el rol del usuario
        const userRole = result.user.role;
        router.push(`/${lang}/dashboard/${userRole}`);
      }
    } catch (error) {
      console.error('Login error:', error);
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
      <AuthBackground>
      
      {/* Contenido principal */}
      <AuthContainer className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-16">
        <AuthCard className="w-full max-w-md">
          <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <AuthTitle>
                <CardTitle className="text-3xl font-bold text-text-inverse">
                  {t('auth.login.title')}
                </CardTitle>
              </AuthTitle>
              <AuthDescription>
                <CardDescription className="text-lg text-white">
                  {t('auth.login.subtitle')}
                </CardDescription>
              </AuthDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <AuthInput delay={0}>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-medium">
                      {t('auth.login.username')}
                    </Label>
                    <div className="relative group">
                      <AuthIcon className="absolute left-3 top-3 h-5 w-5 group-focus-within:text-primary-400 transition-colors">
                        <IconUser />
                      </AuthIcon>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder={t('auth.login.username')}
                        value={formData.username}
                        onChange={handleInputChange}
                        required
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
                    <Label htmlFor="password" className="font-medium">
                      {t('auth.login.password')}
                    </Label>
                    <div className="relative group">
                      <AuthIcon className="absolute left-3 top-3 h-5 w-5 group-focus-within:text-primary-400 transition-colors">
                        <IconLock />
                      </AuthIcon>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.login.password')}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
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
                
                <AuthButton>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-primary hover:bg-gradient-primary-hover text-text-inverse font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <AuthSpinner>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('auth.login.loggingIn')}</span>
                        </div>
                      </AuthSpinner>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>{t('auth.login.loginButton')}</span>
                        <IconArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </AuthButton>
              </form>
              
              <AuthLink>
                <div className="mt-8 text-center">
                  <p className="text-white text-base">
                    {t('auth.login.noAccount')}{' '}
                    <Button
                      variant="link"
                      onClick={() => router.push(`/${lang}/register`)}
                      className="p-0 h-auto text-primary-400 hover:text-primary-300 font-semibold text-base transition-colors duration-300"
                    >
                      {t('auth.login.signUp')}
                    </Button>
                  </p>
                </div>
              </AuthLink>
            </CardContent>
          </Card>
        </AuthCard>
      </AuthContainer>
      </AuthBackground>
    </div>
  );
} 