import './globals.css';
export const metadata = {
  title: 'FitTrack — Your fitness, in focus',
  description: 'Track workouts, food, hydration, steps, weight and personal goals in one calm, clear fitness dashboard.',
  applicationName: 'FitTrack',
};
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#f7f8fc' };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
