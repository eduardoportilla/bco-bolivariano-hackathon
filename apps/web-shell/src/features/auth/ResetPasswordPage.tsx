import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@repo/core/domains/auth';
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

/**
 * Reset password page for setting a new password with token from email.
 */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(_data: ResetPasswordFormData) {
    if (!token) {
      setError('Token de recuperacion invalido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call authService.resetPassword when API is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/login', {
        state: { message: 'Contrasena actualizada exitosamente' },
      });
    } catch {
      setError('Error al restablecer la contrasena. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">
              Enlace invalido
            </CardTitle>
            <CardDescription>
              El enlace de recuperacion es invalido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/forgot-password">
              <Button variant="outline">Solicitar nuevo enlace</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nueva contrasena</CardTitle>
          <CardDescription>
            Ingresa tu nueva contrasena para tu cuenta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Nueva contrasena
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu nueva contrasena"
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
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contrasena
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu nueva contrasena"
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-sm text-destructive"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-destructive text-center" role="alert">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Restablecer contrasena'}
            </Button>
            <Link to="/login">
              <Button type="button" variant="link" className="text-sm">
                Volver al inicio de sesion
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
