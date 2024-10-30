// @ts-nocheck
import React from 'react'

import styles from './Initial.module.scss'
import { appColors } from 'src/assets/styles/styles'

const Initial = ({
  name = '',
  size = '30px',
  backgroundColor = appColors?.blue10,
  fontSize = '14px',
  color = appColors?.blue60,
}: {
  name?: string
  size?: string
  backgroundColor?: string
  fontSize?: string
  color?: string
}) => {
  let initial: string = ''
  if (name) {
    const tempName = name.split(' ')
    if (tempName.length > 1)
      initial =
        tempName[0].charAt(0).toUpperCase() +
        tempName[1].charAt(0).toUpperCase()
    else initial = tempName[0]?.charAt(0).toUpperCase()
  }

  return (
    <div
      className={styles?.initialWrapper}
      style={{
        width: size,
        height: size,
        backgroundColor,
      }}>
      <div
        className={styles?.initialTxt}
        style={{
          fontSize,
          color,
        }}>
        {initial}
      </div>
    </div>
  )
}

export default Initial
