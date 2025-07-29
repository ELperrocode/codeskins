import HomePageContent from '../../components/HomePageContent';

export default function HomePage() {
  return <HomePageContent />;
}

export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' }
  ];
} 