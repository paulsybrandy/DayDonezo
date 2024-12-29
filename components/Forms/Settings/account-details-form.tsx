'use client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Input } from '@/components/ui/input';
import { CardContent, CardFooter } from '@/components/ui/card';
import { useUser } from '@/app/_providers/user-provider';
import { Loader2, LogOut, Save, Settings } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import UserAvatar from '@/components/ui/user-avatar';
import { Avatar } from '@/components/ui/avatar';
import { useMutation } from '@tanstack/react-query';
import { updateUserAvatarSeed } from '@/app/actions';

const formSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  avatarSeed: z.string().min(1).max(25),
});

export default function AccountDetailsForm() {
  const { user, loading, signOut, updateUserDetails } = useUser();
  const userStore = useUserStore((state) => state.user);
  const updateAvatarSeed = useUserStore((state) => state.updateAvatarSeed);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      username: user ? user.displayName! : '',
      email: user ? user.email! : '',
      avatarSeed: userStore ? userStore.avatar_seed! : '',
    },
  });

  const updateDetailsMutation = useMutation({
    onMutate: async (values: z.infer<typeof formSchema>) => {
      try {
        updateUserDetails({
          email: values.email,
          username: values.username,
        });
        if (values.avatarSeed !== userStore?.avatar_seed) {
          updateUserAvatarSeed(values.avatarSeed)
            .then(() => {
              updateAvatarSeed(values.avatarSeed);
              toast.success('Avatar seed updated successfully');
            })
            .catch((error) => {
              toast.error('Failed to update avatar seed: ', error.message);
            });
        }
      } catch (error) {
        console.error('Form submission error', error);
        toast.error('Failed to submit the form. Please try again.');
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateDetailsMutation.mutate(values);
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <>
      <CardContent className="my-0 py-0">
        <Form {...form}>
          <form
            id="account-details-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 pb-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="example123" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarSeed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Seed</FormLabel>
                  <div className="flex items-center gap-2">
                    <div className="relative cursor-pointer">
                      <div className="absolute -bottom-2 -right-2 z-50 rounded-full border-2 border-white bg-primary p-1 text-white">
                        <Settings className="h-3 w-3" />
                      </div>
                      <Avatar
                        className="h-10 w-10 rounded-lg"
                        onClick={() => {
                          toast.info('Stay tunned!');
                        }}
                      >
                        <UserAvatar username={field.value ?? ''} />
                      </Avatar>
                    </div>

                    <FormControl>
                      <Input placeholder="example123" type="text" {...field} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Used to generate user avatar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This can&apos;t be changed right now!
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="my-0 justify-between">
        <Button type="submit" form="account-details-form" disabled={!user}>
          <Save />
          Save
        </Button>
        <Button variant={'outline'} onClick={signOut} disabled={loading}>
          {' '}
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Logout <LogOut />
            </>
          )}
        </Button>
      </CardFooter>
    </>
  );
}
