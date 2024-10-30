// @ts-nocheck
import React from 'react'
import { IRoute } from 'src/models/navigation.model'

import { BiBook, BiWallet } from 'react-icons/bi'
import { BsDatabaseAdd } from 'react-icons/bs'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { FiUser, FiUserPlus } from 'react-icons/fi'
import { GrTransaction } from 'react-icons/gr'
import {
  MdOutlineDashboard,
  MdOutlineDiscount,
  MdOutlinePayments,
  MdOutlinePlayLesson,
  MdOutlineShoppingCart,
} from 'react-icons/md'
import {
  TbArchive,
  TbBoxSeam,
  TbCreditCard,
  TbReportAnalytics,
  TbTools,
  TbTruckLoading,
  TbUsers,
} from 'react-icons/tb'

import { USER_ROLE_ENUM } from 'src/enums/enums'

const AccountingAccount = React.lazy(
  () => import('src/pages/Accounting/Accounts'),
)
const AccountingAccountDetail = React.lazy(
  () => import('src/pages/Accounting/Detail'),
)
const AccountingTransactions = React.lazy(
  () => import('src/pages/Accounting/Transactions'),
)
const AccountingTransactionsDetail = React.lazy(
  () => import('src/pages/Accounting/Transactions/Detail'),
)
const AccountingAddTransactions = React.lazy(
  () => import('src/pages/Accounting/AddTransactions'),
)
const AccountingReports = React.lazy(
  () => import('src/pages/Accounting/Reports'),
)

const Dashboard = React.lazy(() => import('src/pages/Dashboard'))

const Course = React.lazy(() => import('src/pages/Course'))
const CourseDetail = React.lazy(() => import('src/pages/Course/Detail'))

const Teacher = React.lazy(() => import('src/pages/Teacher'))
const TeacherDetail = React.lazy(() => import('src/pages/Teacher/Detail'))
const TeacherAdd = React.lazy(() => import('src/pages/Teacher/Add'))
const TeacherEdit = React.lazy(() => import('src/pages/Teacher/Edit'))

const Books = React.lazy(() => import('src/pages/Books'))
const BooksDetail = React.lazy(() => import('src/pages/Books/Detail'))

const Class = React.lazy(() => import('src/pages/Class'))
const ClassDetail = React.lazy(() => import('src/pages/Class/Detail'))
const ClassAdd = React.lazy(() => import('src/pages/Class/Add'))
const ClassEdit = React.lazy(() => import('src/pages/Class/Edit'))

const StudentRegistration = React.lazy(
  () => import('src/pages/StudentRegistration'),
)
const StudentRegistrationAdd = React.lazy(
  () => import('src/pages/StudentRegistration/Add'),
)
const StudentRegistrationDetail = React.lazy(
  () => import('src/pages/StudentRegistration/Detail'),
)
const StudentRegistrationUpdateClass = React.lazy(
  () => import('src/pages/StudentRegistration/UpdateClass'),
)

const StudentEdit = React.lazy(() => import('src/pages/Student/Edit'))
const StudentDetail = React.lazy(() => import('src/pages/Student/Detail'))

const StudentEquipment = React.lazy(() => import('src/pages/StudentEquipment'))

const SalesInvoice = React.lazy(
  () => import('src/pages/Transaction/SalesInvoice'),
)

const PurchaseReport = React.lazy(() => import('src/pages/PurchaseReport'))
const SalesInvoiceDetail = React.lazy(
  () => import('src/pages/Transaction/SalesInvoice/Detail'),
)

const DiscountVoucher = React.lazy(() => import('src/pages/DiscountVoucher'))
const Salary = React.lazy(() => import('src/pages/Salary'))

const CourseVoucher = React.lazy(() => import('src/pages/CourseVoucher'))

const StockOrderList = React.lazy(() => import('src/pages/StockOrder'))
const StockOrderDetail = React.lazy(() => import('src/pages/StockOrder/Detail'))
const StockReceiverOrderItemDetail = React.lazy(
  () => import('src/pages/StockOrder/ReceiveOrderItemDetail'),
)
const StockOrderOrder = React.lazy(() => import('src/pages/StockOrder/Order'))

