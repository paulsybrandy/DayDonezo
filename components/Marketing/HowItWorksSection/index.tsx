import BlurFade from '@/components/ui/blur-fade';
import { ChartNoAxesCombined, Flame, NotebookPen } from 'lucide-react';

const howItWorks = [
  {
    title: '1. Write Your Accomplishments',
    description:
      'Log your achievements, reflections, or thoughts from the day, no matter how big or small.',
    icon: <NotebookPen />,
  },
  {
    title: '2. Build Consistency',
    description:
      'Keep up with your daily entries and track your streaks to stay motivated.',
    icon: <Flame />,
  },
  {
    title: '3. Reflect and Grow',
    description:
      'Review your past entries to see your progress and gain insights into your personal growth.',
    icon: <ChartNoAxesCombined />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative mt-20 flex flex-col items-center justify-center bg-primary/5 px-4 py-8 text-center sm:px-16 lg:px-32">
      <div>
        <p className="text-sm tracking-widest text-primary">HOW IT WORKS</p>
      </div>
      <div className="grid grid-cols-1 gap-4 py-8 *:mx-4 *:max-w-[250px] sm:grid-cols-2 md:grid-cols-3">
        {howItWorks.map((item, i) => (
          <BlurFade
            delay={0.2 * (i + 1)}
            inView
            className="relative z-10 mx-auto max-w-xl text-balance text-center text-xl"
            key={i}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-primary/10 p-5 text-primary">
                {item.icon}
              </div>
              <p className="text-2xl font-semibold">{item.title}</p>
              <p className="text-center">{item.description}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
