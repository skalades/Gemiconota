"use client";

import styles from "../auth.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect based on role once authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as any).role;
      console.log("Logged in with role:", userRole); // For user to see in browser console if they check
      
      if (userRole === "ADMIN") {
        router.replace("/admin");
      } else if (userRole === "USER") {
        router.replace("/dashboard");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email atau password salah.");
      } else {
        // Redirection is handled by the useEffect above
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={`${styles.authCard} reveal`}>
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="object-contain" />
          </Link>
        </div>
        <h1 className={styles.title}>Portal Alumni</h1>
        <p className={styles.subtitle}>Selamat datang kembali, Alumni. Silakan masuk ke akun Anda.</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              className={styles.input} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className={styles.input} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={`${styles.submitBtn} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk Sekarang"}
          </button>
        </form>

        <p className={styles.footer}>
          Belum terdaftar? <Link href="/auth/register" className={styles.link}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}