const PrintSalesInvoice = React.lazy(
  () => import('src/pages/Print/PrintSalesInvoice'),
)

// IBO
const IBO_Order = React.lazy(() => import('src/pages/IBO/Order'))
const IBO_OrderDetail = React.lazy(() => import('src/pages/IBO/Order/Detail'))
const IBO_OrderSendDetail = React.lazy(
  () => import('src/pages/IBO/Order/SendOrderDetail'),
)

const TrainingCenterUser = React.lazy(
  () => import('src/pages/IBO/User/TrainingCenter'),
)
const TrainingCenterUserDetail = React.lazy(
  () => import('src/pages/IBO/User/TrainingCenter/Detail'),
)
const TrainingCenterUserAdd = React.lazy(
  () => import('src/pages/IBO/User/TrainingCenter/Add'),
)
const TrainingCenterUserEdit = React.lazy(
  () => import('src/pages/IBO/User/TrainingCenter/Edit'),
)

const IBO_BookStock = React.lazy(() => import('src/pages/IBO/Stock/Book'))
const IBO_BookStockDetail = React.lazy(
  () => import('src/pages/IBO/Stock/Book/Detail'),
)
const IBO_BookStockStockDetail = React.lazy(
  () => import('src/pages/IBO/Stock/Book/StockDetail'),
)
const IBO_BookStockAdd = React.lazy(
  () => import('src/pages/IBO/Stock/Book/Add'),
)
const IBO_BookStockEdit = React.lazy(
  () => import('src/pages/IBO/Stock/Book/Edit'),
)

const IBO_StudentEquipmentStock = React.lazy(
  () => import('src/pages/IBO/Stock/StudentEquipment'),
)
const IBO_StudentEquipmentStockDetail = React.lazy(
  () => import('src/pages/IBO/Stock/StudentEquipment/Detail'),
)
const IBO_StudentEquipmentStockAdd = React.lazy(
  () => import('src/pages/IBO/Stock/StudentEquipment/Add'),
)
const IBO_StudentEquipmentStockEdit = React.lazy(
  () => import('src/pages/IBO/Stock/StudentEquipment/Edit'),
)

const IBO_CourseVoucherDataCenter = React.lazy(
  () => import('src/pages/IBO/DataCenter/CourseVoucher'),
)

const IBO_SupplierOrder = React.lazy(
  () => import('src/pages/IBO/SupplierOrder'),
)
const IBO_SupplierOrderDetail = React.lazy(
  () => import('src/pages/IBO/SupplierOrder/Detail'),
)
const IBO_SupplierReceiveOrderItem = React.lazy(
  () => import('src/pages/IBO/SupplierOrder/ReceiveOrderItem'),
)
const IBO_SupplierReceiveOrderItemDetail = React.lazy(
  () => import('src/pages/IBO/SupplierOrder/ReceiveOrderItemDetail'),
)
const IBO_SupplierOrderAdd = React.lazy(
  () => import('src/pages/IBO/SupplierOrder/Add'),
)
const IBO_Supplier = React.lazy(() => import('src/pages/IBO/Supplier'))
const IBO_SupplierDetail = React.lazy(
  () => import('src/pages/IBO/Supplier/Detail'),
)
const IBO_SupplierAdd = React.lazy(() => import('src/pages/IBO/Supplier/Add'))
const IBO_SupplierEdit = React.lazy(() => import('src/pages/IBO/Supplier/Edit'))

const IBO_ReportPurchase = React.lazy(
  () => import('src/pages/IBO//Report/Purchase'),
)
const IBO_ReportSales = React.lazy(() => import('src/pages/IBO/Report/Sales'))
const IBO_ReportStocks = React.lazy(() => import('src/pages/IBO/Report/Stocks'))

const IBO_CreditDebts = React.lazy(() => import('src/pages/IBO/Credit/Debts'))
const IBO_CreditReceivables = React.lazy(
  () => import('src/pages/IBO/Credit/Receivables'),
)

