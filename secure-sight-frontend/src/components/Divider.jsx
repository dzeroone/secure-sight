export default function Divider({children, className}) {
  return (
    <div className={"divider " + className}>{children}</div>
  )
}