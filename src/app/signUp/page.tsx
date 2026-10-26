"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {name: string, email: string, password: string, confirmPassword: string};

    const {data, error} = await authClient.signUp.email({
        ...user,
        callbackURL: "/"
    })

    if(data) {
        console.log(data);
        redirect("/");
    }

    if(error) {
        console.log(error);
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // TODO: call your auth client here, e.g. Better Auth:
    // await authClient.signUp.email({
    //   name: form.name,
    //   email: form.email,
    //   password: form.password,
    // });
    console.log(form);
  };

  const handleGoogle = async () => {
    // TODO: await authClient.signIn.social({ provider: "google" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-light tracking-tight text-slate-900 sm:text-4xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Start your adventure with Wanderlust
          </p>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="h-10 border-0 bg-slate-50 pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="h-10 border-0 bg-slate-50 pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="h-10 border-0 bg-slate-50 pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-10 border-0 bg-slate-50 pl-9 text-sm"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="h-10 w-full bg-[#14a0c0] text-sm font-medium text-white hover:bg-[#1189a5]"
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
              <span className="relative bg-white px-3 text-xs text-slate-500">
                Or sign up with
              </span>
            </div>

            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogle}
              className="h-10 w-full gap-2 text-sm font-medium"
            >
              <GoogleIcon />
              Sign Up With Google
            </Button>

            {/* Footer */}
            <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-[#14a0c0] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SignUpPage;