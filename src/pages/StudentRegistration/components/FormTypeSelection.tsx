// @ts-nocheck
import { Col, Flex, FormInstance, Radio, Row } from 'antd'

import StudentAutocomplete from 'src/components/input/StudentAutocomplete/StudentAutocomplete'
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai'
import Spacer from 'src/components/view/Spacer'

import ParentAutocomplete from 'src/components/input/ParentAutocomplete/ParentAutocomplete'
import React from 'react'
import { IParentSelect } from 'src/models/parent.model'
import { IStudentSelect } from 'src/models/student.model'
import { useStudentRegistrationContext } from '../context/student-registration.context'

interface IFormTypeSelectionProps {
  handleSelectedExistingStudent?: (e: IStudentSelect) => void
  handleSelectedExistingParent?: (e: IParentSelect) => void
  form: FormInstance
}

const FormTypeSelection: React.FC<IFormTypeSelectionProps> = ({
  handleSelectedExistingStudent,
  handleSelectedExistingParent,
  form,
}) => {
  const { formAddType, formStep, handleSelectedAddType } =
    useStudentRegistrationContext()
  return (
    <>
      <Row gutter={[8, 16]}>
        {formStep?.step === 0 || formStep?.step === 1 ? (
          <Col xs={24}>
            <Radio.Group
              onChange={(e) => {
                handleSelectedAddType(e?.target?.value)
                form.resetFields()
              }}
              value={formAddType}>
              <Radio.Button value={'search_existing'}>
                <Flex align="center">
                  <AiOutlineSearch />
                  <Spacer margin={'auto 2px'} />
                  Search Existing
                </Flex>
              </Radio.Button>
              <Radio.Button value="add_new">
                <Flex align="center">
                  <AiOutlinePlus />
                  <Spacer margin={'auto 2px'} />
                  Add New
                </Flex>
              </Radio.Button>
            </Radio.Group>
          </Col>
        ) : null}
        {formAddType === 'search_existing' ? (
          <Col xs={24}>
            {formStep?.step === 0 ? (
              <StudentAutocomplete
                allowClear={true}
                handleSelectedData={handleSelectedExistingStudent}
              />
            ) : null}

            {formStep?.step === 1 ? (
              <ParentAutocomplete
                allowClear={true}
                handleSelectedData={handleSelectedExistingParent}
              />
            ) : null}
          </Col>
        ) : null}
      </Row>
    </>
  )
}

export default FormTypeSelection
