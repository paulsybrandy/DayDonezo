'use client';

import React from 'react';
import ShimmerButton from '../ui/shimmer-button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { FeedbackForm } from '../Forms/feedback-form';
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedbackModal() {
  const { isMobile, state } = useSidebar();
  const [isOpen, setIsOpen] = React.useState<boolean>();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        {!isMobile && state === 'collapsed' && (
          <SidebarMenuButton>
            <MessageSquare />
          </SidebarMenuButton>
        )}

        <ShimmerButton
          onClick={() => setIsOpen(true)}
          className={cn(
            'h-10 w-full',
            !isMobile && state === 'collapsed' && 'hidden'
          )}
          borderRadius="6px"
          background="hsl(var(--primary))"
        >
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Feedback
          </span>
        </ShimmerButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <FeedbackForm setIsOpen={setIsOpen} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
