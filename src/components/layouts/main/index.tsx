// @ts-nocheck
import { Drawer, Layout, Menu } from 'antd'
import { Content, Header } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { AiOutlineMenu } from 'react-icons/ai'
import { appColors } from 'src/assets/styles/styles'
import ModalChangePassword from 'src/components/modal/ModalChangePassword'
import { useAuth } from 'src/context/auth.context'
import useResponsive from 'src/hooks/useResponsive'
import SidebarFooter from './components/SidebarFooter'
import SidebarHeader from './components/SidebarHeader'
import useMainLayoutController from './controller/useMainLayoutController'
import styles from './index.module.scss'

const MainLayout: React.FC = () => {
  const { isModalChangePasswordVisible, handleModalChangePasswordVisibility } =
    useAuth()
  const {
    navItems,
    selectedRouteKey,
    onClickMenu,
    onRenderBreadcrumbs,
    isDrawerVisible,
    isSidebarVisible,
    handleToggleDrawer,
    handleToggleSidebar,
    hideSidebarDesktop,
  } = useMainLayoutController()

  const { isDesktop } = useResponsive()

  const _renderSidebar =
    isSidebarVisible && isDesktop && !hideSidebarDesktop ? (
      <Sider
        theme="light"
        className={styles?.sidebarContainer}
        style={{
          backgroundColor: appColors?.neutral0,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        width={240}>
        <SidebarHeader />

        <Menu
          mode="inline"
          theme={'light'}
          items={navItems}
          selectedKeys={selectedRouteKey?.key}
          onClick={onClickMenu}
          className={styles?.menuContainer}
        />

        <SidebarFooter />
      </Sider>
    ) : (
      <Drawer
        placement="left"
        closable={false}
        onClose={handleToggleDrawer}
        open={isDrawerVisible}
        contentWrapperStyle={{ width: '230px' }}
        className={styles.mobileDrawerContainer}>
        <SidebarHeader />
        <Menu
          mode="inline"
          theme={'light'}
          items={navItems}
          selectedKeys={selectedRouteKey}
          onClick={onClickMenu}
          className={styles?.menuContainer}
        />
        <SidebarFooter />
      </Drawer>
    )

  const _renderToggleDrawer = (
    <div
      className={styles?.toggleMenuContainer}
      onClick={() => {
        isDesktop && !hideSidebarDesktop
          ? handleToggleSidebar()
          : handleToggleDrawer()
      }}>
      <AiOutlineMenu color={appColors?.blue60} size={16} />
    </div>
  )

  const _renderModal = () => {
    return (
      <>
        {isModalChangePasswordVisible ? (
          <ModalChangePassword
            isVisible={isModalChangePasswordVisible}
            handleClose={handleModalChangePasswordVisibility}
          />
        ) : null}
      </>
    )
  }

  return (
    <Layout hasSider>
      {_renderSidebar}

      <Layout
        className={styles?.contentLayoutContianer}
        style={{
          background: appColors?.neutral0,
          marginLeft:
            isDesktop && isSidebarVisible && !hideSidebarDesktop ? 240 : 0,
        }}>
        <Header className={styles?.headerContainer}>
          {_renderToggleDrawer}
          <div>{onRenderBreadcrumbs()}</div>
        </Header>

        <Content className={styles?.contentContainer}>
          <Outlet />
        </Content>
      </Layout>

      {_renderModal()}
    </Layout>
  )
}

export default MainLayout
