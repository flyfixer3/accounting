// @ts-nocheck
import { appColors } from 'src/assets/styles/styles'
import { Divider as DividerComponent } from 'antd'

const Divider = ({
  backgroundColor = appColors?.neutral30,
  dashed = false,
  style,
  marginVertical = '',
  ...props
}: {
  backgroundColor?: string
  dashed?: boolean
  style?: any
  props?: any
  marginVertical?: string
}) => (
  <DividerComponent
    {...props}
    dashed={dashed}
    style={{
      borderColor: backgroundColor,
      borderWidth: 1,
      marginTop: marginVertical,
      marginBottom: marginVertical,
      ...style,
    }}
  />
)

Divider.defaultProps = {
  type: 'horizontal',
}

export default Divider
