import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api'

function useTrackPageView() {
  const location = useLocation()
  useEffect(() => {
    api.post('/track', { path: location.pathname }).catch(() => {})
  }, [location.pathname])
}

export default useTrackPageView