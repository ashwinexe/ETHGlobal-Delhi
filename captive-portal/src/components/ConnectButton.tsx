import { useAppKit } from '@reown/appkit/react'

export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit()

  return (
    <>
      <button
        onClick={() => open()}
        className="rounded-md bg-white px-4 py-2 text-black"
      >
        Open Connect Modal
      </button>
      <button
        onClick={() => open({ view: 'Networks' })}
        className="rounded-md bg-white px-4 py-2 text-black"
      >
        Open Network Modal
      </button>
    </>
  )
}
