export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  isOpenDefault?: boolean;
}

export const faqs: FaqItem[] = [
  {
    id: 'look-around',
    question: 'Can I just come and look around first?',
    answer: 'Yes. Walk in any time we’re open, or book the free 60 minutes and a coach will show you around.',
    isOpenDefault: true,
  },
  {
    id: 'beginner-feel-lost',
    question: 'I’ve never been to a gym. Will I feel lost?',
    answer: 'That’s exactly who the free 60 minutes is for. A coach walks you round the floor and through your first workout, at your pace.',
    isOpenDefault: false,
  },
  {
    id: 'switch-plans',
    question: 'Can I switch plans later?',
    answer: 'Yes. Talk to the front desk and they’ll move you to a longer plan when you’re ready.',
    isOpenDefault: false,
  },
  {
    id: 'personal-training',
    question: 'Is personal training included?',
    answer: 'The annual plan comes with two PT sessions. On any plan you can add personal training with a certified coach.',
    isOpenDefault: false,
  },
  {
    id: 'parking',
    question: 'Where do I park?',
    answer: 'There’s dedicated parking on the premises, free for members.',
    isOpenDefault: false,
  },
];
