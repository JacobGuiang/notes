import { useRegister } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import validator from 'validator';
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const register = useRegister();

  const formSchema = z.object({
    username: z.string().refine((val) => validator.isAlphanumeric(val)),
    password: z.string().refine((val) => validator.isStrongPassword(val)),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange',
  });
  const { isValid } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    register.mutate(values, { onSuccess: onSuccess });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 text-center w-60"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        {register.error && (
          <p className="text-sm font-medium text-destructive">
            {isAxiosError(register.error)
              ? register.error?.response?.data.message
              : register.error.message}
          </p>
        )}
        <Button
          type="submit"
          disabled={!isValid || register.isPending}
          className="w-full"
        >
          {register.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
    </Form>
  );
};
