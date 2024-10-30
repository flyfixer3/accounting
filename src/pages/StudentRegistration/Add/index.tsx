// @ts-nocheck
import { useEffect } from 'react'
import Spacer from 'src/components/view/Spacer'
import { useApp } from 'src/context/app.context'
import {
  StudentRegistrationProvider,
  useStudentRegistrationContext,
} from '../context/student-registration.context'
import FormContainer from '../components/FormContainer'

const StudentRegistrationAdd = () => {
  const { onSetBreadcrumbs } = useApp()

  useEffect(() => {
    onSetBreadcrumbs([
      {
        title: 'Student Registration',
        path: '/student-registration',
      },
      {
        title: 'Student Registration Add',
        path: '/student-registration/add',
      },
    ])
  }, [])
  return (
    <StudentRegistrationProvider>
      <FormContainer />
      <Spacer margin={'1rem auto'} />
    </StudentRegistrationProvider>
  )
}

export default StudentRegistrationAdd
