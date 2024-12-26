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
import { encryptData } from '@/lib/utils';
import { toast } from 'sonner';
import { saveEntryToDb } from '@/app/actions';
import { useMutation } from '@tanstack/react-query';

export default function NewJournalEntry() {
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
            if (text.length > 1000) {
              toast.error('Entry is too long. Max 1000 characters');
            } else if (text.toString().trim().length === 0) {
              toast.error('Please write something');
            } else {
              if (tags.length < 1) {
                toast.error('Please add at least one tag');
              } else {
                return await saveEntryToDb(encrp, tags);
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
    },
    onSuccess: (result) => {
      console.log(result);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
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
            <p>Write your accomplishments...</p>
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
