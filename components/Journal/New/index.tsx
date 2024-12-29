'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditorJS, { BlockToolConstructable } from '@editorjs/editorjs';
import { useEffect, useRef, useState } from 'react';
import Title from 'title-editorjs';
import dayjs from 'dayjs';
import { TagCreator } from './tag-creator';
import EditorjsList from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import { decryptData, encryptData } from '@/lib/utils';
import { toast } from 'sonner';
import { saveEntryToDb } from '@/app/actions';
import { useMutation } from '@tanstack/react-query';
import { Entries, useUserStore } from '@/store/userStore';

export default function NewJournalEntry() {
  const setJournalEntries = useUserStore((state) => state.setJournalEntries);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const journalEntries = useUserStore((state) => state.journalEntries);
  const editorRef = useRef<EditorJS | null>(null);
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);

  const saveEntryMutation = useMutation({
    mutationFn: async () => {
      if (editorRef.current)
        editorRef.current
          .save()
          .then(async (outputData) => {
            const encrp = encryptData(JSON.stringify(outputData));

            let text = '';
            outputData.blocks.forEach((block) => {
              if (block.type === 'paragraph') {
                text += block.data.text;
              } else if (block.type === 'list') {
                block.data.items.forEach((item: unknown) => {
                  text += item;
                });
              } else if (block.type === 'title') {
                text += block.data.text;
              }
            });
            if (text.length > 750) {
              toast.error('Entry is too long. Max 750 characters');
            } else if (text.toString().trim().length === 0) {
              toast.error('Please write something');
            } else {
              if (tags.length < 1) {
                toast.error('Please add at least one tag');
              } else {
                const data = await saveEntryToDb(encrp, tags);
                if (data?.success) {
                  const decoder = new TextDecoder();

                  if (data?.entry) {
                    const newEntry: Entries = {
                      id: data.entry.id,
                      uid: data.entry.uid,
                      content: JSON.parse(
                        decryptData(decoder.decode(data.entry.content))
                      ),
                      created_at: data.entry.created_at,
                      Tags: data.entry.Tags,
                    };
                    if (journalEntries && journalEntries?.length > 0) {
                      setJournalEntries([...journalEntries, newEntry]);
                    } else {
                      setJournalEntries([newEntry]);
                    }
                  }

                  if (data?.user && user) {
                    user.current_streak = data.user.current_streak;
                    user.max_streak = data.user.max_streak;
                    user.last_entry_at = data.user.last_entry_at;
                    user.Entries = [
                      ...user.Entries,
                      { created_at: data.entry.created_at },
                    ];
                    setUser(user);
                  }

                  toast.success('Entry saved successfully');
                } else {
                  toast.error(data?.message);
                }
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editor',
        tools: {
          title: Title,
          paragraph: {
            class: Paragraph as unknown as BlockToolConstructable,
          },
          list: {
            class: EditorjsList as unknown as BlockToolConstructable,
            inlineToolbar: true,
            config: {
              style: 'checklist',
            },
          },
        },
        placeholder: 'Finished chapter 3 of...',
      });
    }

    return () => {
      if (editorRef.current && editorRef && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveEntryMutation.mutate();
  };

  return (
    <section className="w-full place-content-center justify-items-center p-4 py-3 lg:px-16">
      <Card className="w-full max-w-3xl flex-1">
        <CardHeader>
          <CardTitle>
            <span>{dayjs().format('MMMM DD, YYYY • h:mm a')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              Add tags <span>(Max 5)</span>
            </p>
            <TagCreator setTags={setTags} />
            <p>
              Write your accomplishments <span>(Max 750 chars)</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div id="editor" className="rounded-md border p-2"></div>
              <Button type="submit" className="">
                Save
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
