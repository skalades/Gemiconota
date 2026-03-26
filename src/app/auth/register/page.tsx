"use client";

import styles from "../auth.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    graduationYear: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      // Success - redirect to login
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message);
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
        <h1 className={styles.title}>Gabung GEMIONOTA</h1>
        <p className={styles.subtitle}>Satu data, seribu aksi. Daftarkan dirimu sebagai bagian dari keluarga besar GEMIONOTA.</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className="bg-pink-500/10 text-pink-500 text-xs p-3 rounded-xl mb-4 text-center font-bold uppercase tracking-widest leading-loose">ERROR: {error}</div>}
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nama Lengkap</label>
            <input 
              type="text" 
              placeholder="Masukkan nama sesuai ijazah" 
              className={styles.input} 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tahun Lulus (Angkatan)</label>
            <input 
              type="number" 
              placeholder="Contoh: 2018" 
              className={styles.input} 
              required 
              value={formData.graduationYear}
              onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Aktif</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              className={styles.input} 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="Min. 8 karakter" 
              className={styles.input} 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah punya akun? <Link href="/auth/login" className={styles.link}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
}
