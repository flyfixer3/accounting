// @ts-nocheck
import { useAuth } from 'src/context/auth.context'
import { appColors } from 'src/assets/styles/styles'
import { HiOutlineLogout } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import Spacer from 'src/components/view/Spacer'

import styles from '../index.module.scss'

const SidebarFooter = () => {
  const { doLogout, handleModalChangePasswordVisibility } = useAuth()

  return (
    <div className={styles?.sidebarFooterContainer}>
      <div
        className={styles?.footerMenu}
        onClick={handleModalChangePasswordVisibility}>
        <RiLockPasswordLine color={appColors?.blue60} size={16} />
        <div className={styles?.footerMenuTxt}>Change Password</div>
      </div>

      <Spacer margin=".5rem auto" />

      <div className={styles?.footerMenu} onClick={doLogout}>
        <HiOutlineLogout color={appColors?.blue60} size={16} />
        <div className={styles?.footerMenuTxt}>Sign Out</div>
      </div>
    </div>
  )
}

export default SidebarFooter
