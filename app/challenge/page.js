'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Trophy, Check, Flame, ChevronDown,
  ChevronUp, Dumbbell, Clock, Target, RotateCcw
} from 'lucide-react';

const KEY = 'fittrack.challenge.v3';

const exercises = {
  walk: {
    name: 'Walking',
    emoji: '🚶',
    duration: '15–30 minutes',
    reps: 'Walk at a comfortable pace',
    level: 'Beginner',
    instructions: 'Walk with your head up, shoulders relaxed and arms swinging naturally. Start slowly and increase your pace when comfortable.'
  },
  normal: {
    name: 'Standard Push-up',
    emoji: '💪',
    duration: '3 sets',
    reps: '5–10 reps per set',
    level: 'Beginner',
    instructions: 'Place hands slightly wider than your shoulders. Keep your body straight, lower your chest towards the floor, then push back up. Rest between sets.'
  },
  knee: {
    name: 'Knee Push-up',
    emoji: '🧎',
    duration: '3 sets',
    reps: '6–10 reps per set',
    level: 'Beginner',
    instructions: 'Place your knees on a mat, hands slightly wider than shoulder-width, and keep a straight line from your knees to your head. Lower your chest and push up.'
  },
  diamond: {
    name: 'Diamond Push-up',
    emoji: '💎',
    duration: '2–3 sets',
    reps: '3–6 reps per set',
    level: 'Intermediate',
    instructions: 'Start in a push-up position with your hands close together, thumbs and index fingers forming a diamond. Keep your elbows controlled as you lower. This is harder than a standard push-up; use knee push-ups if needed.'
  },
  squat: {
    name: 'Bodyweight Squat',
    emoji: '🏋️',
    duration: '3 sets',
    reps: '10–15 reps per set',
    level: 'Beginner',
    instructions: 'Stand with feet about shoulder-width apart. Push your hips back, bend your knees, keep your chest lifted, then stand up. Keep your knees aligned with your toes.'
  },
  plank: {
    name: 'Forearm Plank',
    emoji: '🧘',
    duration: '3 sets',
    reps: '15–30 seconds per set',
    level: 'Beginner',
    instructions: 'Rest on your forearms and toes, keeping your body in a straight line. Brace your abdomen and breathe normally. Stop if your lower back starts to sag.'
  },
  jumping: {
    name: 'Jumping Jacks',
    emoji: '🤸',
    duration: '3 sets',
    reps: '20 repetitions per set',
    level: 'Beginner',
    instructions: 'Jump your feet apart while raising your arms overhead, then return to the starting position. Step sideways instead of jumping for a low-impact version.'
  },
  lunges: {
    name: 'Forward Lunges',
    emoji: '🦵',
    duration: '2 sets',
    reps: '8 per leg',
    level: 'Beginner',
    instructions: 'Step forward, bend both knees comfortably and keep your torso upright. Push through the front foot to return. Hold a wall for balance if needed.'
  },
  crunch: {
    name: 'Abdominal Crunch',
    emoji: '🔥',
    duration: '3 sets',
    reps: '10–15 repetitions',
    level: 'Beginner',
    instructions: 'Lie on your back with knees bent. Gently lift your shoulders using your abdominal muscles. Avoid pulling your neck.'
  },
  stretch: {
    name: 'Full-body Stretch',
    emoji: '🧘‍♂️',
    duration: '5–10 minutes',
    reps: 'Hold each stretch for 15–20 seconds',
    level: 'Beginner',
    instructions: 'Stretch your calves, thighs, shoulders and chest gently. Never bounce or force a stretch into pain.'
  },
  cycle: {
    name: 'Cycling',
    emoji: '🚴',
    duration: '15–25 minutes',
    reps: 'Steady, comfortable pace',
    level: 'Beginner',
    instructions: 'Choose a safe route or stationary bike. Start easily and maintain a pace at which you can still talk.'
  },
  jog: {
    name: 'Easy Jogging',
    emoji: '🏃',
    duration: '10–15 minutes',
    reps: 'Alternate jogging and walking',
    level: 'Beginner',
    instructions: 'Jog gently on a safe, level surface. Alternate with walking whenever necessary. You should be able to speak in short sentences.'
  },
  rest: {
    name: 'Recovery Day',
    emoji: '😴',
    duration: '5–10 minutes optional',
    reps: 'Rest and recover',
    level: 'Recovery',
    instructions: 'Allow your muscles to recover. Gentle walking or comfortable stretching is optional. Sleep well and drink water.'
  }
};

