// @ts-nocheck
import { ANT_STEP_STATUS_ENUM } from 'src/enums/enums'
import React, { createContext, useContext, useState } from 'react'
import {
  IStudentFormPayload,
  IStudentRegistrationCourseClassFormData,
  IStudentRegistrationCourseDetailFormData,
  IStudentRegistrationParentFormPayload,
} from 'src/models/student-registration.model'

type formAddType = 'search_existing' | 'add_new'

export interface IFormSteps {
  step: number
  status: ANT_STEP_STATUS_ENUM
}

interface IStudentRegistrationContextData {
  formStep: IFormSteps
  formAddType: formAddType
  studentDataPayload: IStudentFormPayload
  parentDataPayload: IStudentRegistrationParentFormPayload
  courseDetailDataPayload: IStudentRegistrationCourseDetailFormData
  courseClassDataPayload: IStudentRegistrationCourseClassFormData
  handleSelectedAddType: (e: formAddType) => void
  handleChangeFormStep: (e: number) => void
  handleChangeFormStepStatus: (e: ANT_STEP_STATUS_ENUM) => void
  handleSetStudentData: (e: IStudentFormPayload) => void
  handleSetParentData: (e: IStudentRegistrationParentFormPayload) => void
  handleSetCourseDetailData: (
    e: IStudentRegistrationCourseDetailFormData,
  ) => void
  handleSetCourseClassData: (e: IStudentRegistrationCourseClassFormData) => void
  handleBackBtn: () => void
}

export interface IProviderProps {
  children?: any
}

const StudentRegistrationContext = createContext<
  IStudentRegistrationContextData | undefined
>(undefined)

export const useStudentRegistrationContext = () => {
  const context = useContext(StudentRegistrationContext)
  if (!context) {
    throw new Error('useApp must be used within an AuthProvider')
  }
  return context
}

export const StudentRegistrationProvider: React.FC<IProviderProps> = ({
  children,
}) => {
  const [studentDataPayload, setStudentDataPayload] =
    useState<IStudentFormPayload>(null)
  const [parentDataPayload, setParentDataPayload] =
    useState<IStudentRegistrationParentFormPayload>(null)
  const [courseDetailDataPayload, setCourseDetailDataPayload] =
    useState<IStudentRegistrationCourseDetailFormData>(null)
  const [courseClassDataPayload, setCourseClassDataPayload] =
    useState<IStudentRegistrationCourseClassFormData>(null)

  const [formAddType, setFormAddType] = useState<formAddType>('search_existing')
  const [formStep, setFormStep] = useState({
    step: null,
    status: ANT_STEP_STATUS_ENUM.process,
  })

  const handleSelectedAddType = (value: formAddType) => {
    setFormAddType(value)
  }

  const handleChangeFormStep = (value: number) =>
    setFormStep({ ...formStep, step: value })
  const handleChangeFormStepStatus = (value: ANT_STEP_STATUS_ENUM) =>
    setFormStep({ ...formStep, status: value })

  const handleSetStudentData = (payload: IStudentFormPayload) =>
    setStudentDataPayload(payload)

  const handleSetParentData = (
    payload: IStudentRegistrationParentFormPayload,
  ) => setParentDataPayload(payload)

  const handleSetCourseDetailData = (
    payload: IStudentRegistrationCourseDetailFormData,
  ) => setCourseDetailDataPayload(payload)

  const handleSetCourseClassData = (
    payload: IStudentRegistrationCourseClassFormData,
  ) => setCourseClassDataPayload(payload)

  const handleBackBtn = () => {
    handleChangeFormStep(formStep?.step - 1)
  }

  const data: IStudentRegistrationContextData = {
    formStep,
    formAddType,
    studentDataPayload,
    parentDataPayload,
    courseDetailDataPayload,
    courseClassDataPayload,
    handleSelectedAddType,
    handleChangeFormStep,
    handleChangeFormStepStatus,
    handleSetStudentData,
    handleSetParentData,
    handleSetCourseDetailData,
    handleSetCourseClassData,
    handleBackBtn,
  }

  return (
    <StudentRegistrationContext.Provider value={data}>
      {children}
    </StudentRegistrationContext.Provider>
  )
}
