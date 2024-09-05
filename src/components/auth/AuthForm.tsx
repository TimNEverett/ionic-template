import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FC } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getSiteURL } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
});

export const AuthForm: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const redirect_url = `${getSiteURL()}auth/confirm`;
    const { data, error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: redirect_url,
        shouldCreateUser: true,
      },
    });
    if (error) toast.error(error.message);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-center justify-center w-4/5 sm:w-2/5 md:w-80"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input
                  placeholder="star.ringo@aol.com"
                  {...field}
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription>email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">sign in</Button>
        <FormMessage />
      </form>
    </Form>
  );
};
