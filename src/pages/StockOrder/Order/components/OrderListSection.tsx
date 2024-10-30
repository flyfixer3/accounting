// @ts-nocheck
import { Col, FloatButton, Row } from 'antd'
import { useEffect } from 'react'
import { FaShoppingBasket } from 'react-icons/fa'
import { appColors } from 'src/assets/styles/styles'

import ModalAddItem from './ModalAddItem'
import SpinFC from 'antd/es/spin'

import useStockOrderAvailableListController from '../../controller/useStockOrderAvailableListController'

import styles from '../index.module.scss'
import SearchInput from 'src/components/input/Search'
import Spacer from 'src/components/view/Spacer'
import DrawerAddToCart from './Cart/DrawerAddToCart'
import ModalCheckoutConfirmation from './ModalCheckoutConfirmation'
import { useStockOrderContext } from '../../context/stock-order.context'
import SelectActiveStatus from 'src/components/select/SelectActiveStatus'
import ListItem from './ListItem'

const OrderListSection = () => {
  const {
    itemTypeList,
    isLoading,
    list,
    isModalAddItemVisible,
    selectedItem,
    queryParams,
    onRefetch,
    onHandleSelectedData,
    onHandleModalAddItemVisibility,
    onChangeSearch,
    onChangeType,
  } = useStockOrderAvailableListController()

  const { getTotalCartItem, onHandleCartDrawerVisibility } =
    useStockOrderContext()

  useEffect(() => {
    onRefetch()
  }, [])

  return (
    <>
      <div className={styles.orderListSectionWrapper}>
        <Row gutter={[8, 8]}>
          <Col xs={10}>
            <SearchInput
              placeholder="Search by Item Name"
              onSearch={async (e: string) => {
                onChangeSearch(e)
              }}
            />
          </Col>
          <Col xs={4}>
            <SelectActiveStatus
              handleChange={onChangeType}
              value={queryParams?.itemType}
              list={itemTypeList}
              withAllTxt={'All'}
              withAll
            />
          </Col>
        </Row>

        <Spacer margin=".5rem auto" />

        {isLoading ? (
          <SpinFC size={'default'} />
        ) : (
          <Row gutter={[16, 16]}>
            {list &&
              list?.map((item, idx) => {
                return (
                  <ListItem
                    idx={idx}
                    item={item}
                    key={idx}
                    onHandleSelectedData={onHandleSelectedData}
                  />
                )
              })}
          </Row>
        )}
      </div>

      <FloatButton
        shape="circle"
        type="primary"
        icon={<FaShoppingBasket size={18} color={appColors?.neutral0} />}
        badge={{ count: getTotalCartItem }}
        onClick={onHandleCartDrawerVisibility}
      />

      {isModalAddItemVisible ? (
        <ModalAddItem
          isVisible={isModalAddItemVisible}
          handleClose={onHandleModalAddItemVisibility}
          selectedItem={selectedItem}
        />
      ) : null}

      <ModalCheckoutConfirmation />

      <DrawerAddToCart />
    </>
  )
}

export default OrderListSection
