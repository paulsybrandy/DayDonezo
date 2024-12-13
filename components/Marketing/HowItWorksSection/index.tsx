import BlurFade from "@/components/ui/blur-fade";
import { ChartNoAxesCombined, Flame, NotebookPen } from "lucide-react";

const howItWorks = [
  {
    title: "1. Write Your Accomplishments",
    description:
      "Log your achievements, reflections, or thoughts from the day, no matter how big or small.",
    icon: <NotebookPen />,
  },
  {
    title: "2. Build Consistency",
    description:
      "Keep up with your daily entries and track your streaks to stay motivated.",
    icon: <Flame />,
  },
  {
    title: "3. Reflect and Grow",
    description:
      "Review your past entries to see your progress and gain insights into your personal growth.",
    icon: <ChartNoAxesCombined />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="flex flex-col bg-primary/5 text-center relative items-center lg:px-32 px-8 sm:px-16 py-8 mt-20 justify-center">
      <div>
        <p className="text-sm text-primary tracking-widest">HOW IT WORKS</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 *:mx-4 py-8 *:max-w-[250px]">
        {howItWorks.map((item, i) => (
          <BlurFade
            delay={0.2 * (i + 1)}
            inView
            className="text-xl relative z-10 mx-auto max-w-xl text-balance text-center"
            key={i}
          >
            <div className="flex flex-col gap-3 items-center">
              <div className="rounded-full bg-primary/10 text-primary p-5">
                {item.icon}
              </div>
              <p className="font-semibold text-2xl">{item.title}</p>
              <p className="text-center">{item.description}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
