'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type Tag = {
  value: string;
  color: string;
};

const colors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

export function TagCreator() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [tags, setTags] = React.useState<Tag[]>([]);

  const createTag = (tag: string) => {
    if (tags.length >= 5) {
      toast.error('You can only add up to 5 tags');
      return;
    }
    const random = Math.floor(Math.random() * (6 - 0) + 0);
    if (tag && !tags.some((t) => t.value === tag)) {
      setTags([...tags, { value: tag, color: colors[random].value }]);
      setValue('');
      setOpen(false);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t.value !== tag));
  };

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between md:w-[300px]"
          >
            {value || 'Select or create tag...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search or create tag..."
              value={value}
              onValueChange={setValue}
            />
            <CommandList>
              <CommandEmpty>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => createTag(value)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create &quot;{value}&quot;
                </Button>
              </CommandEmpty>
              {/* <CommandGroup heading="Existing Tags">
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.value}
                    onSelect={() => {
                      removeTag(tag.value);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className="mr-2 h-4 w-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.value}
                    </div>
                    <X className="ml-auto h-4 w-4 opacity-50" />
                  </CommandItem>
                ))}
              </CommandGroup> */}
            </CommandList>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => createTag(value)}
                  className="justify-center font-medium"
                >
                  Create Tag
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.value}
            variant="outline"
            className="inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-semibold"
          >
            <div
              style={{
                backgroundColor: tag.color,
                color: getContrastColor(tag.color),
              }}
              className="h-3 w-3 rounded-full"
            ></div>
            <span>{tag.value}</span>
            <button
              onClick={() => removeTag(tag.value)}
              className="ml-2 inline-flex items-center justify-center rounded-full bg-transparent p-1"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

function getContrastColor(hexColor: string) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}