export const nav: IRoute[] = [
  {
    path: '/dashboard',
    key: 'dashboard',
    label: 'Dashboard',
    component: Dashboard,
    children: [],
    icon: <MdOutlineDashboard size={16} />,
    isNav: true,
    isAllowed: [USER_ROLE_ENUM?.tc, USER_ROLE_ENUM?.ibo],
  },
  // {
  //   path: '/suppliers',
  //   name: 'suppliers',
  //   key: 'suppliers',
  //   label: 'Suppliers',
  //   component: IBO_Supplier,
  //   children: [],
  //   icon: <TbTruckLoading size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  // {
  //   path: '/supplier-order',
  //   name: 'supplier-order',
  //   key: 'supplier-order',
  //   label: 'Supplier Order',
  //   component: IBO_SupplierOrder,
  //   children: [],
  //   icon: <TbBoxSeam size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  // {
  //   path: '/course',
  //   name: 'course',
  //   key: 'course',
  //   label: 'Course',
  //   component: Course,
  //   children: [],
  //   icon: <MdOutlinePlayLesson size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },
  // {
  //   path: '/teacher',
  //   name: 'teacher',
  //   key: 'teacher',
  //   label: 'Teacher',
  //   component: Teacher,
  //   children: [],
  //   icon: <FiUser size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },
  // {
  //   path: '/class',
  //   name: 'class',
  //   key: 'class',
  //   label: 'Class',
  //   component: Class,
  //   children: [],
  //   icon: <FaChalkboardTeacher size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },
  // {
  //   path: '',
  //   name: 'stock-order-tc',
  //   key: 'stock-order-tc',
  //   label: 'Stock Order',
  //   component: null,
  //   children: [
  //     {
  //       path: '/stock-order/buy-stock',
  //       name: 'stock-order-buy',
  //       key: 'stock-order-buy',
  //       label: 'Buy Stock',
  //       component: StockOrderOrder,
  //     },
  //     {
  //       path: '/stock-order/orders',
  //       name: 'stock-order-orders',
  //       key: 'stock-order-orders',
  //       label: 'Order List',
  //       component: StockOrderList,
  //     },
  //     {
  //       path: '/purchase-report',
  //       name: 'purchase-report',
  //       key: 'purchase-report',
  //       label: 'Purchase Report',
  //       component: StockOrderList,
  //     },
  //   ],
  //   icon: <TbArchive size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },
  // {
  //   path: '',
  //   name: 'stock-tc',
  //   key: 'stock-tc',
  //   label: 'Stock',
  //   component: null,
  //   children: [
  //     {
  //       path: '/books',
  //       name: 'books',
  //       key: 'books',
  //       label: 'Book',
  //       component: Books,
  //     },
  //     {
  //       path: '/student-equipment',
  //       name: 'Student Equipment',
  //       key: 'student-equipment',
  //       label: 'Equipment',
  //       component: StudentEquipment,
  //     },
  //   ],
  //   icon: <TbArchive size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },
  // {
  //   path: '/student-registration',
  //   name: 'Student Registration',
  //   key: 'student-registration',
  //   label: 'Student Registration',
  //   component: StudentRegistration,
  //   children: [],
  //   icon: <FiUserPlus size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },

  // {
  //   path: '/discount-voucher',
  //   name: 'Discount Voucher',
  //   key: 'discount-voucher',
  //   label: 'Discount Voucher',
  //   component: DiscountVoucher,
  //   children: [],
  //   icon: <MdOutlineDiscount size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },

  {
    path: '/salary',
    name: 'Salary',
    key: 'salary',
    label: 'Salary',
    component: Salary,
    children: [],
    icon: <MdOutlinePayments size={16} />,
    isNav: true,
    isAllowed: [USER_ROLE_ENUM?.tc],
  },

  // {
  //   path: '',
  //   name: 'Transaction',
  //   key: 'transaction',
  //   label: 'Transaction',
  //   component: null,
  //   children: [
  //     {
  //       path: '/sales-invoice',
  //       key: 'sales-invoice',
  //       label: 'Sales Invoice',
  //       component: SalesInvoice,
  //       icon: null,
  //     },
  //   ],

  //   icon: <GrTransaction size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.tc],
  // },

  // {
  //   path: '/order',
  //   name: 'tc-order',
  //   key: 'tc-order',
  //   label: 'TC Order',
  //   component: IBO_Order,
  //   children: [],
  //   icon: <MdOutlineShoppingCart size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },

  // {
  //   path: '',
  //   name: 'Data Center',
  //   key: 'data-center-ibo',
  //   label: 'Data Center',
  //   component: null,
  //   children: [
  //     {
  //       path: '/data-center/course',
  //       name: 'data-center-course',
  //       key: 'data-center-course',
  //       label: 'Course',
  //       component: Course,
  //       icon: null,
  //     },
  //     {
  //       path: '/data-center/course-voucher',
  //       name: 'data-center-course-voucher',
  //       key: 'data-center-course-voucher',
  //       label: 'Course Voucher',
  //       component: IBO_CourseVoucherDataCenter,
  //       icon: null,
  //     },
  //   ],
  //   icon: <BsDatabaseAdd size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  // {
  //   path: '',
  //   name: 'User',
  //   key: 'user-ibo',
  //   label: 'User',
  //   component: null,
  //   children: [
  //     {
  //       path: '/user/training-center',
  //       key: 'user-training-center',
  //       label: 'Training Center (TC)',
  //       component: TrainingCenterUser,
  //       icon: null,
  //     },
  //   ],
  //   icon: <TbUsers size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  // {
  //   path: '',
  //   name: 'Stock',
  //   key: 'stock-ibo',
  //   label: 'Stock',
  //   component: null,
  //   children: [
  //     {
  //       path: '/stock/books',
  //       key: 'stock-books',
  //       label: 'Book',
  //       component: IBO_BookStock,
  //       icon: null,
  //     },
  //     {
  //       path: '/stock/student-equipment',
  //       key: 'stock-student-equipment',
  //       label: 'Student Equipment',
  //       component: IBO_StudentEquipmentStock,
  //       icon: null,
  //     },
  //   ],
  //   icon: <TbArchive size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  // {
  //   path: '',
  //   name: 'report-ibo',
  //   key: 'report-ibo',
  //   label: 'Report',
  //   component: null,
  //   children: [
  //     {
  //       path: '/report/purchase',
  //       key: 'report-ibo-purchase',
  //       label: 'Purchase',
  //       component: IBO_ReportPurchase,
  //       icon: null,
  //     },
  //     {
  //       path: '/report/sales',
  //       key: 'report-ibo-sales',
  //       label: 'Sales',
  //       component: IBO_ReportSales,
  //       icon: null,
  //     },
  //     {
  //       path: '/report/stocks',
  //       key: 'report-ibo-stocks',
  //       label: 'Stocks',
  //       component: IBO_ReportStocks,
  //       icon: null,
  //     },
  //   ],
  //   icon: <TbReportAnalytics size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  // {
  //   path: '',
  //   name: 'credit',
  //   key: 'credit',
  //   label: 'Credit',
  //   component: null,
  //   children: [
  //     {
  //       path: '/credit/debts',
  //       key: 'credit-debts',
  //       label: 'Debts',
  //       component: IBO_CreditDebts,
  //       icon: null,
  //     },
  //     {
  //       path: '/credit/receivables',
  //       key: 'credit-receivables',
  //       label: 'Receivables',
  //       component: IBO_CreditReceivables,
  //       icon: null,
  //     },
  //   ],
  //   icon: <TbCreditCard size={16} />,
  //   isNav: true,
  //   isAllowed: [USER_ROLE_ENUM?.ibo],
  // },
  {
    path: '',
    name: 'accounting',
    key: 'accounting',
    label: 'Accounting',
    component: null,
    children: [
      {
        path: '/accounting/accounts',
        key: 'accounting-accounts',
        label: 'Accounts',
        component: AccountingAccount,
        icon: null,
      },
      {
        path: '/accounting/transactions',
        key: 'accounting-transactions',
        label: 'Transactions',
        component: AccountingAccount,
        icon: null,
      },
      {
        path: '/accounting/reports',
        key: 'accounting-reports',
        label: 'Reports',
        component: AccountingReports,
        icon: null,
      },
    ],
    icon: <BiWallet size={16} />,
    isNav: true,
  },
]

