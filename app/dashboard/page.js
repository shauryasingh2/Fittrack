'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, BarChart3, CalendarDays, Check, Droplets, Flame,
  Footprints, Menu, Plus, Scale, Target, Dumbbell, Utensils,
  X, Trash2, ArrowUpRight, Sparkles, Settings, LogOut
} from 'lucide-react';
import Logo from '../../components/Logo';
import ChallengePage from '../challenge/page';

const STORAGE_KEY = 'fittrack.local.v1';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const initialData = {
  workouts: [],
  foods: [],
  water: [],
  weights: [],
  goals: [],
  steps: {},
  settings: { water: 2500, calories: 2200, steps: 8000 }
};

const navigation = [
  ['Overview', 'overview', BarChart3],
  ['Workouts', 'workouts', Dumbbell],
  ['Calories & Food', 'food', Utensils],
  ['Water', 'water', Droplets],
  ['Steps', 'steps', Footprints],
  ['Weight', 'weight', Scale],
  ['Goals', 'goals', Target],
  ['Progress', 'progress', Activity],
  ['30-Day Challenge', 'challenge', Dumbbell],
  ['Settings', 'settings', Settings]
];

function Metric({ Icon, label, value, unit = '', detail, tone = 'green' }) {
  return (
    <div className="metric">
      <div className={`metric-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <span className="metric-label">{label}</span>
      <strong>{value}<small>{unit}</small></strong>
      <p>{detail}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function Empty({ children }) {
  return (
    <div className="empty">
      <Sparkles size={19} />
      <span>{children}</span>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(initialData);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState('');

  const [workout, setWorkout] = useState({
    name: '',
    type: 'Strength',
    duration: '30',
    calories: '180'
  });

  const [food, setFood] = useState({
    name: '',
    meal: 'Lunch',
    calories: ''
  });

  const [waterAmount, setWaterAmount] = useState('250');
  const [weight, setWeight] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [goal, setGoal] = useState({ title: '', target: '' });

  useEffect(() => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) || 'null'
      );

      if (saved && typeof saved === 'object') {
        setData({
          ...initialData,
          ...saved,
          settings: {
            ...initialData.settings,
            ...(saved.settings || {})
          }
        });
      }
    } catch (error) {
      console.error('Could not load FitTrack data:', error);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Could not save FitTrack data:', error);
    }
  }, [data, loaded]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const date = today();

  const todaysWorkouts = data.workouts.filter(
    item => item.date === date
  );

  const todaysFoods = data.foods.filter(
    item => item.date === date
  );

  const caloriesIn = todaysFoods.reduce(
    (sum, item) => sum + Number(item.calories || 0),
    0
  );

  const caloriesOut = todaysWorkouts.reduce(
    (sum, item) => sum + Number(item.calories || 0),
    0
  );

  const waterTotal = data.water
    .filter(item => item.date === date)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const stepsTotal = Number(data.steps[date] || 0);

  const latestWeight = [...data.weights]
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.value;

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date();
      d.setDate(d.getDate() - 6 + index);

      const key =
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      return {
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        minutes: data.workouts
          .filter(item => item.date === key)
          .reduce(
            (sum, item) => sum + Number(item.duration || 0),
            0
          )
      };
    });
  }, [data.workouts]);

  const maxMinutes = Math.max(
    45,
    ...week.map(day => day.minutes)
  );

  const currentTitle =
    navigation.find(item => item[1] === section)?.[0] || 'Overview';

  const firstName = 'Athlete';

  function update(key, value) {
    setData(previous => ({
      ...previous,
      [key]: value
    }));
  }

  function removeEntry(key, id) {
    update(
      key,
      data[key].filter(item => item.id !== id)
    );

    setNotice('Entry removed.');
  }

  function addWorkout(event) {
    event.preventDefault();

    if (!workout.name.trim()) return;

    update('workouts', [
      {
        ...workout,
        id: crypto.randomUUID(),
        duration: Number(workout.duration) || 0,
        calories: Number(workout.calories) || 0,
        date
      },
      ...data.workouts
    ]);

    setWorkout({
      name: '',
      type: 'Strength',
      duration: '30',
      calories: '180'
    });

    setNotice('Workout saved on this device.');
  }

  function addFood(event) {
    event.preventDefault();

    if (!food.name.trim() || Number(food.calories) <= 0) return;

    update('foods', [
      {
        ...food,
        id: crypto.randomUUID(),
        calories: Number(food.calories),
        date
      },
      ...data.foods
    ]);

    setFood({
      name: '',
      meal: 'Lunch',
      calories: ''
    });

    setNotice('Food entry saved on this device.');
  }

  function addGoal(event) {
    event.preventDefault();

    if (!goal.title.trim() || Number(goal.target) <= 0) return;

    update('goals', [
      {
        ...goal,
        id: crypto.randomUUID(),
        target: Number(goal.target),
        done: false
      },
      ...data.goals
    ]);

    setGoal({ title: '', target: '' });
    setNotice('Goal added.');
  }

  function signOut() {
    setSection('overview');
    setNotice('FitTrack is running in local preview mode.');
  }

  function list(items, key, render) {
    return items.map(item => (
      <div className="data-row" key={item.id}>
        {render(item)}
        <button
          className="delete"
          type="button"
          onClick={() => removeEntry(key, item.id)}
          aria-label="Delete entry"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ));
  }

  function progress(label, value, target, unit, tone = 'green') {
    const percentage = Math.min(
      100,
      Math.round(
        (Number(value) / Math.max(1, Number(target))) * 100
      )
    );

    return (
      <div className="progress-row">
        <div>
          <span>{label}</span>
          <b>
            {Number(value).toLocaleString()}
            {' '}
            <small>
              / {Number(target).toLocaleString()} {unit}
            </small>
          </b>
        </div>

        <div className="progress-track">
          <i
            className={tone}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="scrim"
          onClick={() => setMobileMenu(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="brand-row">
          <Logo size={34} />
          <button
            className="icon-btn close-mobile"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="workspace">
          <i /> PERSONAL WORKSPACE
        </div>

        <p className="nav-label">FITNESS TRACKER</p>

        <nav>
          {navigation.map(([label, id, Icon]) => (
            <button
              key={id}
              className={`nav-item ${section === id ? 'selected' : ''}`}
              onClick={() => {
                setSection(id);
                setMobileMenu(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="encourage">
            <Sparkles size={18} />
            <b>Small steps. Big change.</b>
            <p>
              Consistency beats intensity. Show up for yourself today.
            </p>
          </div>

          <div className="profile">
            <span className="avatar">A</span>
            <span className="profile-copy">
              <b>{firstName}</b>
              <small>Local preview</small>
            </span>

            <button
              className="icon-btn"
              onClick={signOut}
              aria-label="Account status"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="icon-btn menu-btn"
            onClick={() => setMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="crumb">
            FitTrack <span>/</span> <b>{currentTitle}</b>
          </div>

          <span className="date-chip">
            <CalendarDays size={15} />
            {new Date().toLocaleDateString('en', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </header>

        <div className="page">
          {notice && (
            <div className="notice">
              <Check size={16} />
              {notice}
              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {section === 'overview' && (
            <>
              <div className="welcome">
                <div>
                  <span className="eyebrow">YOUR FITNESS SPACE</span>
                  <h1>
                    Good to see you, {firstName} <span>✦</span>
                  </h1>
                  <p>
                    A little progress each day adds up to big results.
                  </p>
                </div>

                <button
                  className="primary"
                  onClick={() => setSection('workouts')}
                >
                  <Plus size={17} /> Log a workout
                </button>
              </div>

              <div className="hero">
                <div>
                  <span className="hero-kicker">TODAY'S FOCUS</span>
                  <h2>
                    Build habits.<br />
                    <em>Become stronger.</em>
                  </h2>
                  <p>
                    Progress isn't always loud. Keep your promises to
                    yourself, one session at a time.
                  </p>
                  <button
                    className="hero-action"
                    onClick={() => setSection('goals')}
                  >
                    View my goals <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="hero-symbol">
                  <Dumbbell size={64} />
                  <span>✦</span>
                </div>
              </div>

              <SectionTitle
                eyebrow="YOUR DAILY SNAPSHOT"
                title="Today's overview"
              />

              <div className="metrics">
                <Metric
                  Icon={Flame}
                  label="Calories consumed"
                  value={caloriesIn.toLocaleString()}
                  unit=" kcal"
                  detail={`${Math.max(0, data.settings.calories - caloriesIn)} kcal left`}
                  tone="orange"
                />

                <Metric
                  Icon={Activity}
                  label="Calories burned"
                  value={caloriesOut.toLocaleString()}
                  unit=" kcal"
                  detail={`${todaysWorkouts.length} workout(s) today`}
                  tone="purple"
                />

                <Metric
                  Icon={Footprints}
                  label="Steps today"
                  value={stepsTotal.toLocaleString()}
                  detail={`${Math.min(100, Math.round(stepsTotal / data.settings.steps * 100))}% of daily target`}
                  tone="green"
                />

                <Metric
                  Icon={Droplets}
                  label="Water intake"
                  value={(waterTotal / 1000).toFixed(2)}
                  unit=" L"
                  detail={`${Math.max(0, data.settings.water - waterTotal)} ml to go`}
                  tone="cyan"
                />
              </div>

              <div className="columns">
                <section className="panel">
                  <SectionTitle
                    eyebrow="YOUR CONSISTENCY"
                    title="Activity this week"
                  />

                  <div className="chart">
                    {week.map((day, index) => (
                      <div
                        className="bar-col"
                        key={`${day.label}-${index}`}
                      >
                        <small>{day.minutes || ''}</small>
                        <div className="bar-bg">
                          <i
                            style={{
                              height: `${day.minutes ? Math.max(8, day.minutes / maxMinutes * 100) : 2}%`
                            }}
                          />
                        </div>
                        <span>{day.label}</span>
                      </div>
                    ))}
                  </div>

                  <p className="chart-note">
                    {week.reduce((sum, day) => sum + day.minutes, 0)}
                    {' '}workout minutes · Last 7 days
                  </p>
                </section>

                <section className="panel">
                  <SectionTitle
                    eyebrow="DAILY HABITS"
                    title="Keep your rhythm"
                  />

                  {progress('Hydration', waterTotal, data.settings.water, 'ml', 'cyan')}
                  {progress('Movement', stepsTotal, data.settings.steps, 'steps')}
                  {progress('Nutrition', caloriesIn, data.settings.calories, 'kcal', 'orange')}

                  <button
                    className="text-btn"
                    onClick={() => setSection('settings')}
                  >
                    Adjust daily targets ↗
                  </button>
                </section>
              </div>

              <div className="columns">
                <section className="panel">
                  <SectionTitle
                    eyebrow="RECENT ACTIVITY"
                    title="Latest workouts"
                    action={
                      <button
                        className="text-btn"
                        onClick={() => setSection('workouts')}
                      >
                        See all ↗
                      </button>
                    }
                  />

                  {data.workouts.slice(0, 4).map(item => (
                    <div className="data-row" key={item.id}>
                      <span className="mini-icon">
                        <Dumbbell size={17} />
                      </span>
                      <span className="row-copy">
                        <b>{item.name}</b>
                        <small>{item.type} · {item.duration} min</small>
                      </span>
                      <time>{item.date}</time>
                    </div>
                  ))}

                  {!data.workouts.length && (
                    <Empty>
                      Log a workout to start building your history.
                    </Empty>
                  )}
                </section>

                <section className="panel">
                  <SectionTitle
                    eyebrow="YOUR WHY"
                    title="Goals in motion"
                  />

                  {data.goals.slice(0, 4).map(item => (
                    <button
                      className="goal-row"
                      key={item.id}
                      onClick={() => setSection('goals')}
                    >
                      <span className={`goal-check ${item.done ? 'done' : ''}`}>
                        {item.done ? '✓' : ''}
                      </span>
                      <span>{item.title}</span>
                    </button>
                  ))}

                  {!data.goals.length && (
                    <Empty>Add one personal goal and start small.</Empty>
                  )}

                  <button
                    className="outline"
                    onClick={() => setSection('goals')}
                  >
                    <Plus size={15} /> Create a goal
                  </button>
                </section>
              </div>
            </>
          )}

          {section === 'workouts' && (
            <>
              <SectionTitle eyebrow="TRAINING LOG" title="Workouts" />
              <p className="intro">
                Record your sessions and build a routine you can stick to.
              </p>

              <section className="panel">
                <form className="form-grid" onSubmit={addWorkout}>
                  <label>
                    Workout name
                    <input
                      className="input"
                      value={workout.name}
                      onChange={e => setWorkout({ ...workout, name: e.target.value })}
                      placeholder="e.g. Full body strength"
                      required
                    />
                  </label>

                  <label>
                    Type
                    <select
                      className="input"
                      value={workout.type}
                      onChange={e => setWorkout({ ...workout, type: e.target.value })}
                    >
                      {['Strength', 'Cardio', 'Running', 'Walking', 'Cycling', 'Swimming', 'Yoga', 'Other'].map(item => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Duration (min)
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={workout.duration}
                      onChange={e => setWorkout({ ...workout, duration: e.target.value })}
                      required
                    />
                  </label>

                  <label>
                    Calories burned
                    <input
                      className="input"
                      type="number"
                      min="0"
                      value={workout.calories}
                      onChange={e => setWorkout({ ...workout, calories: e.target.value })}
                    />
                  </label>

                  <button className="primary">
                    <Plus size={16} /> Save workout
                  </button>
                </form>
              </section>

              <section className="panel">
                <SectionTitle eyebrow="YOUR HISTORY" title="Workout history" />
                {list(data.workouts, 'workouts', item => (
                  <>
                    <span className="mini-icon"><Dumbbell size={17} /></span>
                    <span className="row-copy">
                      <b>{item.name}</b>
                      <small>{item.type} · {item.duration} min · {item.calories} kcal</small>
                    </span>
                    <time>{item.date}</time>
                  </>
                ))}
                {!data.workouts.length && (
                  <Empty>No workouts yet. Log your first session above.</Empty>
                )}
              </section>
            </>
          )}

          {section === 'food' && (
            <>
              <SectionTitle eyebrow="FUEL YOUR BODY" title="Calories & food" />

              <div className="metrics two">
                <Metric
                  Icon={Utensils}
                  label="Consumed today"
                  value={caloriesIn.toLocaleString()}
                  unit=" kcal"
                  detail={`Target ${data.settings.calories} kcal`}
                  tone="orange"
                />
                <Metric
                  Icon={Flame}
                  label="Remaining today"
                  value={Math.max(0, data.settings.calories - caloriesIn).toLocaleString()}
                  unit=" kcal"
                  detail="Based on your daily target"
                  tone="purple"
                />
              </div>

              <section className="panel">
                <SectionTitle eyebrow="FOOD DIARY" title="Add a food entry" />

                <form className="form-grid" onSubmit={addFood}>
                  <label>
                    Food name
                    <input
                      className="input"
                      value={food.name}
                      onChange={e => setFood({ ...food, name: e.target.value })}
                      placeholder="e.g. poha, eggs, rice"
                      required
                    />
                  </label>

                  <label>
                    Meal
                    <select
                      className="input"
                      value={food.meal}
                      onChange={e => setFood({ ...food, meal: e.target.value })}
                    >
                      {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(item => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Calories (kcal)
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={food.calories}
                      onChange={e => setFood({ ...food, calories: e.target.value })}
                      required
                    />
                  </label>

                  <button className="primary">
                    <Plus size={16} /> Add food
                  </button>
                </form>
              </section>

              <section className="panel">
                <SectionTitle eyebrow="TODAY" title="Food entries" />
                {list(todaysFoods, 'foods', item => (
                  <>
                    <span className="mini-icon orange"><Utensils size={17} /></span>
                    <span className="row-copy">
                      <b>{item.name}</b>
                      <small>{item.meal}</small>
                    </span>
                    <strong>{item.calories} kcal</strong>
                  </>
                ))}
                {!todaysFoods.length && (
                  <Empty>Add meals to see your daily calorie total.</Empty>
                )}
              </section>
            </>
          )}

          {section === 'water' && (
            <>
              <SectionTitle eyebrow="HYDRATION" title="Water tracker" />

              <section className="panel center-panel">
                <span className="big-icon cyan"><Droplets size={28} /></span>
                <span className="eyebrow">TODAY'S WATER</span>

                <div className="big-number">
                  {(waterTotal / 1000).toFixed(2)} <small>litres</small>
                </div>

                {progress('Daily target', waterTotal, data.settings.water, 'ml', 'cyan')}

                <div className="quick-add">
                  <label>
                    Add amount
                    <select
                      className="input"
                      value={waterAmount}
                      onChange={e => setWaterAmount(e.target.value)}
                    >
                      {[
                        ['150', '150 ml · small glass'],
                        ['250', '250 ml · glass'],
                        ['350', '350 ml · bottle'],
                        ['500', '500 ml · large bottle'],
                        ['750', '750 ml']
                      ].map(item => (
                        <option value={item[0]} key={item[0]}>{item[1]}</option>
                      ))}
                    </select>
                  </label>

                  <button
                    className="primary"
                    onClick={() => {
                      update('water', [
                        {
                          id: crypto.randomUUID(),
                          amount: Number(waterAmount),
                          date,
                          at: new Date().toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        },
                        ...data.water
                      ]);
                      setNotice('Water logged.');
                    }}
                  >
                    <Plus size={16} /> Log water
                  </button>
                </div>
              </section>

              <section className="panel">
                <SectionTitle eyebrow="TODAY" title="Water history" />
                {list(data.water.filter(item => item.date === date), 'water', item => (
                  <>
                    <span className="mini-icon cyan"><Droplets size={17} /></span>
                    <span className="row-copy">
                      <b>{item.amount} ml water</b>
                      <small>{item.at}</small>
                    </span>
                  </>
                ))}
                {!data.water.some(item => item.date === date) && (
                  <Empty>Every glass counts. Log your first drink.</Empty>
                )}
              </section>
            </>
          )}

          {section === 'steps' && (
            <>
              <SectionTitle eyebrow="MOVE A LITTLE MORE" title="Steps tracker" />

              <section className="panel center-panel">
                <span className="big-icon green"><Footprints size={28} /></span>
                <span className="eyebrow">TODAY'S STEPS</span>

                <div className="big-number">
                  {stepsTotal.toLocaleString()} <small>steps</small>
                </div>

                {progress('Daily target', stepsTotal, data.settings.steps, 'steps')}

                <form
                  className="inline-form"
                  onSubmit={e => {
                    e.preventDefault();
                    if (stepsInput === '') return;

                    update('steps', {
                      ...data.steps,
                      [date]: Number(stepsInput)
                    });

                    setStepsInput('');
                    setNotice('Steps saved on this device.');
                  }}
                >
                  <label>
                    Enter total steps
                    <input
                      className="input"
                      type="number"
                      min="0"
                      value={stepsInput}
                      onChange={e => setStepsInput(e.target.value)}
                      placeholder="e.g. 6420"
                      required
                    />
                  </label>

                  <button className="primary">Save steps</button>
                </form>

                <p className="helper">
                  Enter the total from your phone or fitness watch.
                  FitTrack does not automatically read device sensors.
                </p>
              </section>
            </>
          )}

          {section === 'weight' && (
            <>
              <SectionTitle eyebrow="YOUR TREND" title="Weight tracker" />

              <section className="panel">
                <SectionTitle eyebrow="NEW MEASUREMENT" title="Log your weight" />

                <form
                  className="inline-form"
                  onSubmit={e => {
                    e.preventDefault();
                    if (Number(weight) <= 0) return;

                    update('weights', [
                      {
                        id: crypto.randomUUID(),
                        value: Number(weight),
                        date
                      },
                      ...data.weights
                    ]);

                    setWeight('');
                    setNotice('Weight saved on this device.');
                  }}
                >
                  <label>
                    Weight (kg)
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="500"
                      step="0.1"
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 74.5"
                      required
                    />
                  </label>

                  <button className="primary">
                    <Plus size={16} /> Save weight
                  </button>
                </form>

                {latestWeight && (
                  <div className="weight-summary">
                    <Scale size={20} />
                    <span>Latest entry</span>
                    <b>{latestWeight} kg</b>
                  </div>
                )}
              </section>

              <section className="panel">
                <SectionTitle eyebrow="MEASUREMENT HISTORY" title="Your weight log" />
                {list(
                  [...data.weights].sort((a, b) => b.date.localeCompare(a.date)),
                  'weights',
                  item => (
                    <>
                      <span className="mini-icon rose"><Scale size={17} /></span>
                      <span className="row-copy">
                        <b>{item.value} kg</b>
                        <small>Body weight</small>
                      </span>
                      <time>{item.date}</time>
                    </>
                  )
                )}
                {!data.weights.length && (
                  <Empty>Add a weigh-in to start building your trend.</Empty>
                )}
              </section>
            </>
          )}

          {section === 'goals' && (
            <>
              <SectionTitle eyebrow="YOUR WHY" title="Goals that move you" />
              <p className="intro">
                Make your next milestone clear, achievable and yours.
              </p>

              <section className="panel">
                <form className="form-grid goal-form" onSubmit={addGoal}>
                  <label>
                    Goal name
                    <input
                      className="input"
                      value={goal.title}
                      onChange={e => setGoal({ ...goal, title: e.target.value })}
                      placeholder="e.g. Walk every day"
                      required
                    />
                  </label>

                  <label>
                    Target number
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={goal.target}
                      onChange={e => setGoal({ ...goal, target: e.target.value })}
                      required
                    />
                  </label>

                  <button className="primary">
                    <Plus size={16} /> Create goal
                  </button>
                </form>
              </section>

              <div className="goal-list">
                {data.goals.map(item => (
                  <section className="panel goal-card" key={item.id}>
                    <button
                      className={`goal-check ${item.done ? 'done' : ''}`}
                      onClick={() => update(
                        'goals',
                        data.goals.map(goalItem =>
                          goalItem.id === item.id
                            ? { ...goalItem, done: !goalItem.done }
                            : goalItem
                        )
                      )}
                    >
                      {item.done ? '✓' : ''}
                    </button>

                    <span className="row-copy">
                      <b className={item.done ? 'strike' : ''}>
                        {item.title}
                      </b>
                      <small>
                        {item.done
                          ? 'Completed — nice work!'
                          : `Target: ${item.target}`}
                      </small>
                      <span className="progress-track">
                        <i
                          className={item.done ? 'green' : ''}
                          style={{ width: item.done ? '100%' : '0%' }}
                        />
                      </span>
                    </span>

                    <button
                      className="delete"
                      onClick={() => removeEntry('goals', item.id)}
                      aria-label="Delete goal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </section>
                ))}

                {!data.goals.length && (
                  <Empty>Add a personal goal above to get started.</Empty>
                )}
              </div>
            </>
          )}

          {section === 'progress' && (
            <>
              <SectionTitle eyebrow="ZOOM OUT" title="Your progress" />
              <p className="intro">
                Your summary uses the entries you've actually logged.
              </p>

              <div className="metrics">
                <Metric
                  Icon={Dumbbell}
                  label="Total workouts"
                  value={data.workouts.length}
                  detail={`${data.workouts.reduce((sum, item) => sum + Number(item.duration || 0), 0)} total minutes`}
                  tone="purple"
                />

                <Metric
                  Icon={Flame}
                  label="Calories burned"
                  value={data.workouts.reduce((sum, item) => sum + Number(item.calories || 0), 0).toLocaleString()}
                  unit=" kcal"
                  detail="From logged workouts"
                  tone="orange"
                />

                <Metric
                  Icon={Droplets}
                  label="Water logged"
                  value={(data.water.reduce((sum, item) => sum + Number(item.amount || 0), 0) / 1000).toFixed(1)}
                  unit=" L"
                  detail="Across saved entries"
                  tone="cyan"
                />

                <Metric
                  Icon={Scale}
                  label="Weight entries"
                  value={data.weights.length}
                  detail={latestWeight ? `Latest: ${latestWeight} kg` : 'No measurements yet'}
                  tone="green"
                />
              </div>

              <section className="panel">
                <SectionTitle
                  eyebrow="WEEKLY CONSISTENCY"
                  title="Workout minutes by day"
                />

                <div className="chart tall">
                  {week.map((day, index) => (
                    <div
                      className="bar-col"
                      key={`${day.label}-${index}`}
                    >
                      <small>{day.minutes || ''}</small>
                      <div className="bar-bg">
                        <i
                          style={{
                            height: `${day.minutes ? Math.max(8, day.minutes / maxMinutes * 100) : 2}%`
                          }}
                        />
                      </div>
                      <span>{day.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <SectionTitle
                  eyebrow="HONEST NUMBERS"
                  title="Real progress, no made-up stats"
                />
                <p className="intro">
                  Charts and totals are calculated from entries you save.
                  Empty history means no entries have been logged yet.
                </p>
              </section>
            </>
          )}
          {section === 'challenge' && (
  <section className="challenge-in-dashboard">
    <button
      className="outline"
      type="button"
      onClick={() => setSection('overview')}
      style={{ marginBottom: '20px' }}
    >
      ← Back to Dashboard
    </button>

    <ChallengePage />
  </section>
)}
          {section === 'settings' && (
            <>
              <SectionTitle eyebrow="MAKE IT YOURS" title="Daily targets" />
              <p className="intro">
                Set targets that suit your routine. Changes save automatically.
              </p>

              <section className="panel settings">
                {[
                  ['water', 'Water target (ml/day)', 250],
                  ['calories', 'Calorie target (kcal/day)', 50],
                  ['steps', 'Step target (steps/day)', 500]
                ].map(([key, label, stepSize]) => (
                  <label key={key}>
                    {label}
                    <input
                      className="input"
                      type="number"
                      min="1"
                      step={stepSize}
                      value={data.settings[key]}
                      onChange={e => setData(previous => ({
                        ...previous,
                        settings: {
                          ...previous.settings,
                          [key]: Math.max(1, Number(e.target.value) || 1)
                        }
                      }))}
                    />
                  </label>
                ))}

                <p className="helper">
                  This version saves entries in this browser only.
                  Supabase account login and cloud database sync are not
                  enabled in this preview.
                </p>

                <button
                  className="outline"
                  onClick={() => {
                    if (window.confirm(
                      'Delete all locally saved FitTrack entries from this browser?'
                    )) {
                      setData(initialData);
                      setNotice('Local entries cleared.');
                    }
                  }}
                >
                  <Trash2 size={15} /> Clear local entries
                </button>
              </section>

              <section className="panel">
                <SectionTitle eyebrow="ACCOUNT" title="Preview mode" />
                <p className="intro">
                  You can use the dashboard without Google login.
                  Your entries stay on this device and browser.
                </p>
                <button className="outline" onClick={signOut}>
                  <LogOut size={15} /> Return to overview
                </button>
              </section>
            </>
          )}

          <footer className="footer">
            <Logo size={23} />
            <span>Make today count.</span>
            <small>Local preview mode</small>
          </footer>
        </div>
      </main>
    </div>
  );
}