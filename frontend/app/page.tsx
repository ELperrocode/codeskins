'use client';

import Link from 'next/link';
import { useAuth } from '../lib/auth-context';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-br from-primary/10 to-secondary/5">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-primary/10 via-primary/5 dark:from-secondary dark:via-secondary lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center gap-4">
            <span className="text-secondary">By CodeSkins Team</span>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-secondary/70">Welcome, {user.email}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-secondary/80"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/80"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/10"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-gradient-radial before:from-primary/30 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-primary/40 after:via-primary/60 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-primary/20 before:dark:opacity-10 after:dark:from-primary/30 after:dark:via-primary/50 after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Welcome to <span className="text-primary">CodeSkins</span>
        </h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href={user ? "/templates" : "/register"}
          className="group rounded-lg border border-primary/20 bg-white/50 backdrop-blur-sm px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:dark:border-primary/60 hover:dark:bg-primary/10"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-secondary`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-secondary/70`}>
            Browse our collection of premium web templates.
          </p>
        </Link>

        <Link
          href={user && user.role === 'seller' ? "/dashboard" : "/register"}
          className="group rounded-lg border border-primary/20 bg-white/50 backdrop-blur-sm px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:dark:border-primary/60 hover:dark:bg-primary/10"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-secondary`}>
            Sell{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-secondary/70`}>
            Upload and sell your own web templates.
          </p>
        </Link>

        <Link
          href={user ? "/dashboard" : "/login"}
          className="group rounded-lg border border-primary/20 bg-white/50 backdrop-blur-sm px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:dark:border-primary/60 hover:dark:bg-primary/10"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-secondary`}>
            Dashboard{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-secondary/70`}>
            Manage your templates and track sales.
          </p>
        </Link>

        <a
          href="#"
          className="group rounded-lg border border-primary/20 bg-white/50 backdrop-blur-sm px-5 py-4 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:dark:border-primary/60 hover:dark:bg-primary/10"
        >
          <h2 className={`mb-3 text-2xl font-semibold text-secondary`}>
            Support{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm text-secondary/70`}>
            Get help and support for your templates.
          </p>
        </a>
      </div>
    </main>
  )
} 