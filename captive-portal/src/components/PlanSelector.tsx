import { useState } from 'react'
import { PlanI, plans } from '../constants'

const PlanSelector = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)

  const handleSelectPlan = (planId: number) => {
    setSelectedPlanId(planId)
  }

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)

  if (selectedPlan) {
    return (
      <div className="flex items-center justify-center bg-black">
        <div className="w-full max-w-3xl px-4 py-8">
          <div className="mb-6  text-white">
            <b>Selected Plan:</b> {selectedPlan.name}
          </div>
          <div className="mb-6   text-white">
            <b>Price:</b> {selectedPlan.price}
          </div>
          <div className="mb-6   text-white">
            <b>Description:</b> {selectedPlan.description}
          </div>
        </div>

        <button className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
          Sign In With Ethereum
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-3xl px-4 py-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Choose a Plan
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Example plans, replace with your actual plans data */}
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              handleSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const PlanCard = ({
  plan,
  handleSelectPlan
}: {
  plan: PlanI
  handleSelectPlan: (planId: number) => void
}) => {
  return (
    <div
      key={plan.id}
      className="flex flex-col rounded-lg border border-gray-800  bg-black/40 p-6 shadow transition-colors hover:border-blue-500"
      onClick={() => handleSelectPlan(plan.id)}
    >
      <h3 className="mb-2 text-lg font-semibold text-white">{plan.name}</h3>
      <div className="mb-2 text-2xl font-bold text-blue-400">{plan.price}</div>
      <p className="mb-4 text-gray-400">{plan.description}</p>
      <ul className="mb-6 space-y-1 text-sm text-gray-300">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <span className="mr-2 text-green-400">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className="mt-auto rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
        Choose Plan
      </button>
    </div>
  )
}

export default PlanSelector
