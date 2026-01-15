import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '@repo/core/domains/auth';
import { Button } from '@repo/ui/components/Button';
import { Input } from '@repo/ui/components/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@repo/ui/components/Card';
import { useLogin } from './hooks';

/**
 * Login page component for user authentication.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/');
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Bienvenido</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                aria-describedby={errors.username ? 'username-error' : undefined}
                aria-invalid={errors.username ? 'true' : 'false'}
                {...register('username')}
              />
              {errors.username && (
                <p id="username-error" className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contrasena
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contrasena"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={errors.password ? 'true' : 'false'}
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            {loginMutation.error && (
              <p className="text-sm text-destructive text-center" role="alert">
                Credenciales invalidas. Intenta nuevamente.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <Link to="/forgot-password">
              <Button type="button" variant="link" className="text-sm">
                Olvidaste tu contrasena?
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
