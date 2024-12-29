'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { saveFeedback } from '@/app/actions';

const suggestionFormSchema = z.object({
  message: z.string().max(500),
});

export function FeedbackForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
  const form = useForm<z.infer<typeof suggestionFormSchema>>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof suggestionFormSchema>) => {
    if (!(values.message.toString().trim().length > 0)) {
      toast.error('Message is empty!');
      return;
    }
    if (values.message.length > 250) {
      toast.error('Message is too long!');
      return;
    }
    feedbackMutation.mutate(values);
  };

  const feedbackMutation = useMutation({
    mutationFn: async (values: z.infer<typeof suggestionFormSchema>) => {
      await saveFeedback(values.message)
        .then((res) => {
          if (res.success) {
            toast.success('Feedback submitted successfully');
          } else {
            toast.error(res.message);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    },
    onSuccess: () => {
      setIsOpen(false);
    },
    onError: () => {
      setIsOpen(false);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="This app is amazing, but it can be better if..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief about your feedback/suggestion
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