export const routes: IRoute[] = [
  {
    path: '/dashboard',
    key: 'dashboard',
    label: 'Dashboard',
    component: Dashboard,
    children: [],
    icon: <MdOutlineDashboard size={16} />,
    isNav: true,
  },
  {
    path: '/salary',
    key: 'salary',
    label: 'Salary',
    component: Salary,
    children: [],
    icon: <MdOutlinePayments size={16} />,
    isNav: true,
  },
  {
    path: '/course',
    name: 'course',
    key: 'course',
    label: 'Course',
    component: Course,
    children: [],
    icon: <MdOutlinePlayLesson size={16} />,
    isNav: true,
  },
  {
    path: '/course/:id',
    name: 'Course Detail',
    key: 'course_detail',
    label: 'Course Detail',
    component: CourseDetail,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/teacher',
    name: 'teacher',
    key: 'teacher',
    label: 'Teacher',
    component: Teacher,
    children: [],
    icon: <FiUser size={16} />,
    isNav: true,
  },
  {
    path: '/teacher/:id',
    name: 'Teacher Detail',
    key: 'teacher_detail',
    label: 'Teacher Detail',
    component: TeacherDetail,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/teacher/add',
    name: 'Teacher Add',
    key: 'teacher_add',
    label: 'Teacher Add',
    component: TeacherAdd,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/teacher/edit/:id',
    name: 'Teacher Edit',
    key: 'teacher_edit',
    label: 'Teacher Edit',
    component: TeacherEdit,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/books',
    name: 'books',
    key: 'books',
    label: 'Book',
    component: Books,
    children: [],
    icon: <BiBook size={16} />,
    isNav: true,
  },
  {
    path: '/class',
    name: 'class',
    key: 'class',
    label: 'Class',
    component: Class,
    children: [],
    icon: <FaChalkboardTeacher size={16} />,
    isNav: true,
  },
  {
    path: '/class/:id',
    name: 'Class Detail',
    key: 'class_detail',
    label: 'Class Detail',
    component: ClassDetail,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/class/add',
    name: 'Class Add',
    key: 'class_add',
    label: 'Class Add',
    component: ClassAdd,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/class/edit/:id',
    name: 'Class Edit',
    key: 'class_edit',
    label: 'Class Edit',
    component: ClassEdit,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/books/:id',
    name: 'Book Detail',
    key: 'book_detail',
    label: 'Book Detail',
    component: BooksDetail,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/student-registration',
    name: 'Student Registration',
    key: 'student-registration',
    label: 'Student Registration',
    component: StudentRegistration,
    children: [],
    icon: <FiUserPlus size={16} />,
    isNav: true,
  },
  {
    path: '/student-registration/add',
    name: 'Student Registration Add',
    key: 'student-registration-add',
    label: 'Add Student Registration',
    component: StudentRegistrationAdd,
    icon: null,
    isNav: false,
  },
  {
    path: '/student-registration/:id',
    name: 'Student Registration Detail',
    key: 'student-registration-detail',
    label: 'Student Registration Detail',
    component: StudentRegistrationDetail,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/student-registration/:id/change-class',
    name: 'Student Registration Detail',
    key: 'student-registration-detail-update-class',
    label: 'Student Registration Detail Update Class',
    component: StudentRegistrationUpdateClass,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/student/:id',
    name: 'Student Detail',
    key: 'student_detail',
    label: 'Student Detail',
    component: StudentDetail,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/student/edit/:id',
    name: 'Student Edit',
    key: 'student_edit',
    label: 'Student Edit',
    component: StudentEdit,
    children: [],
    icon: null,
    isNav: false,
  },
  {
    path: '/student-equipment',
    name: 'Student Equipment',
    key: 'student-equipment',
    label: 'Student Equipment',
    component: StudentEquipment,
    children: [],
    icon: <TbTools size={16} />,
    isNav: true,
  },
  {
    path: '/purchase-report',
    key: 'purchase-report',
    label: 'Purchase Report',
    component: PurchaseReport,
    icon: null,
  },
  {
    path: '/sales-invoice',
    key: 'sales-invoice',
    label: 'Sales Invoice',
    component: SalesInvoice,
    icon: null,
  },
  {
    path: '/sales-invoice/:id',
    key: 'sales-invoice-detail',
    label: 'Sales Invoice Detail',
    component: SalesInvoiceDetail,
    icon: null,
  },
  {
    path: '/discount-voucher',
    name: 'Discount Voucher',
    key: 'discount-voucher',
    label: 'Discount Voucher',
    component: DiscountVoucher,
    children: [],
    icon: <MdOutlineDiscount size={16} />,
    isNav: true,
  },
  {
    path: '/course-voucher',
    name: 'Course Voucher',
    key: 'course-voucher',
    label: 'Course Voucher',
    component: CourseVoucher,
    children: [],
    icon: <MdOutlineDiscount size={16} />,
    isNav: true,
  },
  {
    path: '/stock-order/buy-stock',
    name: 'stock-order-buy',
    key: 'stock-order-buy',
    label: 'Buy Stock',
    component: StockOrderOrder,
  },
  {
    path: '/stock-order/orders',
    name: 'stock-order-orders',
    key: 'stock-order-orders',
    label: 'Order List',
    component: StockOrderList,
  },
  {
    path: '/stock-order/orders/:id',
    name: 'stock-order-orders-detail',
    key: 'stock-order-orders-detail',
    label: 'Order Detail',
    component: StockOrderDetail,
  },
  {
    path: '/stock-order/orders/:id/receive-order-item/detail/:orderId',
    name: 'stock-order-orders-detail-receive-order-detail',
    key: 'stock-order-orders-detail-receive-order-detail',
    label: 'Receive Order Detail',
    component: StockReceiverOrderItemDetail,
  },
  {
    path: '/accounting/accounts',
    name: 'accounting-accounts',
    key: 'accounting-accounts',
    label: 'Accounts',
    component: AccountingAccount,
  },
  {
    path: '/accounting/accounts/:id',
    name: 'accounting-accounts-detail',
    key: 'accounting-accounts-detail',
    label: 'Account Detail',
    component: AccountingAccountDetail,
  },
  {
    path: '/accounting/transactions',
    name: 'accounting-transactions',
    key: 'accounting-transactions',
    label: 'Transactions',
    component: AccountingTransactions,
  },
  {
    path: '/accounting/transactions/:id',
    name: 'accounting-transaction-detail',
    key: 'accounting-transaction-detail',
    label: 'Transaction Detail',
    component: AccountingTransactionsDetail,
  },
  {
    path: '/accounting/reports',
    name: 'accounting-reports',
    key: 'accounting-reports',
    label: 'Reports',
    component: AccountingReports,
  },
  {
    path: '/accounting/transactions/add',
    name: 'accounting-add-transactions',
    key: 'accounting-add-transactions',
    label: 'Add Transactions',
    component: AccountingAddTransactions,
  },
  {
    path: '/accounting/transactions/edit/:id',
    name: 'accounting-edit-transactions',
    key: 'accounting-edit-transactions',
    label: 'Edit Transactions',
    component: AccountingAddTransactions,
  },
  // {
  //   path: '/print/receipt/sales-invoice/:id',
  //   name: 'print-receipt-sales-invoice',
  //   key: 'print-receipt-sales-invoice',
  //   label: 'Print Receipt Sales Invoice',
  //   component: PrintSalesInvoice,
  // },
]

