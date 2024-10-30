// @ts-nocheck
import useFileUpload from 'src/hooks/useFileUpload'
import { Button, Col, Row } from 'antd'

import ImagePlacehoder from 'src/assets/images/figures/image-placeholder.webp'

const UploadImageSimple = ({ src, alt, onChange }) => {
  const { fileRef, loading, onFileChange } = useFileUpload({
    maxSize: 2,
    onChange,
  })

  const _onChangeImage = () => {
    fileRef.current.click()
  }

  return (
    <Row align="middle" gutter={16}>
      <Col>
        {loading || !src ? (
          <img
            src={ImagePlacehoder}
            alt={'book-img-placeholder'}
            style={{
              height: '55px',
              width: '55px',
              borderRadius: '6px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            style={{
              height: '55px',
              width: '55px',
              borderRadius: '6px',
            }}
          />
        )}
      </Col>
      <Col>
        <Button type="primary" block onClick={_onChangeImage}>
          Upload Image
        </Button>
        <input
          id="menuFile"
          ref={fileRef}
          type="file"
          name="menuFile"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => onFileChange(e)}
        />
      </Col>
    </Row>
  )
}

export default UploadImageSimple
