import BlurFade from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import WordPullUp from '@/components/ui/word-pull-up';
import { NotebookPen } from 'lucide-react';
import React from 'react';
import Particles from '@/components/ui/particles';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import { isUserAuth } from '@/lib/auth';
import Link from 'next/link';

export default async function HeroSection() {
  const isAuthenticated = await isUserAuth();

  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-40 sm:px-16 lg:px-32">
      <div>
        <BlurFade
          delay={0.1}
          inView
          blur="0px"
          className="relative z-10 mx-auto max-w-xl text-balance text-center text-xl text-gray-500"
        >
          <Button
            variant={'outline'}
            className="z hover:text-none h-8 rounded-full px-4 text-sm font-normal shadow-sm"
          >
            <span>🧪</span> <hr className="h-full w-full border" />
            <span>Currently in Alpha</span>
          </Button>
        </BlurFade>
      </div>
      <div className="mt-8">
        <Particles
          className="absolute inset-0"
          quantity={200}
          ease={80}
          color={'#f01757'}
          refresh
        />
        <WordPullUp
          className="text-balance text-4xl font-semibold tracking-[-0.02em] text-black drop-shadow-2xl dark:text-white sm:text-5xl md:text-6xl md:leading-[4.5rem] lg:max-w-lg"
          words="Journalize📝 Your Daily Wins"
        />
      </div>
      <div className="mt-6">
        <BlurFade
          delay={0.75}
          inView
          blur="0px"
          className="mx-auto max-w-xl text-balance text-center text-xl text-gray-500"
        >
          <p>Write. Save. Share. Enjoy.</p>
        </BlurFade>
      </div>
      <div className="mt-6">
        <BlurFade
          delay={0.9}
          blur="0px"
          className="mx-auto max-w-xl text-balance text-center text-xl text-gray-500"
        >
          <Link href={isAuthenticated ? '' : '/login'}>
            <Button>
              <NotebookPen />
              Jot Your Victories
            </Button>
          </Link>
        </BlurFade>
      </div>
      <BlurFade
        delay={1.05}
        blur="0px"
        className="relative mt-10 text-balance text-center text-xl text-gray-500 md:px-16 lg:px-32"
      >
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
      </BlurFade>
    </section>
  );
}
