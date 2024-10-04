import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Link } from "react-router-dom";

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
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: redirect_url,
        shouldCreateUser: true,
      },
    });
    if (error) toast.error(error.message);
    else toast.success("Check your email for the login link!");
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
        Sign In / Sign Up
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
                    {...field}
                    autoComplete="email"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Sign In / Sign Up
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        By signing in, you agree to our{" "}
        <Link to="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};
