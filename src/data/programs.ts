export interface ProgramItem {
  id: string;
  name: string;
  shortName: string;
  photo: string;
  description: string;
  tags: string[];
}

export const programs: ProgramItem[] = [
  {
    id: 'aerobics',
    name: 'Aerobics',
    shortName: 'Aerobics',
    photo: 'aerobics',
    description:
      'Move, sweat, and groove together. Rhythmic group sessions packed with high energy and great music for every fitness level.',
    tags: ['Group sessions', 'Music', 'All levels'],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    shortName: 'Cardio',
    photo: 'cardio',
    description:
      'Boost your endurance and heart health with premium treadmills, bikes and rowers.',
    tags: ['Endurance', 'Heart health', 'Any time'],
  },
  {
    id: 'crossfit',
    name: 'Crossfit',
    shortName: 'Crossfit',
    photo: 'crossfit',
    description:
      'High-energy functional conditioning. Push your limits safely through dynamic movements, kettlebell work, and heart-pumping group circuits.',
    tags: ['Conditioning', 'Kettlebells', 'Circuits'],
  },
  {
    id: 'strength',
    name: 'Strength Training',
    shortName: 'Strength',
    photo: 'strength',
    description:
      'Build raw power from the ground up. Master proper mechanics with free weights and dedicated racks to build a solid foundation that lasts.',
    tags: ['Free weights', 'Racks', 'Foundation'],
  },
  {
    id: 'weight',
    name: 'Weight Management',
    shortName: 'Weight Mgmt',
    photo: 'weight',
    description:
      'Transform your body composition with confidence. Consistent progress tracking and expert guidance whether you are leaning down or bulking up.',
    tags: ['Fat loss', 'Muscle gain', 'Tracked'],
  },
  {
    id: 'nutrition',
    name: 'Nutrition Guidance',
    shortName: 'Nutrition',
    photo: 'nutrition',
    description:
      'Fuel your body right without overcomplicating it. Practical, sustainable meal frameworks tailored seamlessly to everyday lifestyles.',
    tags: ['Meal plans', 'Sustainable', 'Everyday'],
  },
  {
    id: 'personal',
    name: 'Personal Training',
    shortName: 'Personal Training',
    photo: 'personal',
    description:
      'Zero guesswork, total focus. Get personalized workout programming, expert form correction, and one-on-one coaching tailored to your individual goals and schedule.',
    tags: ['1-on-1', 'Custom plan', 'Form focus'],
  },
  {
    id: 'bodybuilding',
    name: 'Body Building',
    shortName: 'Body Building',
    photo: 'bodybuilding',
    description:
      'Your bodybuilding journey starts here. From your first transformation to the competition stage, experience structured hypertrophy training, progressive muscle development, and dedicated physique conditioning designed to take you from beginner to advanced bodybuilding and stage-ready competition preparation.',
    tags: ['Hypertrophy', 'Physique', 'Stage prep'],
  },
];
