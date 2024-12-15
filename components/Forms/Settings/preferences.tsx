'use client';

import { CardContent, CardFooter } from '@/components/ui/card';
import React from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Save } from 'lucide-react';
import { Montserrat, Rubik } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const formSchema = z.object({
  font: z.string(),
});

const rubik = Rubik({
  variable: '--font-sans',
  weight: ['400'],
  subsets: ['latin-ext'],
});

const montserrat = Montserrat({
  variable: '--font-sans',
  weight: ['400'],
  subsets: ['latin-ext'],
});

const fonts = [
  {
    value: 'rubik',
    label: 'Rubik',
    font: rubik,
  },
  {
    value: 'montserrat',
    label: 'Montserrat',
    font: montserrat,
  },
];

export default function Preferences() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      font: Cookies.get('user.preferences')
        ? JSON.parse(Cookies.get('user.preferences')!).font!
        : '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    Cookies.set('user.preferences', JSON.stringify(values));
    router.refresh();
  }

  return (
    <div>
      <CardContent className="my-0 mb-4 p-6 py-0">
        <Form {...form}>
          <form
            id="preferences-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="font"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Font</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground',
                            field.value &&
                              `font-sans ${
                                fonts.find((font) => font.value === field.value)
                                  ?.font.variable
                              }`
                          )}
                        >
                          {field.value
                            ? fonts.find((font) => font.value === field.value)
                                ?.label
                            : 'Select language'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {fonts.map((fonts) => (
                              <CommandItem
                                value={fonts.label}
                                key={fonts.value}
                                onSelect={() => {
                                  form.setValue('font', fonts.value);
                                  setOpen(false);
                                }}
                                className={`font-sans ${fonts.font.variable}`}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    fonts.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {fonts.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the font that will be used in the app
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="my-0">
        <Button type="submit" form="preferences-form">
          <Save />
          Save
        </Button>
      </CardFooter>
    </div>
  );
}
