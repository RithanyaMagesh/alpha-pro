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
    id: 'strength',
    name: 'Strength Training',
    shortName: 'Strength',
    photo: 'strength',
    description: 'Racks, bars and plates, coached from your very first lift. Form first, weight later.',
    tags: ['Barbell', 'Progressive', 'All levels'],
  },
  {
    id: 'personal',
    name: 'Personal Training',
    shortName: 'Personal Training',
    photo: 'personal',
    description: 'One coach, one plan, built around your goal and your week.',
    tags: ['1-on-1', 'Custom plan', 'Flexible slots'],
  },
  {
    id: 'crossfit',
    name: 'Crossfit',
    shortName: 'Crossfit',
    photo: 'crossfit',
    description: 'Short, sweaty, a bit loud. Kettlebells, carries and circuits, coached so you go hard without getting hurt.',
    tags: ['High intensity', 'Groups', 'All levels'],
  },
  {
    id: 'bodybuilding',
    name: 'Body Building',
    shortName: 'Body Building',
    photo: 'bodybuilding',
    description: 'A full dumbbell wall and benches for hypertrophy splits, from your first cycle to stage prep.',
    tags: ['Hypertrophy', 'Splits', 'Intermediate+'],
  },
  {
    id: 'weight',
    name: 'Weight Management',
    shortName: 'Weight Mgmt',
    photo: 'weight',
    description: 'Lose fat or gain size steadily, with check-ins so you can see the change week to week.',
    tags: ['Fat loss', 'Weight gain', 'Tracked'],
  },
  {
    id: 'nutrition',
    name: 'Nutrition Guidance',
    shortName: 'Nutrition',
    photo: 'nutrition',
    description: 'Simple eating plans that fit Indian kitchens and real routines. Pairs with any program.',
    tags: ['Meal plans', 'Indian diet', 'Add-on'],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    shortName: 'Cardio',
    photo: 'cardio',
    description: 'Treadmills, bikes and conditioning work for stamina and heart health, on a fully air-conditioned floor.',
    tags: ['Endurance', 'Heart health', 'Any time'],
  },
  {
    id: 'aerobics',
    name: 'Aerobics',
    shortName: 'Aerobics',
    photo: 'aerobics',
    description: 'Group sessions with music and energy. Open to every fitness level.',
    tags: ['Groups', 'Music', 'Beginners welcome'],
  },
];
