import { Link } from 'react-router-dom'
import { Bar, Tab, TabLabel } from './SubNav.styles'

export type SubNavItem = {
  label: string
  to: string
}

type SubNavProps = {
  items: SubNavItem[]
  activeTo: string
}

export default function SubNav({ items, activeTo }: SubNavProps) {
  return (
    <Bar>
      {items.map((item) => (
        <Tab key={item.to} as={Link} to={item.to} $active={item.to === activeTo}>
          <TabLabel $active={item.to === activeTo}>{item.label}</TabLabel>
        </Tab>
      ))}
    </Bar>
  )
}
