import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqList = [
  {
    title: 'What is DayDonezo?',
    description:
      'DayDonezo is a web-based digital diary and journaling app designed to help users track their daily accomplishments. It offers features like encrypted data storage, streak tracking, and analytics to support personal growth and productivity.',
  },
  {
    title: 'How secure is my data on Daydonezo?',
    description:
      'Data security is a priority for Daydonezo. All journal entries are encrypted, ensuring that only you can access your private notes. The platform uses industry-standard encryption methods to protect your information.',
  },
  {
    title: 'Do I need an account to use DayDonezo?',
    description:
      'Yes, you will need to create an account to access DayDonezo. The platform uses Clerk for authentication, which ensures a secure and streamlined sign-up and login experience.',
  },
  {
    title: 'Is DayDonezo free to use?',
    description:
      'Details on pricing and availability will be shared closer to the launch date. Some features may be free, while premium features (like advanced analytics) may require a subscription or one-time payment.',
  },
  {
    title: 'Can I customize the appearance of my journal?',
    description:
      'Customization options such as themes, colors, and layouts are being considered for future updates. User feedback will play a vital role in determining which customization features are prioritized.',
  },
  {
    title: 'How do I track my streaks?',
    description:
      'DayDonezo automatically tracks your daily entries. If you log a journal entry for consecutive days, the app will display a &quot;streak&quot; count to keep you motivated.',
  },
  {
    title: 'How can I view my past entries?',
    description:
      'You can view your past entries through a calendar-based view or a list view. These views allow you to navigate quickly to specific dates and review previous journal entries.',
  },
  {
    title: 'How do the analytics work?',
    description:
      'The analytics feature provides visual insights into your journaling habits, such as the number of entries made over time, streak progress, and patterns of activity. These insights aim to help users understand and improve their journaling consistency.',
  },
  {
    title: 'Can I export my data from DayDonezo?',
    description:
      'An export feature is planned for future updates, allowing users to back up or transfer their journal entries as a file. This feature ensures that you have full control over your data.',
  },
  {
    title: 'Can I provide feedback or suggest features for DayDonezo?',
    description:
      'Yes, absolutely! Feedback from users is welcome and encouraged. You can share your ideas and suggestions through the feedback section within the app or via the official contact email.',
  },
];

export default function FaqSection() {
  return (
    <section className="relative mt-20 flex flex-col items-center justify-center px-4 py-8 sm:px-16 lg:px-32">
      <div>
        <p className="text-sm tracking-widest text-primary">FAQ</p>
      </div>
      <p className="mt-4 text-4xl font-semibold">Frequently asked questions</p>
      <Accordion
        type="single"
        collapsible
        className="mt-8 w-full max-w-2xl space-y-2 *:rounded-md *:border *:px-4"
      >
        {faqList.map((faq, i) => (
          <AccordionItem value={'item-' + i} key={i}>
            <AccordionTrigger>{faq.title}</AccordionTrigger>
            <AccordionContent>{faq.description}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