const plan = [
  ['Start Strong', ['walk', 'stretch']],
  ['Upper Body Basics', ['knee', 'normal']],
  ['Leg Day', ['squat', 'lunges']],
  ['Active Recovery', ['walk', 'stretch']],
  ['Core Basics', ['plank', 'crunch']],
  ['Cardio Day', ['jumping', 'walk']],
  ['Recovery & Review', ['rest']],
  ['Build Your Base', ['walk', 'squat']],
  ['Push-up Practice', ['knee', 'normal']],
  ['Stronger Legs', ['squat', 'lunges']],
  ['Move & Stretch', ['walk', 'stretch']],
  ['Core Challenge', ['plank', 'crunch']],
  ['Cardio Boost', ['jumping', 'jog']],
  ['Recovery Day', ['rest']],
  ['Halfway Challenge', ['walk', 'normal', 'squat']],
  ['Upper Body Progress', ['normal', 'knee']],
  ['Leg Strength', ['squat', 'lunges']],
  ['Cardio Endurance', ['cycle', 'walk']],
  ['Core & Balance', ['plank', 'crunch']],
  ['Full-body Movement', ['normal', 'squat', 'stretch']],
  ['Recovery & Reset', ['rest']],
  ['Push-up Progress', ['normal', 'diamond']],
  ['Stronger Legs', ['squat', 'lunges']],
  ['Cardio Challenge', ['jog', 'jumping']],
  ['Core Strength', ['plank', 'crunch']],
  ['Full-body Workout', ['normal', 'squat', 'plank']],
  ['Active Recovery', ['walk', 'stretch']],
  ['Personal Best', ['normal', 'squat', 'walk']],
  ['Final Preparation', ['walk', 'stretch']],
  ['You Did It!', ['walk', 'normal', 'squat', 'stretch']]
];