export const routes_ibo: IRoute[] = [
  {
    path: '/dashboard',
    key: 'dashboard',
    label: 'Dashboard',
    component: Dashboard,
    children: [],
    icon: <MdOutlineDashboard size={16} />,
  },
  {
    path: '/order',
    key: 'tc-order',
    label: 'TC Order',
    component: IBO_Order,
    icon: null,
  },
  {
    path: '/order/:id',
    key: 'tc-order-detail',
    label: 'TC Order Detail',
    component: IBO_OrderDetail,
    icon: null,
  },
  {
    path: '/order/:id/send-order-detail/:orderDetailId',
    key: 'tc-order-detail-send-order-detail',
    label: 'TC Order Detail',
    component: IBO_OrderSendDetail,
    icon: null,
  },
  {
    path: '/sales-invoice/ibo',
    key: 'sales-invoice-ibo',
    label: 'Sales Invoice',
    component: SalesInvoice,
    icon: null,
  },
  {
    path: '/user/training-center',
    key: 'user-training-center',
    label: 'Training Center (TC)',
    component: TrainingCenterUser,
    icon: null,
  },
  {
    path: '/user/training-center/:id',
    key: 'user-training-center-detail',
    label: 'Training Center Detail',
    component: TrainingCenterUserDetail,
    icon: null,
  },
  {
    path: '/user/training-center/add',
    key: 'user-training-center-add',
    label: 'Training Center Add',
    component: TrainingCenterUserAdd,
    icon: null,
  },
  {
    path: '/user/training-center/edit/:id',
    key: 'user-training-center-edit',
    label: 'Training Center Edit',
    component: TrainingCenterUserEdit,
    icon: null,
  },
  {
    path: '/stock/books',
    key: 'stock-books',
    label: 'Book Stock',
    component: IBO_BookStock,
    icon: null,
  },
  {
    path: '/stock/books/:id',
    key: 'stock-books-detail',
    label: 'Book Stock History',
    component: IBO_BookStockDetail,
    icon: null,
  },
  {
    path: '/stock/books/:id/stock',
    key: 'stock-stock-books-detail',
    label: 'Book Stock History',
    component: IBO_BookStockStockDetail,
    icon: null,
  },
  {
    path: '/stock/books/add',
    key: 'stock-books-add',
    label: 'Book Stock Add',
    component: IBO_BookStockAdd,
    icon: null,
  },
  {
    path: '/stock/books/edit/:id',
    key: 'stock-books-edit',
    label: 'Book Stock Edit',
    component: IBO_BookStockEdit,
    icon: null,
  },
  {
    path: '/stock/student-equipment',
    key: 'stock-student-equipment',
    label: 'Student Equipment',
    component: IBO_StudentEquipmentStock,
    icon: null,
  },
  {
    path: '/stock/student-equipment/:id',
    key: 'stock-student-equipment-detail',
    label: 'Student Equipment Stock Detail',
    component: IBO_StudentEquipmentStockDetail,
    icon: null,
  },
  {
    path: '/stock/student-equipment/:id/stock',
    key: 'stock-student-equipment-stock-history',
    label: 'Student Equipment Stock History',
    component: IBO_StudentEquipmentStockDetail,
    icon: null,
  },
  {
    path: '/stock/student-equipment/add',
    key: 'stock-student-equipment-add',
    label: 'Student Equipment Add',
    component: IBO_StudentEquipmentStockAdd,
    icon: null,
  },
  {
    path: '/stock/student-equipment/edit/:id',
    key: 'stock-student-equipment-edit',
    label: 'Student Equipment Edit',
    component: IBO_StudentEquipmentStockEdit,
    icon: null,
  },
  {
    path: '/data-center/course',
    name: 'data-center-course',
    key: 'data-center-course',
    label: 'Course',
    component: Course,
    children: [],
    icon: null,
  },
  {
    path: '/data-center/course/:id',
    name: 'data-center-course-detail',
    key: 'data-center-course-detail',
    label: 'Course Detail',
    component: CourseDetail,
    children: [],
    icon: null,
  },
  {
    path: '/data-center/course-voucher',
    name: 'data-center-course-voucher',
    key: 'data-center-course-voucher',
    label: 'Course Voucher',
    component: IBO_CourseVoucherDataCenter,
    children: [],
    icon: null,
  },
  {
    path: '/supplier-order',
    name: 'supplier-order',
    key: 'supplier-order',
    label: 'Supplier Order',
    component: IBO_SupplierOrder,
    children: [],
    icon: null,
  },
  {
    path: '/supplier-order/:id',
    name: 'supplier-order-detail',
    key: 'supplier-order-detail',
    label: 'Supplier Detail',
    component: IBO_SupplierOrderDetail,
    children: [],
    icon: null,
  },
  {
    path: '/supplier-order/:id/receive-order-item/:orderId',
    name: 'supplier-order-receive-order-item',
    key: 'supplier-order-receive-order-item',
    label: 'Supplier Receive Order Item',
    component: IBO_SupplierReceiveOrderItem,
    children: [],
    icon: null,
  },
  {
    path: '/supplier-order/:id/receive-order-item/detail/:orderId',
    name: 'supplier-order-receive-order-item-detail',
    key: 'supplier-order-receive-order-item-detail',
    label: 'Supplier Receive Order Item Detail',
    component: IBO_SupplierReceiveOrderItemDetail,
    children: [],
    icon: null,
  },
  {
    path: '/supplier-order/add',
    name: 'supplier-order-add',
    key: 'supplier-order-add',
    label: 'Supplier Add',
    component: IBO_SupplierOrderAdd,
    children: [],
    icon: null,
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    key: 'suppliers',
    label: 'Suppliers',
    component: IBO_Supplier,
    children: [],
    icon: null,
  },
  {
    path: '/supplier/detail/:supplierId',
    name: 'supplier-detail',
    key: 'supplier-detail',
    label: 'Supplier Detail',
    component: IBO_SupplierDetail,
    children: [],
    icon: null,
  },
  {
    path: '/supplier/add',
    name: 'supplier-add',
    key: 'supplier-add',
    label: 'Supplier Add',
    component: IBO_SupplierAdd,
    children: [],
    icon: null,
  },
  {
    path: '/supplier/edit/:supplierId',
    name: 'supplier-edit',
    key: 'supplier-edit',
    label: 'Supplier Edit',
    component: IBO_SupplierEdit,
    children: [],
    icon: null,
  },
  {
    path: '/report/purchase',
    key: 'report-ibo-purchase',
    label: 'Purchase',
    component: IBO_ReportPurchase,
    children: [],
    icon: null,
  },
  {
    path: '/report/sales',
    key: 'report-ibo-sales',
    label: 'Sales',
    component: IBO_ReportSales,
    children: [],
    icon: null,
  },
  {
    path: '/report/stocks',
    key: 'report-ibo-stocks',
    label: 'Stock',
    component: IBO_ReportStocks,
    children: [],
    icon: null,
  },
  {
    path: '/credit/debts',
    key: 'credit-debts',
    label: 'Debts',
    component: IBO_CreditDebts,
    children: [],
    icon: null,
  },
  {
    path: '/credit/receivables',
    key: 'credit-receivables',
    label: 'Receivables',
    component: IBO_CreditReceivables,
    children: [],
    icon: null,
  },
  {
    path: '/accounting/accounts',
    name: 'accounting-accounts',
    key: 'accounting-accounts',
    label: 'Accounts',
    component: AccountingAccount,
  },
  {
    path: '/accounting/accounts/:id',
    name: 'accounting-accounts-detail',
    key: 'accounting-accounts-detail',
    label: 'Account Detail',
    component: AccountingAccountDetail,
  },
  {
    path: '/accounting/transactions',
    name: 'accounting-transactions',
    key: 'accounting-transactions',
    label: 'Transactions',
    component: AccountingTransactions,
  },
  {
    path: '/accounting/transactions/:id',
    name: 'accounting-transaction-detail',
    key: 'accounting-transaction-detail',
    label: 'Transaction Detail',
    component: AccountingTransactionsDetail,
  },
  {
    path: '/accounting/reports',
    name: 'accounting-reports',
    key: 'accounting-reports',
    label: 'Reports',
    component: AccountingReports,
  },
  {
    path: '/accounting/transactions/add',
    name: 'accounting-add-transactions',
    key: 'accounting-add-transactions',
    label: 'Add Transactions',
    component: AccountingAddTransactions,
  },
  {
    path: '/accounting/transactions/edit/:id',
    name: 'accounting-edit-transactions',
    key: 'accounting-edit-transactions',
    label: 'Edit Transactions',
    component: AccountingAddTransactions,
  },
]
