import BlurFade from "@/components/ui/blur-fade";
import { BookLock, ChartArea, Flame } from "lucide-react";

const featuresList = [
  {
    title: "Streaks",
    description:
      "Build momentum and stay motivated by maintaining daily goal streaks.",
    icon: <Flame />,
  },
  {
    title: "Encrypted Data",
    description: "Entries are private and securely protected with encryption.",
    icon: <BookLock />,
  },
  {
    title: "Analytics",
    description:
      "Gain valuable insights into your progress with visualized data trends.",
    icon: <ChartArea />,
  },
];

export function FeaturesSection() {
  return (
    <section className="flex flex-col text-center relative items-center lg:px-32 px-8 sm:px-16 mt-20 justify-center">
      <div>
        <p className="text-sm text-primary tracking-widest">FEATURES</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 *:mx-4 py-8 *:max-w-[250px]">
        {featuresList.map((feature, i) => (
          <BlurFade
            delay={0.2 * (i + 1)}
            inView
            className="text-xl relative z-10 mx-auto max-w-xl text-balance text-center"
            key={i}
          >
            <div className="flex flex-col gap-3 items-center">
              <div className="rounded-full bg-primary/10 text-primary p-5">
                {feature.icon}
              </div>
              <p className="font-semibold text-2xl">{feature.title}</p>
              <p className="text-center">{feature.description}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
