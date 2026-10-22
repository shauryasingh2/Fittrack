'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck, Dumbbell } from 'lucide-react';
import Logo from '../../components/Logo';

export default function Login() {
  const router = useRouter();

  return (
    <main className="login-shell">
      <div className="login-art">
        <div className="login-ring" />
        <div className="login-dumbbell">
          <Dumbbell size={78} />
        </div>
        <span className="art-chip">
          ✦ Progress, not perfection
        </span>
      </div>

      <section className="login-content">
        <div className="login-brand">
          <Logo size={38} />
          <span>FITNESS, MADE PERSONAL</span>
        </div>

        <div className="login-card">
          <div className="login-shield">
            <ShieldCheck size={22} />
          </div>

          <p className="eyebrow">WELCOME TO FITTRACK</p>

          <h1>
            Your next chapter
            <br />
            <em>starts today.</em>
          </h1>

          <p className="login-lead">
            Build healthier habits, track your training and
            see your progress in one calm, clear space.
          </p>

          <button
            className="preview-button"
            onClick={() => router.push('/dashboard')}
          >
            Open FitTrack Dashboard <span>→</span>
          </button>

          <p className="login-privacy">
            Explore FitTrack without Google login.
            Your saved data and account features may require
            authentication.
          </p>
        </div>

        <p className="login-footer">
          © FitTrack · Get your fitness tracked.
        </p>
      </section>
    </main>
  );
}