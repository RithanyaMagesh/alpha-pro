export interface CoachItem {
  id: string;
  name: string;
  role: string;
  photoKey: 'personal' | 'coaching' | 'crossfit' | 'aerobics';
  photoPos: string;
  years: string;
  certs: string[];
  tags: string[];
  trainFirst: string;
}

export const coaches: CoachItem[] = [
  {
    id: 'coach-1',
    name: 'Trainer name',
    role: 'Head coach',
    photoKey: 'personal',
    photoPos: '22% 40%',
    years: 'X',
    certs: [
      'Certified personal trainer',
      'Strength & conditioning',
      'First aid & CPR',
    ],
    tags: ['Strength', 'Fat loss', 'Beginners'],
    trainFirst: 'Trainer',
  },
  {
    id: 'coach-2',
    name: 'Trainer name',
    role: 'Strength coach',
    photoKey: 'coaching',
    photoPos: '78% 40%',
    years: 'X',
    certs: [
      'Certified personal trainer',
      'Strength & conditioning',
      'First aid & CPR',
    ],
    tags: ['Strength', 'Fat loss', 'Beginners'],
    trainFirst: 'Trainer',
  },
  {
    id: 'coach-3',
    name: 'Trainer name',
    role: 'Crossfit coach',
    photoKey: 'crossfit',
    photoPos: '55% 30%',
    years: 'X',
    certs: [
      'Certified personal trainer',
      'Strength & conditioning',
      'First aid & CPR',
    ],
    tags: ['Strength', 'Fat loss', 'Beginners'],
    trainFirst: 'Trainer',
  },
  {
    id: 'coach-4',
    name: 'Trainer name',
    role: 'Aerobics & cardio',
    photoKey: 'aerobics',
    photoPos: '52% 30%',
    years: 'X',
    certs: [
      'Certified personal trainer',
      'Strength & conditioning',
      'First aid & CPR',
    ],
    tags: ['Strength', 'Fat loss', 'Beginners'],
    trainFirst: 'Trainer',
  },
];
