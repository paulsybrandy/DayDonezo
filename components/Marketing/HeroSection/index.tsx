import BlurFade from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import WordPullUp from "@/components/ui/word-pull-up";
import { NotebookPen } from "lucide-react";
import React from "react";
import Particles from "@/components/ui/particles";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

export default function HeroSection() {
  return (
    <section className="flex flex-col relative items-center lg:px-32 px-8 sm:px-16 pt-40 justify-center">
      <div>
        <BlurFade
          delay={0.1}
          inView
          blur="0px"
          className="text-xl relative z-10 text-gray-500 mx-auto max-w-xl text-balance text-center"
        >
          <Button
            variant={"outline"}
            className="rounded-full shadow-sm z px-4 h-8  hover:text-none text-sm font-normal"
          >
            <span>🧪</span> <hr className="border h-full w-full" />
            <span>Currently in Alpha</span>
          </Button>
        </BlurFade>
      </div>
      <div className="mt-8">
        <Particles
          className="absolute inset-0"
          quantity={200}
          ease={80}
          color={"#f01757"}
          refresh
        />
        <WordPullUp
          className="text-4xl drop-shadow-2xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.02em] lg:max-w-lg text-balance text-black dark:text-white md:leading-[4.5rem]"
          words="Journalize📝 Your Daily Wins"
        />
      </div>
      <div className="mt-6">
        <BlurFade
          delay={0.75}
          inView
          blur="0px"
          className="text-xl text-gray-500 mx-auto max-w-xl text-balance text-center"
        >
          <p>Write. Save. Share. Enjoy.</p>
        </BlurFade>
      </div>
      <div className="mt-6">
        <BlurFade
          delay={0.9}
          blur="0px"
          className="text-xl text-gray-500 mx-auto max-w-xl text-balance text-center"
        >
          <Button>
            <NotebookPen />
            Jot Your Victories
          </Button>
        </BlurFade>
      </div>
      <BlurFade
        delay={1.05}
        blur="0px"
        className="text-xl relative text-gray-500 mt-10 lg:px-32 md:px-16 text-balance text-center"
      >
        <HeroVideoDialog
          className="dark:hidden block"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
      </BlurFade>
    </section>
  );
}
