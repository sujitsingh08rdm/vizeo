"use client";

import { ReactNode } from "react";
import Logo from "../shared/Logo";

interface AuthCardPropsInterface {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthCard = ({
  title,
  subtitle,
  children,
  footer,
}: AuthCardPropsInterface) => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-200 to-blue-100 p-3 sm:p-6 md:p-8">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 p-5 shadow-lg bg-blue-50 md:p-8">
        {/* branding +heading */}
        <header className="mb-6 flex items-start justify-between gap-4 md:mb-8">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{subtitle}</p>
          </div>
          <div className="shrink-0">
            <Logo />
          </div>
        </header>

        {children}

        {footer && (
          <p className="mt-6 text-center text-sm text-zinc-500">{footer}</p>
        )}
      </section>
    </main>
  );
};

export default AuthCard;
