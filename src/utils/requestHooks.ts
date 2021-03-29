import axios from 'axios'
import { isLocal } from '../components/common/isLocal'
import { useMutation, useQuery } from 'react-query';
import NotyfContext from '../components/common/NotyfContext';
import { useContext } from 'react';
import { getErrorMessage } from './getErrorMessage';

export const useNotyf = () => {
  const notyf = useContext(NotyfContext)

  return notyf
}

export const useNCMutation = (func, options) => {
  const notyf = useNotyf()

  const mutation = useMutation(func, {
    ...options,
    onError: (err) => {
      notyf.error(getErrorMessage(err))
    },
  })

  return {
    ...mutation,
    errorMessage: getErrorMessage(mutation.error)
  }
}