import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const effect = async () => {
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(supabaseUser);
    };
    effect();
  }, []);
  return user;
};
