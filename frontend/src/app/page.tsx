import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login until the landing page is built
  redirect('/login');
  return null;
}
