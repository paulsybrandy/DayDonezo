"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function LoginForm() {
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });

  const githubProvider = new GithubAuthProvider();

  const [error, setError] = useState("");
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setError("");

    try {
      const credential = await signInWithEmailAndPassword(
        getAuth(app),
        values.email,
        values.password
      );
      const idToken = await credential.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push("/");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function signInWithProvider(type: number) {
    try {
      let credentials: UserCredential;
      if (type === 0) {
        credentials = await signInWithPopup(getAuth(app), googleProvider);
      } else if (type === 1) {
        credentials = await signInWithPopup(getAuth(app), githubProvider);
      }
      const idToken = await credentials!.user.getIdToken();

      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      router.push("/");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center p-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Login to DayDonezo
          </h1>
          {error && (
            <CardDescription className="text-red-500">{error}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800"
              >
                Submit
              </Button>
            </form>
          </Form>{" "}
          <div className="flex items-center gap-8">
            <hr className="flex-1" />
            <span>or</span>
            <hr className="flex-1" />
          </div>
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => signInWithPopup(getAuth(app), googleProvider)}
          >
            <Image
              src="/svgs/google-logo.svg"
              height={20}
              width={20}
              alt="google-svg"
            />
            Sign In with Google
          </Button>
          <Button
            variant={"link"}
            className="w-full hover:no-underline bg-black text-white"
            onClick={() => signInWithProvider(1)}
          >
            <Image
              src="/svgs/github-logo.svg"
              height={20}
              width={20}
              alt="google-svg"
            />
            Sign In with GitHub
          </Button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-gray-600 hover:underline dark:text-gray-500"
            >
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
