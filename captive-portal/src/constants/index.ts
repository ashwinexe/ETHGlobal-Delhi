export interface PlanI {
  id: number
  name: string
  price: string
  description: string
  features: string[]
}

export const plans = [
  {
    id: 0,
    name: 'Free Plan',
    price: 'Free',
    description: 'Good for light browsing and email.',
    features: ['1GB Data', 'Up to 1 Mbps', '1 Device']
  },
  {
    id: 1,
    name: 'Basic Plan',
    price: '$5/mo',
    description: 'Good for light browsing and email.',
    features: ['10GB Data', 'Up to 10 Mbps', '1 Device']
  },
  {
    id: 2,
    name: 'Standard Plan',
    price: '$15/mo',
    description: 'Great for streaming and gaming.',
    features: ['100GB Data', 'Up to 100 Mbps', '3 Devices']
  },
  {
    id: 3,
    name: 'Premium Plan',
    price: '$30/mo',
    description: 'Unlimited data for power users.',
    features: ['Unlimited Data', 'Up to 1 Gbps', '10 Devices']
  }
]
