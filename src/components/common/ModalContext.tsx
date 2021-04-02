import clsx from 'clsx'
import React, { useRef } from 'react'
import useOnClickOutside from 'use-onclickoutside'
import Button from './Button'

export let ModalContext
let { Provider } = (ModalContext = React.createContext(null))

export let ModalProvider = ({ children }) => {
  let { modal, handleModal, confirmDialouge, modalContent } = useModal()
  return (
    <Provider value={{ modal, handleModal, confirmDialouge, modalContent }}>
      <Modal />
      {children}
    </Provider>
  )
}

const Modal = () => {
  let { modalContent, handleModal, modal } = React.useContext(ModalContext)
  const ref = useRef(null)
  const exit = () => modal && handleModal()
  useOnClickOutside(ref, exit)
  if (!modal) {
    return null
  }
  return (
    <ModalBase clickOutside={exit} title={modalContent.title}>
      {modalContent.content}
    </ModalBase>
  )
}

export const ModalBase = ({ title, children, clickOutside }) => {
  const ref = useRef(null)
  useOnClickOutside(ref, clickOutside)

  return (
    <div className={clsx('py-12 bg-black bg-opacity-50 absolute top-0 left-0 right-0 bottom-0 z-20 flex center')}>
      <div
        ref={ref}
        className="flex h-auto w-full max-w-2xl p-4 bg-white shadow-xl border-b-4 border-r-4 border-red-500"
      >
        <div className="flex-1 p-8">
          <h2 className="font-bold text-2xl">{title}</h2>
          <div className="border-t my-4"></div>
          {children}
        </div>
      </div>
    </div>
  )
}

const useModal = () => {
  let [modal, setModal] = React.useState(false)
  let [modalContent, setModalContent] = React.useState({
    content: <></>,
    title: '',
  })

  let handleModal = (content?) => {
    console.log('content: ', content)
    setModal(!modal)
    if (content) {
      setModalContent(content)
    }
  }

  const confirmDialouge = ({ title, description }, onConfirm) => {
    handleModal({
      title: title,
      content: (
        <div>
          <p>{description}</p>
          <div className="flex justify-between">
            <Button onClick={onConfirm}>Yes</Button>
            <Button
              onClick={() => {
                handleModal()
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
    })
  }

  return { modal, handleModal, confirmDialouge, modalContent }
}
