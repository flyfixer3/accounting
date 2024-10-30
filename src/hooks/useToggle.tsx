// @ts-nocheck
import { useCallback, useState } from 'react'

const useToggle = (defaultValue: Boolean) => {
  const [value, setValue] = useState(!!defaultValue)
  const toggle = useCallback(() => setValue((val) => !val), [])

  return [value, toggle] as const // as const tells typescript that the array should b treated as having the most specific type not just a general value
}

export default useToggle
