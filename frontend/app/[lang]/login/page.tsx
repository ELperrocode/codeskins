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

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const { t } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      router.push(`/${lang}/dashboard`);
    } catch (error) {
      setError(t.auth.login.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-secondary">
            {t.auth.login.title}
          </CardTitle>
          <CardDescription className="text-secondary/70">
            {t.auth.login.subtitle}
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
                <Label htmlFor="username">{t.auth.login.username}</Label>
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

              <div className="space-y-2 relative">
                <Label htmlFor="password">{t.auth.login.password}</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t.auth.login.loading : t.auth.login.submit}
            </Button>

            <div className="text-center">
              <p className="text-sm text-secondary/70">
                {t.auth.login.noAccount}{' '}
                <Link href={`/${lang}/register`} className="font-medium text-primary hover:text-primary/80">
                  {t.auth.login.signUp}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 