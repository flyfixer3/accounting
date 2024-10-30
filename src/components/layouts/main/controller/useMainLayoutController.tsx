// @ts-nocheck
import { nav, routes, routes_ibo } from 'src/navigation/routes'
import { Breadcrumb, MenuProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from 'src/context/app.context'
import useToggle from 'src/hooks/useToggle'
import { IRoute } from 'src/models/navigation.model'
import useResponsive from 'src/hooks/useResponsive'
import { useAuth } from 'src/context/auth.context'
import { USER_ROLE_ENUM } from 'src/enums/enums'

// TODO: Make Recursive

const useMainLayoutController = () => {
  const { breadcrumbs } = useApp()
  const { getUserRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const { isDesktop } = useResponsive()

  const [isDrawerVisible, setIsDrawerVisible] = useToggle(false)
  const [isSidebarVisible, setIsSidebarVisible] = useToggle(true)

  const [hideSidebarDesktop, setHideSidebarDesktop] = useState(false)

  type MenuItem = Required<MenuProps>['items'][number]

  const hideSidebarDesktopMenus = ['/stock-order/buy-stock']

  const _onSetNavItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: string,
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem
  }

  const navItems: MenuProps['items'] = nav?.flatMap((route) => {
    if (!route?.isNav) return []

    if (route?.isAllowed) {
      const isUserAllowed = route.isAllowed.includes(getUserRole)

      if (!isUserAllowed) return []
    }

    return route?.children?.length === 0
      ? _onSetNavItem(route?.label, route?.key, route?.icon)
      : _onSetNavItem(
          route?.label,
          route?.key,
          route?.icon,
          route?.children,
          route?.type,
        )
  })

  const OnSelectRoute = ({ routes, pathname }) => {
    let childIndex = []
    const findRoute = routes.find((route: IRoute) => {
      if (pathname === route?.path) {
        if (route.children.length > 0) {
          const nestedMenu = route.children

          const nestedRoute = nestedMenu.filter((item, index) => {
            const found =
              item.path === '/'
                ? pathname === item.path
                : pathname.includes(item.path)
            if (found) {
              childIndex.push(index)
              return found
            }
          })

          if (nestedRoute) {
            return nestedRoute
          }
        }
        return route
      }

      const currentPath = `/${pathname.split('/')[1]}`
      return currentPath === route.path
    })

    if (findRoute && findRoute.children) {
      let childRoute = findRoute

      let key = findRoute.key

      const parentKey = []
      parentKey.push(findRoute.key)

      if (childIndex.length) {
        childRoute = (findRoute?.children || [])
          .map((item: IRoute) => {
            if (`/${item.path}` === pathname) {
              return item.path
            }
          })
          .filter(Boolean) // This filters out undefined values

        key = childRoute
      }

      return {
        ...childRoute,
        label: findRoute.label,
        parentKey,
        key,
        path: key,
      }
    }
    return findRoute
  }

  const _onClickMenu: MenuProps['onClick'] = (e) => {
    const find = _getRoutes.find((item) => item.key === e.key)

    navigate(`${find?.path}`)
    isDrawerVisible && setIsDrawerVisible()
  }

  const _onRenderBreadcrumbs = () => {
    const items = breadcrumbs.map((item: any, index) => {
      let isActive: boolean = false

      if (pathname === item?.path) isActive = true

      return {
        title: (
          <Link to={item?.path} className={isActive ? 'link-active' : ''}>
            {item?.title}
          </Link>
        ),
      }
    })

    return <Breadcrumb items={items} />
  }

  const _handleToggleDrawer = () => setIsDrawerVisible()

  const _handleToggleSidebar = () => setIsSidebarVisible()

  const _selectedRouteKey = useMemo(() => {
    const res = OnSelectRoute({ routes: nav, pathname })

    return res
  }, [pathname, nav])

  const _getRoutes = useMemo(() => {
    return getUserRole === USER_ROLE_ENUM?.ibo ? routes_ibo : routes
  }, [routes, routes_ibo, getUserRole])

  useEffect(() => {
    if (hideSidebarDesktopMenus.includes(pathname) && isDesktop) {
      setHideSidebarDesktop(true)
    } else {
      setHideSidebarDesktop(false)
    }
  }, [pathname])

  return {
    navItems,
    isDrawerVisible,
    isSidebarVisible,
    selectedRouteKey: _selectedRouteKey,
    hideSidebarDesktop,
    onClickMenu: _onClickMenu,
    onRenderBreadcrumbs: _onRenderBreadcrumbs,
    handleToggleDrawer: _handleToggleDrawer,
    handleToggleSidebar: _handleToggleSidebar,
  }
}

export default useMainLayoutController
