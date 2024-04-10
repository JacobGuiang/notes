import { useLogin } from '@/lib/auth';
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
import { isAxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin();

  const formSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { dirtyFields } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login.mutate(values, { onSuccess: onSuccess });
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
        {login.error && (
          <p className="text-sm font-medium text-destructive">
            {isAxiosError(login.error)
              ? login.error?.response?.data.message
              : login.error.message}
          </p>
        )}
        <Button
          type="submit"
          disabled={Object.keys(dirtyFields).length < 2 || login.isPending}
          className="w-full"
        >
          {login.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </Form>
  );
};
