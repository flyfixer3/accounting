// @ts-nocheck
export type RouteComponent = React.ComponentType<any>

export interface IRoute {
  path: string
  name?: string
  key: string
  label: string
  icon?: React.ReactNode | string
  children?: IRoute[]
  component?: RouteComponent
  type?: string
  isNav?: boolean
  isAllowed?: string[]
}
