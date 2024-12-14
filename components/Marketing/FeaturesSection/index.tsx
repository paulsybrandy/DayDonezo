import BlurFade from '@/components/ui/blur-fade';
import { BookLock, ChartArea, Flame } from 'lucide-react';

const featuresList = [
  {
    title: 'Streaks',
    description:
      'Build momentum and stay motivated by maintaining daily goal streaks.',
    icon: <Flame />,
  },
  {
    title: 'Encrypted Data',
    description: 'Entries are private and securely protected with encryption.',
    icon: <BookLock />,
  },
  {
    title: 'Analytics',
    description:
      'Gain valuable insights into your progress with visualized data trends.',
    icon: <ChartArea />,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative mt-20 flex flex-col items-center justify-center px-4 text-center sm:px-16 lg:px-32">
      <div>
        <p className="text-sm tracking-widest text-primary">FEATURES</p>
      </div>
      <div className="grid grid-cols-1 gap-4 py-8 *:mx-4 *:max-w-[250px] sm:grid-cols-2 md:grid-cols-3">
        {featuresList.map((feature, i) => (
          <BlurFade
            delay={0.2 * (i + 1)}
            inView
            className="relative z-10 mx-auto max-w-xl text-balance text-center text-xl"
            key={i}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary/10 p-5 text-primary">
                {feature.icon}
              </div>
              <p className="text-2xl font-semibold">{feature.title}</p>
              <p className="text-center">{feature.description}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
