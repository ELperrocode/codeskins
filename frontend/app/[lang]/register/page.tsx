'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import { useDictionary } from '../../../lib/hooks/useDictionary';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!username || username.length < 3) {
      setError('Username is required and must be at least 3 characters.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.register.passwordMismatch);
      setIsLoading(false);
      return;
    }
    try {
      await register(username, email, password, role);
      router.push(`/${lang}/dashboard`);
    } catch (error) {
      setError(t.auth.register.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-secondary">
            {t.auth.register.title}
          </CardTitle>
          <CardDescription className="text-secondary/70">
            {t.auth.register.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.register.email}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t.auth.register.role}</Label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'customer' | 'seller')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="customer">{t.auth.register.customer}</option>
                  <option value="seller">{t.auth.register.seller}</option>
                </select>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password">{t.auth.register.password}</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <div
                  className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary/50" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary/50" />
                  )}
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">{t.auth.register.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pr-10"
                />
                <div
                  className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary/50" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary/50" />
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t.auth.register.loading : t.auth.register.submit}
            </Button>

            <div className="text-center">
              <p className="text-sm text-secondary/70">
                {t.auth.register.hasAccount}{' '}
                <Link href={`/${lang}/login`} className="font-medium text-primary hover:text-primary/80">
                  {t.auth.register.signIn}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 