export default function ChallengePage() {
  const [completed, setCompleted] = useState([]);
  const [doneExercises, setDoneExercises] = useState([]);
  const [selected, setSelected] = useState(1);
  const [expanded, setExpanded] = useState('walk');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      setCompleted(saved.completed || []);
      setDoneExercises(saved.doneExercises || []);
      setSelected(saved.selected || 1);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify({
      completed,
      doneExercises,
      selected
    }));
  }, [completed, doneExercises, selected, loaded]);

  const current = plan[selected - 1];
  const exerciseIds = current[1];
  const completedCount = completed.length;
  const percent = Math.round(completedCount / 30 * 100);
  const todayDone = exerciseIds.every(id =>
    doneExercises.includes(`${selected}-${id}`)
  );

  function toggleExercise(id) {
    const key = `${selected}-${id}`;
    setDoneExercises(old =>
      old.includes(key)
        ? old.filter(x => x !== key)
        : [...old, key]
    );
  }

  function finishDay() {
    if (!todayDone) return;
    setCompleted(old =>
      old.includes(selected) ? old : [...old, selected]
    );
  }

  function resetChallenge() {
    if (!window.confirm('Reset all challenge progress? This cannot be undone.')) return;
    setCompleted([]);
    setDoneExercises([]);
    setSelected(1);
    setExpanded('walk');
  }

  return (
    <main style={s.page}>
      <header style={s.header}>
        <Link href="/dashboard" style={s.back}>
          <ArrowLeft size={18} /> Dashboard
        </Link>
        <span style={s.brand}>💙 FitTrack</span>
      </header>

      <section style={s.hero}>
        <div style={s.kicker}>YOUR 30-DAY JOURNEY</div>
        <h1 style={s.heading}>30-Day Fitness Challenge 💪</h1>
        <p style={s.subtitle}>
          Start small. Learn each movement. Get stronger one day at a time.
        </p>
        <div style={s.stats}>
          <div style={s.stat}>
            <Trophy size={22} />
            <strong>{completedCount}/30</strong>
            <span>Days completed</span>
          </div>
          <div style={s.stat}>
            <Flame size={22} />
            <strong>{percent}%</strong>
            <span>Overall progress</span>
          </div>
          <div style={s.stat}>
            <Target size={22} />
            <strong>Day {selected}</strong>
            <span>Selected day</span>
          </div>
        </div>
        <div style={s.track}>
          <div style={{ ...s.fill, width: `${percent}%` }} />
        </div>
      </section>

      <div style={s.layout}>
        <section style={s.panel}>
          <h2 style={s.title}>Choose your day</h2>
          <p style={s.muted}>Select any day to view its exercises.</p>
          <div style={s.days}>
            {plan.map((day, i) => {
              const n = i + 1;
              const isDone = completed.includes(n);
              return (
                <button
                  key={n}
                  onClick={() => {
                    setSelected(n);
                    setExpanded(plan[n - 1][1][0]);
                  }}
                  style={{
                    ...s.day,
                    ...(selected === n ? s.activeDay : {}),
                    ...(isDone ? s.doneDay : {})
                  }}
                >
                  <span>{isDone ? '✅' : `Day ${n}`}</span>
                  <small>{day[0]}</small>
                </button>
              );
            })}
          </div>
          <button style={s.reset} onClick={resetChallenge}>
            <RotateCcw size={15} /> Reset progress
          </button>
        </section>

        <section style={s.panel}>
          <div style={s.dayHeading}>
            <div>
              <span style={s.kicker}>DAY {selected} OF 30</span>
              <h2 style={s.title}>{current[0]}</h2>
            </div>
            <span style={{ fontSize: 32 }}>
              {completed.includes(selected) ? '🏆' : '🔥'}
            </span>
          </div>

          <p style={s.muted}>
            Complete the exercises below, then mark your day as complete.
          </p>

          {exerciseIds.map(id => {
            const ex = exercises[id];
            const isExpanded = expanded === id;
            const isDone = doneExercises.includes(`${selected}-${id}`);

            return (
              <article key={id} style={s.exercise}>
                <button
                  onClick={() => setExpanded(isExpanded ? '' : id)}
                  style={s.exerciseButton}
                >
                  <span style={s.emoji}>{ex.emoji}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>
                    <strong style={s.exerciseName}>{ex.name}</strong>
                    <small style={s.exerciseMeta}>
                      {ex.duration} · {ex.level}
                    </small>
                  </span>
                  {isExpanded
                    ? <ChevronUp size={19} />
                    : <ChevronDown size={19} />}
                </button>

                {isExpanded && (
                  <div style={s.details}>
                    <div style={s.reps}>
                      <Clock size={16} /> {ex.reps}
                    </div>
                    <h4 style={s.smallTitle}>How to do it</h4>
                    <p style={s.instructions}>{ex.instructions}</p>
                    {id === 'diamond' && (
                      <p style={s.tip}>
                        💡 New to push-ups? Begin with knee push-ups and build
                        up gradually. Diamond push-ups are optional.
                      </p>
                    )}
                    <label style={s.checkLabel}>
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleExercise(id)}
                      />
                      Mark this exercise complete
                    </label>
                  </div>
                )}
              </article>
            );
          })}

          <button
            onClick={finishDay}
            disabled={!todayDone || completed.includes(selected)}
            style={{
              ...s.finish,
              opacity: (!todayDone || completed.includes(selected)) ? 0.55 : 1
            }}
          >
            <Check size={18} />
            {completed.includes(selected)
              ? 'Day completed!'
              : todayDone
                ? 'Complete this day'
                : 'Finish all exercises first'}
          </button>

          {completed.includes(selected) && (
            <p style={s.success}>🎉 Great work! Your progress is saved.</p>
          )}

          <div style={s.navigation}>
            <button
              style={s.navButton}
              disabled={selected === 1}
              onClick={() => {
                setSelected(selected - 1);
                setExpanded(plan[selected - 2][1][0]);
              }}
            >
              ← Previous day
            </button>
            <button
              style={s.navButton}
              disabled={selected === 30}
              onClick={() => {
                setSelected(selected + 1);
                setExpanded(plan[selected][1][0]);
              }}
            >
              Next day →
            </button>
          </div>
        </section>
      </div>

      <footer style={s.footer}>
        FitTrack · Keep moving, keep growing 💙
      </footer>
    </main>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#f4f7fb',
    color: '#17243b',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    maxWidth: 1200,
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  back: {
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
    color: '#40516a',
    textDecoration: 'none',
    fontWeight: 600
  },
  brand: { fontWeight: 800, fontSize: 19 },
  hero: {
    maxWidth: 1200,
    margin: '0 auto 24px',
    padding: '30px',
    borderRadius: 22,
    color: 'white',
    background: 'linear-gradient(120deg,#145bdb,#20ad83)'
  },
  kicker: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    color: '#14816b'
  },
  heading: { fontSize: 'clamp(27px,4vw,40px)', margin: '12px 0' },
  subtitle: { lineHeight: 1.7, opacity: 0.95, maxWidth: 600 },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(125px,1fr))',
    gap: 14,
    margin: '26px 0 18px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    padding: 14,
    borderRadius: 14,
    background: '#ffffff20'
  },
  track: {
    height: 9,
    borderRadius: 20,
    background: '#ffffff50',
    overflow: 'hidden'
  },
  fill: {
    height: '100%',
    borderRadius: 20,
    background: '#fff',
    transition: 'width .2s'
  },
  layout: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, .85fr) minmax(0, 1.5fr)',
    gap: 22,
    alignItems: 'start'
  },
  panel: {
    background: '#fff',
    border: '1px solid #e5eaf2',
    borderRadius: 18,
    padding: 22,
    minWidth: 0
  },
  title: { fontSize: 23, margin: '8px 0 12px' },
  muted: { color: '#738096', fontSize: 14, lineHeight: 1.65 },
  days: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 8,
    marginTop: 18
  },
  day: {
    minWidth: 0,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 12,
    border: '1px solid #e1e7ef',
    borderRadius: 10,
    background: '#fff',
    color: '#34445b',
    cursor: 'pointer'
  },
  activeDay: {
    border: '2px solid #2563eb',
    background: '#eff6ff',
    color: '#1d4ed8'
  },
  doneDay: { backgroundColor: '#f0fdf4' },
  reset: {
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 18,
    border: 0,
    background: 'transparent',
    color: '#66758a',
    cursor: 'pointer'
  },
  dayHeading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  exercise: {
    border: '1px solid #e4eaf2',
    borderRadius: 14,
    marginTop: 14,
    overflow: 'hidden'
  },
  exerciseButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 13,
    width: '100%',
    padding: 15,
    border: 0,
    background: '#fff',
    color: '#18253a',
    cursor: 'pointer'
  },
  emoji: { fontSize: 30, width: 42, textAlign: 'center' },
  exerciseName: { display: 'block', fontSize: 15 },
  exerciseMeta: { display: 'block', color: '#7a879a', marginTop: 6 },
  details: {
    padding: '0 16px 17px',
    borderTop: '1px solid #edf0f5'
  },
  reps: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginTop: 15,
    color: '#1766d1',
    fontWeight: 700,
    fontSize: 14
  },
  smallTitle: { margin: '16px 0 7px' },
  instructions: { color: '#58677c', lineHeight: 1.8, fontSize: 14 },
  tip: {
    padding: 12,
    borderRadius: 10,
    background: '#fff7df',
    color: '#795a13',
    lineHeight: 1.6,
    fontSize: 13
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    marginTop: 15,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  },
  finish: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: '100%',
    padding: 15,
    border: 0,
    borderRadius: 12,
    background: '#16845f',
    color: '#fff',
    fontWeight: 800,
    marginTop: 20,
    cursor: 'pointer'
  },
  success: {
    color: '#16845f',
    textAlign: 'center',
    fontWeight: 700
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 18
  },
  navButton: {
    padding: '10px 12px',
    borderRadius: 9,
    border: '1px solid #dce4ef',
    background: '#fff',
    color: '#34445b',
    cursor: 'pointer'
  },
  footer: {
    maxWidth: 1200,
    margin: '30px auto 0',
    textAlign: 'center',
    color: '#8290a3',
    fontSize: 13
  }
};