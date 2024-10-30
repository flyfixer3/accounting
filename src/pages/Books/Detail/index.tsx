// @ts-nocheck
import { useEffect } from 'react'
import { Button, Col, Flex, Image, Row } from 'antd'
import Card from 'antd/es/card/Card'
import { useNavigate } from 'react-router-dom'
import DetailRow from 'src/components/view/DetailRow/DetailRow'
import Spacer from 'src/components/view/Spacer'
import { DATETIME_FORMATTER_ENUM, USER_ROLE_ENUM } from 'src/enums/enums'
import moment from 'moment'
import useBookDetailController from '../controller/useBooksDetailController'
import { useAuth } from 'src/context/auth.context'
import { moneyFormatter } from 'src/helpers/formatter.helper'
import BookStatusBadge from '../components/BookStatusBadge'

import BookImgPlaceholder from 'src/assets/images/figures/book-image-placeholder.jpeg'

const BookDetail = () => {
  const navigate = useNavigate()
  const { getUserRole } = useAuth()
  const { onSetBreadcrumbs, params, bookDetailData } = useBookDetailController()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Books',
        path: '/books',
      },
      {
        title: 'Book Detail',
        path: `/books/${params?.id}`,
      },
    ])
  }, [])
  return (
    <>
      <Row>
        <Col xs={24}>
          <Card>
            <Row>
              <Col xs={24} sm={12}>
                <div className={'detail-title'}>
                  {bookDetailData?.bookName || '-'}
                </div>
              </Col>
              {getUserRole === USER_ROLE_ENUM?.ibo ? (
                <Col xs={24} sm={12}>
                  <Flex justify="flex-end">
                    <Button
                      type={'primary'}
                      onClick={() => {
                        navigate(`/book/edit/${bookDetailData?.bookNumber}`)
                      }}>
                      Edit Book
                    </Button>
                  </Flex>
                </Col>
              ) : null}
            </Row>

            <Spacer margin={'.5rem'} />

            <Image
              src={bookDetailData?.bookImageUrl || BookImgPlaceholder}
              width={200}
              alt={bookDetailData?.bookName}
            />

            <Spacer margin={'1rem'} />

            <DetailRow
              title={'Book Number'}
              value={bookDetailData?.bookNumber || '-'}
            />

            <DetailRow
              title={'Book Price'}
              value={`${moneyFormatter(parseInt(bookDetailData?.bookPrice))}`}
            />

            <DetailRow
              title={'Course'}
              value={`${bookDetailData?.course?.courseName || '-'} - ${
                bookDetailData?.courseLevel?.courseLevelName || '-'
              }`}
            />

            <DetailRow
              title={'Status'}
              renderValue={
                bookDetailData?.status ? (
                  <BookStatusBadge status={bookDetailData?.bookStatus} />
                ) : (
                  '-'
                )
              }
            />

            <DetailRow
              title={'Created At'}
              value={
                bookDetailData?.createdAt
                  ? moment(bookDetailData?.createdAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />

            <DetailRow
              title={'Edited At'}
              value={
                bookDetailData?.updatedAt
                  ? moment(bookDetailData?.updatedAt)?.format(
                      DATETIME_FORMATTER_ENUM?.primaryWithTime,
                    )
                  : '-'
              }
            />
          </Card>
        </Col>
      </Row>

      <Spacer margin={'1rem auto'} />
    </>
  )
}

export default BookDetail
