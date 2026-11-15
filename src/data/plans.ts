export interface PlanItem {
  id: string;
  name: string;
  price: string;
  suffix: string;
  subline: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'outline';
  isBestValue?: boolean;
}

export const plans: PlanItem[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '₹2,500',
    suffix: '/mo',
    subline: 'Try it out',
    features: ['Full gym access', 'All equipment', 'Floor support'],
    buttonText: 'Choose',
    buttonVariant: 'outline',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '₹5,000',
    suffix: '/3 mo',
    subline: '≈ ₹1,667 a month',
    features: ['Everything in monthly', 'Starter program', 'Form check-ins'],
    buttonText: 'Choose',
    buttonVariant: 'outline',
  },
  {
    id: 'half-yearly',
    name: 'Half-yearly',
    price: '₹8,000',
    suffix: '/6 mo',
    subline: '≈ ₹1,333 a month',
    features: ['Everything in quarterly', 'Nutrition guidance', 'Monthly progress review'],
    buttonText: 'Choose',
    buttonVariant: 'outline',
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '₹12,000',
    suffix: '/yr',
    subline: '₹1,000 a month',
    features: ['Everything in half-yearly', '2 PT sessions', 'Freeze up to 30 days'],
    buttonText: 'Choose annual',
    buttonVariant: 'primary',
    isBestValue: true,
  },
];

export interface CompareRow {
  feature: string;
  monthly: boolean | string;
  quarterly: boolean | string;
  halfYearly: boolean | string;
  annual: boolean | string;
}

export const compareRows: CompareRow[] = [
  {
    feature: 'Full gym access',
    monthly: true,
    quarterly: true,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'All equipment & A/C floor',
    monthly: true,
    quarterly: true,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'Free parking',
    monthly: true,
    quarterly: true,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'Starter program',
    monthly: false,
    quarterly: true,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'Form check-ins',
    monthly: false,
    quarterly: true,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'Nutrition guidance',
    monthly: false,
    quarterly: false,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'Monthly progress review',
    monthly: false,
    quarterly: false,
    halfYearly: true,
    annual: true,
  },
  {
    feature: 'Personal training sessions',
    monthly: false,
    quarterly: false,
    halfYearly: false,
    annual: '2',
  },
  {
    feature: 'Freeze membership',
    monthly: false,
    quarterly: false,
    halfYearly: false,
    annual: '30 days',
  },
];
