import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
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
 * Forgot password page for requesting password recovery.
 */
export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(_data: ForgotPasswordFormData) {
    setIsLoading(true);
    // TODO: Call authService.forgotPassword when API is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Revisa tu correo</CardTitle>
            <CardDescription>
              Si tu identificacion esta registrada, recibiras un enlace para
              restablecer tu contrasena.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/login">
              <Button variant="outline">Volver al inicio de sesion</Button>
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
          <CardTitle className="text-2xl">Recuperar contrasena</CardTitle>
          <CardDescription>
            Ingresa tu numero de identificacion para recibir un enlace de
            recuperacion
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="identification" className="text-sm font-medium">
                Numero de identificacion
              </label>
              <Input
                id="identification"
                type="text"
                placeholder="Ingresa tu identificacion"
                aria-describedby={
                  errors.identification ? 'identification-error' : undefined
                }
                aria-invalid={errors.identification ? 'true' : 'false'}
                {...register('identification')}
              />
              {errors.identification && (
                <p id="identification-error" className="text-sm text-destructive">
                  {errors.identification.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar enlace de recuperacion'}
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
