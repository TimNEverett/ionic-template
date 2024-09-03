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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthForm: FC<{ type: "signIn" | "signUp" }> = ({ type }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (type === "signIn") {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) toast.error(error.message);
    } else if (type === "signUp") {
      await supabase.auth.signUp(values);
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error)
        form.setError("email", { type: "manual", message: error.message });
    }
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input
                  placeholder="*****"
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormDescription>min 6 chars</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {type === "signIn" ? "Sign In" : "Sign Up"}
        </Button>
        <FormMessage />
      </form>
    </Form>
  );
};
