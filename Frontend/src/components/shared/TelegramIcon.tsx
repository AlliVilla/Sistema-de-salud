interface TelegramIconProps {
  size?: number
  color?: string
}

export default function TelegramIcon({
  size = 20,
  color = "currentColor",
}: TelegramIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21.5 4.5 2.8 11.6c-.9.3-.9 1.5 0 1.8l4.4 1.5 1.7 5.1c.3.8 1.3.9 1.8.3l2.4-2.6 4.5 3.3c.7.5 1.6.1 1.8-.7l3-14.2c.2-.9-.7-1.6-1.4-1.3z" />
      <path d="M7.2 14.9 18.3 7.6l-7.6 7.9-.3 3.2" />
    </svg>
  )
}
